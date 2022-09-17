import Order from "../../model/order";
import {getEventParam} from "../../utils/utils";
import roleType from "../../enum/role-type";

const order = new Order();


Page({
    data: {
        tabs: ['全部订单', '待处理', '待支付', '待确认', '待评价'],
        active: 0,
        role: null,
        status: null,
        roleType: roleType
    },
    onLoad: function (options) {
        const role = parseInt(options.role);
        const status = parseInt(options.status);
        this.setData({
            role,
            active: status + 1
        });
        this.data.status = status < 0? '' : status;
        this.data.role = role
    },
    onShow() {
        this._getOrderList();
    },
    _getOrderList: async function () {
        const orderList = await order.reset().getMyOrderList(this.data.role, this.data.status);
        this.setData({
            orderList
        })
    },
    onPullDownRefresh: async function() {
        await this._getOrderList();
        await wx.stopPullDownRefresh();
    },
    onReachBottom: async function() {
        if (!order.hasMoreData) return;
        const orderList = await order.getMyOrderList(this.data.role, this.data.status);
        this.setData({
            orderList
        })
    },
    handleTabChange: async function(event) {
            const index = getEventParam(event, 'index');
            this.data.status = index < 1 ? '' : index -1;
            await this._getOrderList();
    },
    handleNavDetail: function (event) {
        const order = getEventParam(event, 'order');
        wx.navigateTo({
            url: `/pages/order-detail/order-detail?role=${this.data.role}&order=${JSON.stringify(order)}`,
        })
    },
    handleChat: function (event) {
        const order = getEventParam(event,'order');
        const targetUserId = order[this.data.role === roleType.PUBLISHER? 'consumer': 'publisher'].id;
        wx.navigateTo({
            url: `/pages/conversation/conversation?targetUserId=${targetUserId}&service=${JSON.stringify(order.service_snap)}`,
        })
    },
    handleRefund: function (event) {
        const order = getEventParam(event,'order');
        wx.navigateTo({
            url: `/pages/refund/refund?order=${JSON.stringify(order)}`
        })
    }
})