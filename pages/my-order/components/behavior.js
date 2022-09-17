import orderStatus from "../../../enum/order-status";

const behavior = Behavior({
    properties: {
        order: Object
    },
    data: {
        orderStatus: orderStatus
    },
    methods: {
        handleNavToOrderDetail(event) {
            this.triggerEvent('nav-detail', { order: this.data.order});
        },

        handleNavToRefund(event) {
            this.triggerEvent('refund', { order: this.data.order});
        },
        handleToChat(event) {
            this.triggerEvent('chat', { order: this.data.order});
        }
    }
});
export default behavior;