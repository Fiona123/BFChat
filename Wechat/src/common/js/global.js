import wx from 'weixin-js-sdk'
import https from './https'
import Sig from './_wx_signature'

export default {
    install (Vue, options) {
        // 从小程序端带入的url格式
        // 参数 accId=小程序账号&accPwd=小程序密码&nickName=微信用户昵称&jsCode=微信用户登录code&appid=机器人ID
        const url = decodeURIComponent(window.location.href)
        let userInfo = {}
        // if (url.indexOf('accId=')) {
        //     let startIndx = url.indexOf('accId=') + 6
        //     let endIndx = url.indexOf('&', startIndx)
        //     if (endIndx !== -1) {
        //         userInfo.accId = url.substring(startIndx, endIndx)
        //     }
        // }
        // if (url.indexOf('accPwd=')) {
        //     let startIndx = url.indexOf('accPwd=') + 7
        //     let endIndx = url.indexOf('&', startIndx)
        //     if (endIndx !== -1) {
        //         userInfo.accPwd = url.substring(startIndx, endIndx)
        //     }
        // }
        // if (url.indexOf('jsCode=')) {
        //     let startIndx = url.indexOf('jsCode=') + 7
        //     let endIndx = url.indexOf('&', startIndx)
        //     if (endIndx !== -1) {
        //         userInfo.jsCode = url.substring(startIndx, endIndx)
        //     }
        // }
        // https.getUserOpenId(userInfo.accId, userInfo.accPwd, userInfo.jsCode, {
        //     success () {
        //         res => console.log(res)
        //     },
        //     fail () {
        //         console.log('failed')
        //     }
        // })
        if (url.indexOf('nickName=')) {
            let startIndx = url.indexOf('nickName=') + 9
            let endIndx = url.indexOf('&', startIndx)
            if (endIndx !== -1) {
                userInfo.nickName = url.substring(startIndx, endIndx)
            }
        }
        if (url.indexOf('openId=')) {
            let startIndx = url.indexOf('openId=') + 7
            let endIndx = url.indexOf('&', startIndx)
            if (endIndx !== -1) {
                userInfo.openId = url.substring(startIndx, endIndx)
            }
        }
        console.log(userInfo)
        let robotId = ''
        if (url.indexOf('appid=') !== -1) {
            robotId = url.substr(url.indexOf('appid=') + 6, url.length)
        } else {
            robotId = '4ba484744be5f3a2352669451ef06f5b' // 'b53c8a88336b3651497742c0744b910d' 机器人F_F
        }
        console.log('Robot App Id = ' + robotId)
        Vue.prototype.global = {
            robotId: robotId,
            wechatUserInfo: userInfo
        }
        // 初始化微信API
        Vue.prototype.WX = {
            isMiniProg (fnFunc) {
                try {
                    wx.miniProgram.getEnv(res => {
                        let isMiniP = res.miniprogram
                        fnFunc(isMiniP)
                    })
                    return true
                } catch (err) {
                    return undefined
                }
            },
            navigateTo (path) {
                if (!this.isMiniProg()) {
                    return undefined
                }
                return wx.miniProgram.navigateTo(path)
            },
            JsApiConfig (fnSuccess, fnFail) {
                https.getSignPackage({
                    success (data) {
                        var str = `jsapi_ticket=${data.jsapiTicket}&noncestr=${data.nonceStr}&timestamp=${data.timestamp}&url=${location.href.split('#')[0]}`
                        const sig = Sig.SHA2(str)
                        console.log('signature = ' + sig)
                        wx.config({
                            debug: false,
                            appId: data.appId,
                            timestamp: data.timestamp,
                            nonceStr: data.nonceStr,
                            signature: sig,
                            jsApiList: ['startRecord', 'stopRecord', 'translateVoice', 'onVoiceRecordEnd', 'playVoice', 'stopVoice', 'uploadVoice', 'downloadVoice']
                        })
                        wx.ready(function () {
                            fnSuccess(true)
                        })
                    },
                    fail () {
                        fnFail(false)
                    }
                })
            },
            checkJsApi (fnSuccess) {
                wx.checkJsApi({
                    jsApiList: ['checkJsApi', 'startRecord', 'stopRecord', 'onVoiceRecordEnd'],
                    success (res) {
                        fnSuccess(res)
                    }
                })
            },
            startRecord () {
                return wx.startRecord()
            },
            stopRecord (fnSuccess) {
                // if (!this.isMiniProg()) {
                //     return undefined
                // }
                wx.stopRecord({
                    success: function (res) {
                        // 语音转文字
                        wx.translateVoice({
                            localId: res.localId,
                            isShowProgressTips: 1,
                            success: function (result) {
                                console.log(result)
                                fnSuccess(result.translateResult)
                            }
                        })
                    }
                })
            },
            onVoiceRecordEnd (args) {
                return wx.onVoiceRecordEnd(args)
            }
        }
        Vue.prototype.setCookie = function (cname, cvalue, exdays) {
            // cname  cookie名
            // cvalue =  cookie值
            // exdays = cookie 过期时间(天)
            var d = new Date()
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
            var expires = 'expires=' + d.toUTCString()
            document.cookie = cname + '=' + cvalue + '; ' + expires
        }
    }
}
