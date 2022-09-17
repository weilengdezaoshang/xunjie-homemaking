import Tim from "../../model/tim";
import TIM from "tim-wx-sdk-ws";
import {createStoreBindings} from "mobx-miniprogram-bindings";
import {timStore} from "../../store/tim";

Page({
    data: {
        targetUserId: null,
        service: null
    },
    onLoad: function (options) {

        this.storeBindings = createStoreBindings(this, {
            store: timStore,
            fields: ['sdkReady'],
            actions: ['pushMessage','resetMessage']
        });

        this.setData({
            targetUserId: options.targetUserId,
            service: options.service ? JSON.parse(options.service) : null
        })
    },
    onUnload() {
        this.storeBindings.destroyStoreBindings();
        this.resetMessage();
    },

    handleLogin: function () {
        wx.navigateTo({
            url: '/pages/login/login'
        })
    },
    handleSendMessage: function (event) {
        const {type, content} = event.detail;
        const message = Tim.getInstance().createMessage(type, content, this.data.targetUserId);
        this.pushMessage(message);
        Tim.getInstance().sendMessage(message);
        this.getOpenerEventChannel().emit('sendMessage');
    }

});