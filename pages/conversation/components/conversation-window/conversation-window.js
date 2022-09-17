import {storeBindingsBehavior} from "mobx-miniprogram-bindings";
import {timStore} from "../../../../store/tim";
import {getEventParam} from "../../../../utils/utils";
import TIM from "tim-wx-sdk-ws"
import Tim from "../../../../model/tim";

Component({
    behaviors: [storeBindingsBehavior],
    properties: {
        targetUserId: String,
        service: Object
    },
    data: {
        text: '',
        scrollHeight: 0
    },
    storeBindingsBehavior: {
        store: timStore,
        fields: ['messageList', 'intoView', 'isCompleted'],
        actions: ['getMessageList', 'setTargetUserId', 'scrollMessageList','pushMessage']
    },
    methods: {
        handleSendLink:function (event) {
            const service = getEventParam(event, 'service');
            this.triggerEvent('sendmessage', {
                type: TIM.TYPES.MSG_CUSTOM,
                service
            })
        },
        async _setNavigationBarTitle () {
            const  res = await Tim.getInstance().getUserProfile(this.data.targetUserId);
            await wx.setNavigationBarTitle({
                title: res[0].nick || '慕慕到家'
            })
        },
        handleSelect: function (event) {
            const service = getEventParam(event, 'service');
            wx.navigateTo({
                url: `/pages/service-detail/service-detail?service_id=${service.id}`
            })
        },
        handleSendImage: async function (event) {
            const chooseImage = await wx.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                sourceType: ['alum', 'camera']
            });

            this.triggerEvent('sendmessage', {
                type: TIM.TYPES.MSG_IMAGE,
                content: chooseImage
            })
        },
        handleInput: function (event) {
            this.data.text = getEventParam(event, 'value')
        },
        handleSend: function (event) {
            const text = this.data.text.trim();
            if (text === '') return;
            this.triggerEvent('sendmessage', {
                type: TIM.TYPES.MSG_TEXT,
                content: text
            });
            this.setData({
                text: ''
            })
        },
        async _setScrollHeight () {
            const systemInfo = await wx.getSystemInfo();
            const scrollHeight = systemInfo.windowHeight - (systemInfo.screenHeight - systemInfo.safeArea.bottom) - 95;
            this.setData({
                scrollHeight
            })
        },
        handleScrolltoupper: function () {
            if (this.isCompleted) return;
            wx.showLoading({
                title:'正在加载..',
                mask: true
            });
            this.scrollMessageList();
            setTimeout(() => wx.hideLoading(), 1000)
        },
    },
    lifetimes: {
        async attached() {
            this._setNavigationBarTitle();
            this.setTargetUserId(this.data.targetUserId);
            this._setScrollHeight();
            await this.getMessageList();
            if (this.data.service) {
                const message = Tim.getInstance().createMessage(TIM.TYPES.MSG_CUSTOM, this.data.service, this.data.targetUserId, 'link');
                this.pushMessage(message);
            }
        }

    }
});
