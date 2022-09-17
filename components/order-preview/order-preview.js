import roleType from "../../enum/role-type";

Component({
    properties: {
        order: Object,
        role: Object,
        hideTop: {
            type: Boolean,
            value: false
        }
    },
    data: {
        roleType: roleType
    },
    methods: {}
});
