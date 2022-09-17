import http from "../utils/http";
import Base from "./base";
class Service extends Base{
    /**
     * 分页服务列表
     * @param category_id 分类id
     * @param type 服务类型
     * **/

    async getServiceList (category_id = null, type = null) {
        if (!this.hasMoreData) {
            return this.data;
        }
        const serviceList = await http.request({
            url:'v1/service/list',
            data: {
                page:this.page,
                count: this.count,
                category_id: category_id || "",
                type: type || ""
            }
        });
        this.data = this.data.concat(serviceList.data);
        this.hasMoreData = !(this.page === serviceList.last_page);
        this.page ++;
        return this.data
    }
    // 根据id获取服务详情
    static getServiceById (serviceId) {
        return http.request({
            url: `v1/service/${serviceId}`
        })
    }

    static updateServiceStatus (serviceId, action) {
        return http.request({
            url: `v1/service/${serviceId}`,
            data: {
                action
            },
            method: 'POST'
        })
    }
    static publishService (formData) {
        return http.request({
            url: 'v1/service',
            data: formData,
            method: 'POST'
        })
    }
    static editService (serviceId, formData) {
        return http.request({
            url: `v1/service/${serviceId}`,
            data: formData,
            method: 'PUT'
        })
    }
    static getServiceStatus(type) {
        return http.request({
            url: `v1/service/count?type=${type}`
        })
    }

    async getMyService (type, status) {
        if (!this.hasMoreData) return;


        const serviceList =  await http.request({
            url: 'v1/service/my',
            data: {
                page: this.page,
                count: this.count,
                type,
                status
            }
        })
        this.data = this.data.concat(serviceList.data)
        this.hasMoreData = this.page !== serviceList.last_page
        this.page ++
        return this.data
    }
}

export default  Service;