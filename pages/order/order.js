import Order from "../../model/order";

Page({
    data: {
        service: null,
        address: null
    },
    onLoad: function (options) {
        let service = JSON.parse(options.service);
        this.setData({
            service
        })
    },
    handleSelectAddress: async function (event) {
        let address = await wx.chooseAddress();
        this.setData({
            address
        })
    },
    handleOrder: async function () {
        if (this.data.service.designated_place && !this.data.address) {
            wx.showModal({
                title: '错误',
                content: '该服务必须指定服务地点',
                showCancel:false
            });
            return;
        }
        let res = await wx.showModal({
            title: '注意',
            content: '是否确认预约该服务'
        });
        if (!res.confirm) {
            return;
        }
        wx.showLoading({title: '正在预约', mask: true});
        try {
            await Order.createOrder(this.data.service.id, this.data.address);
            wx.navigateTo({
                url: '/pages/order-success/order-success'
            })
        } catch (e) {
            wx.showModal({
                title:'错误',
                content: '预约失败，请稍后重试',
                showCancel: false
            })
        }
        wx.hideLoading();
    }
});