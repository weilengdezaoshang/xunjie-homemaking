import {formatTime} from "../../../../utils/date";
import TIM from 'tim-wx-sdk-ws'
import {getDateSet, getEventParam} from "../../../../utils/utils";
Component({
    properties: {
        message: Object
    },
    observers: {
        'message': function (message) {
            message.time = formatTime(message.time)
            this.setData({
                _message: messageS
            })
        }
    },
    data: {
        TIM: TIM,
        fromEnum: {
            IN: 'in',
            OUT: 'out'
        }
    },
    methods: {
        handleSend (event) {
            const service = getEventParam(event, 'service');
            this.triggerEvent('send', { service })
        },
        handleSelect (event) {
            const service = getEventParam(event, 'service');
            this.triggerEvent('select', {service})
        },
        async handlePreview (event) {
            const url = getDateSet(event, 'image');
            await wx.previewImage({
                urls: [url],
                current: url
            })
        }
    }
});
