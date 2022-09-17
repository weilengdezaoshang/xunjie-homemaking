import Service from "../../model/service";
import {getDateSet, getEventParam} from "../../utils/utils";

const service = new Service();
Page({
    data: {
        serviceList: [],
        active: 0,
        tabs: ['全部服务', '待审核', '待发布', '已发布'],
    },
    onLoad: function (options) {
        const status = parseInt(options.status);
        const type = parseInt(options.type);
        this.setData({
            active: status + 1
        });
        this.data.status = status < 0? '' : status
        this.data.type = type;
        this._getServiceList()
    },
    async _getServiceList () {
        const serviceList = await service.reset().getMyService(this.data.type,this.data.status);
        this.setData({
            serviceList
        });
    },
    async onPullDownRefresh() {
        await this._getServiceList();
        wx.stopPullDownRefresh();
    },
    async onReachBottom() {
        if (!service.hasMoreData) return;
        const serviceList = await service.getMyService(this.data.type, this.data.status);
        this.setData({
            serviceList
        })
    },
    handleTabChange: function (event) {
        const index = getEventParam(event, 'index');
        this.data.status = index < 1 ? '' : index - 1;
        this._getServiceList();
    },

    handleSelect (event) {
        const service = getDateSet(event, 'service');
        wx.navigateTo({
            url: `/pages/service-detail/service-detail?service_id=${service.id}`
        })
    }
});