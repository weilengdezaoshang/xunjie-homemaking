import User from "../../model/user";
import {createStoreBindings} from "mobx-miniprogram-bindings";
import {timStore} from "../../store/tim";

Page({
    data: {},
    onLoad: function (options) {
        this.storeBindings = createStoreBindings(this, {
            store: timStore,
            actions: { timLogin: 'login'}
        });
    },
    onUnload() {
        this.storeBindings.destroyStoreBindings();
    },
    handleLogin: async function () {
        const res =  await wx.getUserProfile({
            desc: "完善用户信息"
        });
        await wx.showLoading({
            title: '正在授权',
            mask: true
        });
        try {
            await User.login();
            await User.updateUserInfo(res.userInfo);
            this.timLogin();
            const events = this.getOpenerEventChannel();
            events.emit('login');
            await wx.navigateBack();
        } catch (e) {
            await wx.showModal({
                title: '注意',
                content: '登录失败，请稍后重试',
                showCancel: false
            })
        }
        await wx.hideLoading();

    },
    handleToHome: async function () {
        await wx.switchTab({
            url: '/pages/home/home'
        })
    }
});