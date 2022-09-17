import serviceStatus from "../../../../enum/service-status";
import serviceAction from "../../../../enum/service-action";
import behavior from "../behavior";
import {getDateSet} from "../../../../utils/utils";

Component({
    behaviors: [behavior],
    properties: {
    },
    data: {
        serviceStatusEnum: serviceStatus,
        serviceActionEnum: serviceAction
    },
    methods: {
        handleUpdateStatus (event) {
            let action = getDateSet(event, "action");
            this.triggerEvent('update', {action});
        },
        handleEditService (event) {
            this.triggerEvent('edit');
        }
    }
});
