import Service from "../../model/service";
import Category from "../../model/category";
import {throttle} from "../../utils/utils";
import Tim from "../../model/tim";
import {setTabBarBadge} from "../../utils/wx";
import cache from "../../enum/cache";
const service = new Service();
Page({
    data: {
        tabs: ["全部服务", "在提供", "正在找"],
        categoryList: [],
        serviceList: [],
        tableIndex: 0,
        categoryId: 0,
        loading: true
    },
    onLoad: async function (options) {
        Tim.getInstance();
        await this._getList();
        await this._getCategoryList();
        this.setData({
            loading:false
        });
    },
     async _getList () {
       const serviceList = await service.reset().getServiceList(this.data.categoryId, this.data.tableIndex);
       this.setData({
           serviceList:serviceList
       })
    },
    async _getCategoryList() {
        let categoryList = await Category.getCategoryListWithAll();
        this.setData({
            categoryList
        })
    },

    handleSwiperChange: function (event) {
        this.data.categoryId = event.currentTarget.dataset.id;
        this._getList();
    },
    handleTabChange: throttle(function (event) {
        if (this.data.tableIndex === event.detail.index) return;
        this.data.tableIndex = event.detail.index;
        this._getList();
    }),
    // 下拉刷新
    async onPullDownRefresh() {
        this._getList();
        wx.stopPullDownRefresh();
    },

    //上拉触底加载更多
    async onReachBottom() {
        const serviceList = await service.getServiceList();
        this.setData({
            serviceList:serviceList
        })
    },

    handleSelectService:function (event) {
        const service = event.currentTarget.dataset.service;
        wx.navigateTo({
            url: '/pages/service-detail/service-detail?service_id='+service.id,
        });

    },
    onShow:function () {
        const unreadCount = wx.getStorageSync(cache.UNREAD_COUNT);
        setTabBarBadge(unreadCount)
    }
});