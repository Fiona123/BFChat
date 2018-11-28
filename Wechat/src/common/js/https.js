import axios from 'axios'
const prefix = process.env.NODE_ENV === 'production' ? '' : '/api'

export default {
    sendChatRequest (userId, robotId, text, arg) {
        axios({
            method: 'post',
            baseURL: prefix + '/openapi/chat',
            headers: { 'content-type': 'text/html; charset=UTF-8' },
            data: {
                appId: robotId,
                inputText: text,
                properties: [{ name: 'answerTag', value: '微信小程序' }],
                responseFlag: 'all',
                userId: userId || 'wx-from-web-123'
            }
        })
            .then(res => {
                let returnData = {}
                if (res.data.error_code === 0) {
                    returnData = res.data.data.result
                } else {
                    returnData.answer = res.data.error_message
                    returnData.error_code = res.data.error_code
                }
                typeof arg.success === 'function' && arg.success(returnData)
            })
            .catch(res => {
                typeof arg.fail === 'function' && arg.fail()
            })
    },
    getSignPackage (arg) {
        axios({
            method: 'post',
            baseURL: prefix + '/openapi/get_sign_package',
            headers: { 'content-type': 'text/html; charset=UTF-8' },
            data: {
                // 个人公众号开发账号 app id & app secret
                // wxAppId: 'wxbea6f3cc16346764',
                // wxAppSecret: '5b870b9842638917233399a9dba125ed'
                // 小竹宝机器人 公众号开发账号
                wxAppId: 'wx531d76fec0eda7d1',
                wxAppSecret: '3caf37b3f7dcb92600e938afeecc818a'
            }
        })
            .then(res => {
                typeof arg.success === 'function' && arg.success(res.data.data)
            })
            .catch(res => {
                typeof arg.fail === 'function' && arg.fail()
            })
    },
    getRobotInfo (robotId, arg) {
        axios({
            method: 'get',
            baseURL: prefix + '/robots/info',
            params: {
                appId: robotId
            }
        })
            .then(res => {
                typeof arg.success === 'function' && arg.success(res.data.data)
            })
            .catch(res => {
                typeof arg.fail === 'function' && arg.fail()
            })
    }
    // getUserOpenId (accId, accSecret, jsCode, arg) {
    //     axios({
    //         method: 'post',
    //         baseURL: prefix + '/openapi/get_user_open_id',
    //         headers: { 'content-type': 'text/html; charset=UTF-8' },
    //         data: {
    //             // 小竹宝机器人 公众号开发账号
    //             wxAppId: accId,
    //             wxAppSecret: accSecret,
    //             wxJsCode: jsCode
    //         }
    //     })
    //         .then(res => {
    //             console.log('getUserOpenID returned: ' + res.data)
    //             typeof arg.success === 'function' && arg.success(res.data)
    //         })
    //         .catch(res => {
    //             typeof arg.fail === 'function' && arg.fail()
    //         })
    // },
}
