import orderStatus from "../../../enum/order-status";
import orderAction from "../../../enum/order-action";
import {getDateSet} from "../../../utils/utils";

const behavior = Behavior({
    properties: {
        order: Object
    },
    data: {
        orderStatus: orderStatus,
        orderAction: orderAction
    },
    methods: {
        handleUpdateOrderStatus: function (event) {
            const action = getDateSet(event, 'action');
            this.triggerEvent('update-status', { action })
        }
    }
})


export default  behavior;