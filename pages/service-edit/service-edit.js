import Service from "../../model/service";
import {getDateSet} from "../../utils/utils";

Page({
    data: {
        formData: {},
        serviceId: null
    },
    onLoad: function (options) {
        const service = JSON.parse(options.service);
        this._init(service);
    },

    _init(service) {
        const formData = {
            type: service.type,
            title: service.title,
            category_id: service.category_id,
            description: service.description,
            designated_place: service.designated_place,
            begin_date: service.begin_date,
            end_date: service.end_date,
            price: service.price,
            cover_image: service.cover_image
        };
        this.setData({
            formData,
            serviceId: service.id
        })
    },
    handleSubmit: async function (event) {
        const res = await wx.showModal({
            title: '提示',
            content: '是否确认修改该服务？提交后会重新进入审核状态',
            showCancel: true
        });
        if (!res.confirm) return;
        wx.showLoading({
            title: '正在发布中...',
            mask: true
        });
        let formData = getDateSet(event, 'formData')
        try {
            await Service.editService(this.data.serviceId, formData);
            wx.redirectTo({
                url: `/pages/publisher-success/publisher-success?type=${formData.type}`
            })
        } catch (e) {
            console.log(e)
        }
        wx.hideLoading();

    },
});