import  { observable, action}  from "mobx-miniprogram";
import Tim from "../model/tim";
import TIM from "tim-wx-sdk-ws"
import User from "../model/user";
import {setTabBarBadge} from "../utils/wx";

export const timStore = observable({
    sdkReady:false,
    messageList: [],
    _targetUserId: null,
    intoView: 0,
    isCompleted: false,
    conversationList: [],

    login: action(function () {
        this._runListener();
        Tim.getInstance().login();
    }),

    _runListener () {
        const sdk =  Tim.getInstance().getSDKInstance();
        sdk.on(TIM.EVENT.SDK_READY, this._handleSDKReady, this);
        sdk.on(TIM.EVENT.SDK_NOT_READY, this._handleSDKNotReady, this);
        sdk.on(TIM.EVENT.KICKED_OUT, this._handleSDKNotReady, this);
        sdk.on(TIM.EVENT.MESSAGE_RECEIVED, this._handleMessageReceived, this);
        sdk.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, this._handleConversationListUpdated, this);
    },

    _handleSDKReady () {
        this.sdkReady = true;
        const  userInfo = User.getUserInfoByLocal();
        Tim.getInstance().updateUserProfile(userInfo);
    },
    _handleSDKNotReady () {
        this.sdkReady = false;
    },
    logout: action(function () {
        Tim.getInstance().logout();
    }),
    async _handleMessageReceived (event) {
        if (!this._targetUserId) {
            return;
        }
        const currentConverSationMessage = event.data.filter(item => item.from === this._targetUserId);
        if (currentConverSationMessage.length) {
            this.messageList = this.messageList.concat(currentConverSationMessage);
            this.intoView = this.messageList.length - 1;
            await Tim.getInstance().setMessageRead(this._targetUserId);
        }
    },
    setTargetUserId:action( function (targetUserId) {
        this._targetUserId = targetUserId
    }),
    getMessageList: action(async function () {
        if (this._targetUserId) {
            return
        }
        this.messageList = await Tim.getInstance().reset().getMessageList(this._targetUserId);
        this.intoView = this.messageList.length - 1;
        await Tim.getInstance().setMessageRead(this._targetUserId);
    }),
    pushMessage: action(function (message) {
        this.messageList = this.messageList.concat([message]);
        this.intoView = this.messageList.length - 1
    }),
    scrollMessageList: action(async function () {
        const messageList =  await Tim.getInstance().getMessageList(this._targetUserId);
        this.intoView = messageList.length - 2;
        this.isCompleted = Tim.getInstance().isCompleted;
        /**
         * tips
         * 1. MobX 中属性的值是 Array 的时候，他是一个被包装过的 Array，并非原生 Array，它是一个响应式对象
         * 2. 经过包装的 Array 同样具备大多数原生 Array 所具备的方法。
         * 3. 想把响应式的对象数组变成普通数组，可以调用slice()函数遍历所有对象元素生成一个新的普通数组
         */
        this.messageList = messageList.concat(this.messageList.slice())
    }),
    getConversationList: action(async function () {
        this.conversationList = await Tim.getInstance().getConversationList()
    }),
    _handleConversationListUpdated (event) {
        if (event.data.length) return;
        this.conversationList = event.data;

        const unreadCount = event.data.reduce((sum, item) => sum + item.unreadCount, 0);
        setTabBarBadge(unreadCount)
    },
    resetMessage: action(function () {
        this.messageList = [];
        this._targetUserId = null;
        this.intoView = 0;
        this.isCompleted = false;
    })
});