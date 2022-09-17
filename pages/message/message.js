import {createStoreBindings} from "mobx-miniprogram-bindings";
import {timStore} from "../../store/tim";
import {getDateSet} from "../../utils/utils";
import {setTabBarBadge} from "../../utils/wx";
import cache from "../../enum/cache";

Page({
    data: {
        conversationList: [],
        updateConversationList: false
    },
    onLoad: function (options) {
        this.storeBindings = createStoreBindings(this, {
            store: timStore,
            fields: ['sdkReady', 'conversationList'],
            actions: ['getConversationList']
        });
    },
    onUnload: function () {
        this.storeBindingsBehavior.destroyStoreBindings();
    },
    handleToLogin: function () {
        wx.navigateTo({
            url: '/pages/login/login'
        })
    },
    handleSelect: function (event) {
        this.data.updateConversationList = false;
        const item = getDateSet(event, 'item');
        wx.navigateTo({
            url: `/pages/conversation/conversation?targetUserId=${item.userProfile.userID}&service=`,
            events: {
                sendMessage: () => {
                    this.data.updateConversationList = false
                }
            }
        })
    },
    onShow: function() {
        if (this.data.updateConversationList) {
            this.getConversationList();
            this.data.updateConversationList = false;
        }
        const unreadCount = wx.getStorageSync(cache.UNREAD_COUNT);
        setTabBarBadge(unreadCount);
    }
});