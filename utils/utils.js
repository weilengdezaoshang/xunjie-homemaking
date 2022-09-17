/**
 * 节流函数
 * @param {Function} callback 需要被节流的函数
 * @param {Number} duration 距离上次执行超过多少毫秒才会执行被节流的函数
 * @returns
 */
function throttle(callback, duration = 500) {
    let lastTime = 0;
    return function () {
        const now = new Date().getTime();
        if (now - lastTime >= duration) {
            callback.call(this, ...arguments);
            lastTime = now;
        }
    }
}

/**
 * 获取事件回调参数的自定义属性
 * @param {Object} event
 * @param {String} target
 */

function  getDateSet(event, target) {
    return event.currentTarget.dataset[target]
}

/**
 * 获取自定事件的参数
 * @param {Object} event
 * @param {String} target
 * @returns {*}
 */
function getEventParam(event, target) {
    return event.detail[target]
}
/**
 * 防抖函数
 * @param {Function} callback 需要防抖的函数
 * @param {Number} interval 延迟多少毫秒执行
 * @returns
 */
function debounce(callback, interval = 500) {
    let timer
    return function () {
        clearTimeout(timer);
        timer = setTimeout( ()=> {
            callback.call(this, ...arguments);
        }, interval);
    };
}
export  { throttle, getDateSet, getEventParam, debounce}