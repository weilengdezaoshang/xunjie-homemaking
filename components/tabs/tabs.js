import {throttle} from "../../utils/utils";

Component({
    properties: {
        tabs: {
            type: Array,
            value: []
        },
        active: {
            type: Number,
            value: 0
        }
    },
    observers: {
        'active': function (active) {
            this.setData({
                currentTabIndex: active
            })
        }
    },
    options:{
        multipleSlots: true
    },
    data: {
        currentIndex: 0
    },
    methods: {
        handleTabChange: throttle(function (event) {
            const index = event.currentTarget.dataset.index;
            this.setData({
                currentIndex: index
            })
            this.triggerEvent('change', { index })
        })

    }
});
