// 从v2.11.2起，SDK 支持了 WebSocket，推荐接入；v2.10.2及以下版本，使用 HTTP
import TIM from 'tim-wx-sdk-ws';
import TIMUploadPlugin from 'tim-upload-plugin';
import timConfig from "../config/tim";
import User from "./user";
import genTestUserSig from "../lib/tim/generate-test-usersig";
class Tim {
    /**
     *
     * @type {Tim}
     *
     */
    _SDKInstance = null;
    _nextReqMessageID = '';
    _messageList = [];

    static  instance = null;
    constructor() {
        // 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
        let tim = TIM.create(timConfig.options); // SDK 实例通常用 tim 表示

        // 设置 SDK 日志输出级别，详细分级请参见 <a href="https://web.sdk.qcloud.com/im/doc/zh-cn//SDK.html#setLogLevel">setLogLevel 接口的说明</a>
        tim.setLogLevel(timConfig.longLevel); // 普通级别，日志量较多，接入时建议使用
        // tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用

        // 注册腾讯云即时通信 IM 上传插件
        tim.registerPlugin({
            'tim-upload-plugin': TIMUploadPlugin
        });
        this._SDKInstance = tim
    }
    getSDKInstance() {
        return this._SDKInstance
    }
    static getInstance () {
        if (!Tim.instance) {
            Tim.instance = new Tim()
        }

        return Tim.instance;
    }
    logout () {
        this._SDKInstance.logout();
    }
    async getUserProfile (targetUserId) {
        const res = await this._SDKInstance.getUserProfile({
            userIDList: [targetUserId]
        })
        return res;
    }
    async updateUserProfile (userInfo) {
        await this._SDKInstance.updateMyProfile({
            nick: userInfo.nickname,
            avatar: userInfo.avatar,
            gender: userInfo.gender === 1 ? TIM.TYPES.GENDER_MALE : TIM.TYPES.GENDER_FEMALE
        })
    }
    async getMessageList (targetUserId, count = 10) {
        if (this.isCompleted) {
            return this._messageList
        }
        const res = await this._SDKInstance.getMessageList({
            conversationID: `c2c${targetUserId}`,
            nextReqMessageID: this._nextReqMessageID,
            count: count > 15 ? 15 : count
        });
        this._nextReqMessageID = res.data.nextReqMessageID;
        this.isCompleted = res.data.isCompleted;
        this._messageList = res.data.messageList;

        return this._messageList
    }
    createMessage (type, content, targetUserId, extension = null) {
        let message;
        const params = {
            to:targetUserId,
            conversationType: TIM.TYPES.CONV_C2C,
            payload: null
        };
        switch (type) {
            case TIM.TYPES.MSG_TEXT:
                params.payload = { text:content };
                message = this._SDKInstance.createTextMessage(params);
                break;
            case TIM.TYPES.MSG_IMAGE:
                params.payload = { file: content };
                message = this._SDKInstance.createImageMessage(params);
                break;
            case TIM.TYPES.MSG_CUSTOM:
                params.payload = { data: 'service', description: JSON.stringify(content), extension };
                message = this._SDKInstance.createCustomMessage(params);
                break;
            default:
                throw Error('未知消息');
        }
        return message;
    }
    async sendMessage (message) {
        this._SDKInstance.sendMessage()
    }
    reset () {
        this._nextReqMessageID = '';
        this.isCompleted = false;
        this._messageList = [];
        return this;
    }

    login () {
        const userInfo = User.getUserInfoByLocal();
        const textUserSign = genTestUserSig(userInfo.id.toString());
        this._SDKInstance.login({
            userID: userInfo.id.toString(),
            userSig: textUserSign.userSig
        })
    }

    async setMessageRead (targetUserId) {
        const res = await this._SDKInstance.setMessageRead({
            conversationID: `C2C${targetUserId}`
        });
        return res.data;
    }


    async getConversationList () {
        const res = await this._SDKInstance.getConversationList();
        return res.data.conversationList;
    }

}

export default Tim;