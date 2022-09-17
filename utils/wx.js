import cache from "../enum/cache";

function wxToPromise (method, opations = {}) {
    return new Promise((resolve, reject) => {
        opations.success = resolve;
        opations.fail = err => reject(err);
        wx[method](opations);
    })

}

const setTabBarBadge = async function (unreadCount) {
    try {
        if (unreadCount > 0) {
            await wx.setTabBarBadge({
                index: 2,
                text: unreadCount.toString()
            })
        } else {
            await wx.removeTabBarBadge({
                index: 2
            })
        }
        wx.setStorageSync(cache.UNREAD_COUNT, 0)
    }catch (e) {
        wx.setStorageSync(cache.UNREAD_COUNT, unreadCount);
        console.log(e)
    }
};

export { wxToPromise, setTabBarBadge}
