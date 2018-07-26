import wx from 'weixin-js-sdk'

export default {
    install (Vue, options) {
        Vue.prototype.WX = {
            isMiniProg () {
                let isMiniP = false
                wx.miniProgram.getEnv(res => {
                    isMiniP = res.miniprogram
                })
                return isMiniP
            },
            navigateTo (path) {
                if (!this.isMiniProg()) {
                    return undefined
                }
                return wx.miniProgram.navigateTo(path)
            }
        }
    }
}
