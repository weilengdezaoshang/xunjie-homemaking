import APIConfig from "../config/api";
import exceptionMessage from "../config/exception-message";
import {wxToPromise} from "./wx";
import User from "../model/user";
import cache from "../enum/cache";
import {timStore} from "../store/tim";
import { createStoreBindings } from "mobx-miniprogram-bindings";
class Http {
    static async request ({url, data, method = 'GET', refetch = true}) {
        let res;
        try {
            res = await wxToPromise('request',{
                url: APIConfig.baseUrl + url,
                data,
                method,
                header: {
                    token:wx.getStorageSync(cache.TOKEN)
                }
            });
        } catch (e) {
            Http.showMessage(-1);
            throw new Error(e.errMsg)
        }
        if (res.statusCode < 400) {
                return res.data.data;
        }

        if (res.statusCode === 401) {
            this.storeBindings = createStoreBindings(this, {
                store: timStore,
                fields: ["sdkReady"],
                actions: {timLogout:"logout"},
            });
            if (res.data.error_code === 10001) {
                if (this.sdkReady) {
                    this.timLogout()
                }
                await wx.navigateTo({
                    url: '/pages/login/login'
                });
                throw Error('请求未携带令牌')
            }
            if (refetch) {
                return Http._refetch({url, data, method, refetch });
            }
            if (this.sdkReady) {
                this.timLogout()
            }

        }
        Http.showMessage(res.data.error_code, res.data.message);
        const error =  Http._generateMessage(res.data.message);

        throw Error(error)
    }
    // 错误信息处理
    static showMessage (errCode, message) {
        let title = '';
        const errorMessage = exceptionMessage[errCode];
        title = errorMessage || message || '未知异常';
        title = Http._generateMessage(title);
        wx.showToast({
            title,
            icon: 'none',
            duration: 3000
        })
    }

    static _generateMessage (message) {
        return typeof message === 'object' ? Object.values(message).join(';') : message
    }

    static async _refetch (data) {
        await User.login();
        data.refetch = false;
        return Http.request(data)
    }
}

export default Http;