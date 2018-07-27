import axios from 'axios'

export default {
    sendChatRequest (text, arg) {
        axios({
            method: 'post',
            // baseURL: '/api/openapi/chat',
            baseURL: 'http://shadow.emotibot.com/openapi/chat',
            headers: { 'content-type': 'text/html; charset=UTF-8' },
            data: {
                appId: '24fff63d783f698e8d3f7bf659453b2f',
                inputText: text,
                properties: [{ name: 'answerTag', value: 'Web' }],
                responseFlag: 'all',
                userId: '096C6622BE0881B6C4013E064E7266124'
            }
        })
            .then(res => {
                typeof arg.success === 'function' && arg.success(res.data.data.result.answer)
            })
            .catch(res => {
                typeof arg.fail === 'function' && arg.fail()
            })
    }
}
