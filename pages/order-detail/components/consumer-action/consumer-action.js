import behavior from "../behavior";

Component({
    behaviors: [behavior],
    properties: {},
    data: {},
    methods: {
        handleRefund () {
            this.triggerEvent('pay');
        },
        handlePay () {
            this.triggerEvent('refund');
        },
        handleRating () {
            this.triggerEvent('rating');
        }
    }
});
