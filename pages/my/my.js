import {setTabBarBadge} from "../../utils/wx";
import Token from "../../model/token";
import User from "../../model/user";
import cache from "../../enum/cache";
import {appointWithMeGrid, myAppointGrid, mySeekGrid} from "../../config/grid";
import Service from "../../model/service";
import Order from "../../model/order";
import roleType from "../../enum/role-type";
import serviceType from "../../enum/service-type";
import {getEventParam} from "../../utils/utils";

Page({
    data: {
        userInfo: {
            nickname: '点击授权登录',
            avatar: '../../images/logo.png'
        },
        // 宫格配置
        // 预约我的宫格
        appointWithMeGrid: appointWithMeGrid,
        // 我的预约宫格
        myAppointGrid: myAppointGrid,
        // 我在提供宫格
        myProvideGird: myAppointGrid,
        // 正在找宫格
        mySeekGrid: mySeekGrid,
        appointWithMeStatus: null,
        myAppointStatus: null,
        provideServiceStatus: null,
        seekServiceStatus: null,


    },
    onLoad: function (options) {

    },
    onShow: async function() {
        const unreadCount = wx.getStorageSync(cache.UNREAD_COUNT);
        await setTabBarBadge(unreadCount);

        const verifyToken = await Token.verifyToken();
        if (verifyToken.valid) {
            const userInfo = User.getUserInfoByLocal(cache.USER_INFO);
            this.setData({
                userInfo
            });
            this._getOrderStatus();
            this._getServiceStatus();
        }
    },
    handleToLogin: function () {
        wx.navigateTo({
            url: '/pages/login/login'
        })
    },
    async _getOrderStatus () {
        const appointWithMeStatus = Order.getOrderStatus(roleType.PUBLISHER);
        const myAppointStatus = Order.getOrderStatus(roleType.CONSUMER);
        this.setData({
            appointWithMeStatus: await appointWithMeStatus,
            myAppointStatus: await myAppointStatus
        })
    },

    async _getServiceStatus () {
        const provideServiceStatus = Service.getServiceStatus(serviceType.PROVIDE);
        const seekServiceStatus = Service.getServiceStatus(serviceType.SEEK);
        this.setData({
            provideServiceStatus: await provideServiceStatus,
            seekServiceStatus: await seekServiceStatus
        })
    },
    handleNavToOrder (event) {
        const cell = getEventParam(event, 'cell');
        if (!('status' in cell )) {
            wx.navigateTo({
                url: `/pages/refund-list/refund-list?role=${cell.role}`
            });
            return;
        }
        wx.navigateTo({
            url: `/pages/my-order/my-order?role=${cell.role}&status=${cell.status}`
        })
    },
    handleNavToMyService (event) {
        const { type, status } = getEventParam(event, 'cell');
        wx.navigateTo({
            url: `/pages/my-service/my-service?type=${type}&status=${status}`
        })
    }
});