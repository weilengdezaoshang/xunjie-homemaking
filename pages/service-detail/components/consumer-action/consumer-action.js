import serviceType from "../../../../enum/service-type";
import behavior from "../behavior";

Component({
    behaviors: [behavior],
    properties: {
    },
    data: {
        serviceTypeEnum: serviceType
    },
    methods: {
        handleChat:function (event) {
            this.triggerEvent('chat')
        },
        handleOrder: function (event) {
            this.triggerEvent('order')
        }
    }
});
