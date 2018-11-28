<template>
    <div>
       <transition name="tips">
            <div class="tips" v-show="showTips">{{tipMessage}}</div>
       </transition>
       <transition name="welcome">
           <div class="welcome-wrapper" v-show="showWelcome" @click="showWelcome = false" key="welcome">
                <img src="./assets/image/welcome.png">
            </div>
       </transition>
        <transition name="fade" mode="out-in">
            <external-page v-if="showExternalPage" :link="externalPageLink" @back="hideExternalPage"></external-page>
            <div id="app" v-else key="app" :class="{'hide': showWelcome, 'display': !showWelcome}">
                <div class="logo-wrapper">
                    <img src="./assets/image/robot.png">
                    <span>{{robotName}}</span>
                </div>
                <div class="content-wrapper" @click="onClickContent">
                    <Scroll class="scroll-container" :data="chatLogItems" ref="scroll" @scroll="onScroll">
                        <div class="chat-log" v-for="(item, index) in chatLogItems" :key="index"
                        :style="{'margin-top': item.marginT, 'padding': item.type==='cards'?'0px':'0px 20px'}">
                            <bubble v-if="item.type === 'bubble' && item.externalLink == undefined" :props="item" :showLike="enableLikeFunc" @clickLink="sendQuestion" @update="scrollToEnd" ref="bubbles"></bubble>
                            <cards v-else-if="item.type === 'cards'"></cards>
                            <single-pic v-else-if="item.type === 'singlepic'" :imageUrl="item.imageUrl" @load="onImageLoaded"></single-pic>
                            <external-link :link="item.externalLink" v-else-if="item.type === 'bubble' && item.externalLink" @copied="onLinkCopied" @navigate="navigateToExternal(item.externalLink)">
                                <bubble :props="item" :showLike="enableLikeFunc" @update="scrollToEnd" ref="bubbles"></bubble>
                            </external-link>
                        </div>
                        <div class="end-div"></div>
                        <p class="end-div2" v-show="scrollButtonsExist"></p>
                        <p class="end-div3" v-show="isVoiceType"></p>
                    </Scroll>
                    <transition name="slide-fade">
                        <div class="scroll-buttons" v-show="scrollButtonsExist && showScrollButtons">
                            <scroll-buttons :items="skillList" @select="onSelectQuestions"></scroll-buttons>
                        </div>
                    </transition>
                    <div class="toBottomBtn" v-show="showToBottomBtn" @click="scrollToEnd">
                        <span>滑到底部</span>
                        <i></i>
                    </div>
                </div>
                <div class="input-wrapper" v-show='!isVoiceType'>
                    <div class="input-box-wrapper">
                        <div class="voice" @click="switchInputType"></div>
                        <el-input ref="questionInput" class="input-box" placeholder="请输入聊天信息" v-model="inputQuestion" @focus="onInputFocus" type="text" maxlength="50">
                            <div slot="suffix" class="send-icon-wrapper" @click="sendInputQuestion" @blur="onInputBlur">
                                <i  :class="{'icon-send': true,'icon-send-blue': inputQuestion!=='','icon-send-none':inputQuestion===''}"></i>
                            </div>
                        </el-input>
                    </div>
                    <div class="iphonex-bottom" v-show="isIphoneX"></div>
                </div>
                <WXRecording v-show="isVoiceType" @send="sendQuestion" @close="switchInputType"></WXRecording>
            </div>
        </transition>
    </div>
</template>

<script>
import Bubble from '@/components/Bubble/Bubble'
import Scroll from '@/components/Scroll/Scroll'
import Cards from '@/components/Cards/Cards'
import ScrollButtons from '@/components/ScrollButtons/ScrollButtons'
import Emoji from '@/components/Emoji/Emoji'
import SinglePic from '@/components/SinglePic/SinglePic'
import WXRecording from '@/components/WXRecording/WXRecording'
import ExternalLink from '@/components/ExternalLink/ExternalLink'
import ExternalPage from '@/components/ExternalPage/ExternalPage'
// eslint-disable-next-line
import https from '@/common/js/https'
import util from '@/common/js/util'
import {ChatLogList} from '@/common/js/ChatLog'

export default {
    name: 'App',
    data () {
        return {
            // 页面功能开关
            showWelcome: true,
            showToBottomBtn: false,
            showScrollButtons: true,
            scrollButtonsExist: false,
            enableLikeFunc: false,
            isVoiceType: false,
            clipboardText: '被复制的链接',
            showTips: false,
            tipMessage: '复制成功！请到浏览器粘贴查看',
            showExternalPage: false,
            externalPageLink: 'https://bf.emotibot.com/BF/Wechat/dist/index.html#/',
            // 对话日志Container
            chatLogsContainer: null,
            skillList: [],
            inputQuestion: '',
            robotName: '未关联机器人',
            isIphoneX: false
        }
    },
    created () {
        const that = this
        let logs = ChatLogList.getHistoryLogs(this.global.robotId)
        this.chatLogsContainer = new ChatLogList(this.global.robotId, logs)
        // welcome动画
        setTimeout(function () {
            that.showWelcome = false
        }, 1000)
        // 打招呼信息
        https.getRobotInfo(this.global.robotId, {
            success (res) {
                that.robotName = res.robotname
                that.chatLogsContainer.addLeftBubble(res.msg.replace('XX', res.robotname))
            },
            fail () {
                that.chatLogsContainer.addLeftBubble('您好，我是您的机器人，有什么可以帮您的吗？#icon--angel#')
            }
        })
        // 判断设备是否为iPhoneX, 手机端Input被键盘遮挡时的兼容性处理
        this.isIphoneX = util.isIphoneX()
    },
    computed: {
        chatLogItems () {
            let chatLogs = this.chatLogsContainer.getLogs()
            let chatItems = []
            for (var i = 0; i < chatLogs.length; i++) {
                let chat = chatLogs[i]
                if (chatLogs.type === 'cards') {
                    chat.marginT = '15px'
                } else if (i === 0) {
                    chat.marginT = '0px'
                } else {
                    chat.marginT = chatLogs[i - 1].direction === chatLogs[i].direction ? '5px' : '15px'
                }
                chatItems.push(chat)
            }
            return chatItems
        }
    },
    mounted () {
        const that = this
        setTimeout(function () {
            that.scrollToEnd(0)
        }, 800)
    },
    methods: {
        updateHistoryLog () {
            console.log('update histroy logs ')
            this.chatLogsContainer.updateHistoryLogs()
        },
        onLinkCopied () {
            const that = this
            this.showTips = true
            setTimeout(function () {
                that.showTips = false
            }, 1000)
        },
        navigateToExternal (externalLink) {
            console.log('navigate to external')
            this.externalPageLink = externalLink
            this.showExternalPage = true
        },
        hideExternalPage () {
            this.externalPageLink = ''
            this.showExternalPage = false
        },
        switchInputType () {
            this.isVoiceType = !this.isVoiceType
            const that = this
            window.setTimeout(function () {
                that.scrollToEnd()
            }, 200)
        },
        sendQuestion (question) {
            this._sendChat(question)
        },
        onSelectQuestions (question) {
            this._sendChat(question)
        },
        sendInputQuestion () {
            this._sendChat(this.inputQuestion)
            this.inputQuestion = ''
            this.onInputBlur()
        },
        onInputBlur () {
            // 兼容性，iphone某版本手机，键盘收起时，页面没有滑到原本位置
            setTimeout(function () {
                document.body.scrollTop = 0
            }, 300)
        },
        onInputFocus () {
            // 解决手机端置底input被键盘挡住的问题
            setTimeout(function () {
                document.body.scrollTop = document.body.scrollHeight
            }, 300)
        },
        onClickContent () {
            this.$refs.questionInput.blur()
        },
        _sendChat (str) {
            let question = util.trim(str)
            if (question === undefined || question === '') {
                return
            }
            // this.addBubble('right', question)
            this.chatLogsContainer.addRightBubble(question)
            const that = this
            if (question === '-d 卡片') {
                this.$nextTick(function () {
                    // this.addCards()
                    this.chatLogsContainer.addCardsLog()
                    this.scrollToEnd()
                })
                return
            } else if (question === '-d 技能') {
                this.scrollButtonsExist = !this.scrollButtonsExist
                this.skillList = ['讲个笑话', '给我看一条新闻', '今天天气怎么样', '来玩成语接龙', '给我最近的酒店地址', '1.25*1.35等于几？', '订机票', '美元兑人民币汇率是多少']
                this.scrollToEnd()
                return
            } else if (question === '-d 赞') {
                this.enableLikeFunc = !this.enableLikeFunc
                return
            } else if (question === 's') {
                this.chatLogsContainer.updateHistoryLogs()
                let logs = ChatLogList.getHistoryLogs()
                console.log('logs updated to ' + logs)
            }
            // 加一个loading bubble
            let bubbleId = this.chatLogsContainer.addLeftBubble()
            const userId = this.global.wechatUserInfo.openId
            https.sendChatRequest(userId, this.global.robotId, question, {
                success: function (data) {
                    that.handleAnswer(data, bubbleId, that)
                    that.updateHistoryLog()
                },
                fail: function () {
                    console.log('send chat failed')
                }
            })
            this.scrollToEnd()
        },
        handleAnswer (data, bubbleId, that) {
            // 解析CMD答案
            if (data.answer.indexOf('[CMD]:') !== -1) {
                let res = this.handleCMDAnswer(data.answer)
                data.answer = res.text ? res.text + ' ' + res.external_link : res
                if (res.external_link) {
                    data.externalLink = res.external_link
                }
            }
            // 判断答案是否为微信单图片
            let type = 'bubble'
            let wxcontent = []
            if (util.isJSON(data.answer)) {
                let result = JSON.parse(data.answer)
                if (result.wxcontent) {
                    type = 'wxcontent'
                    wxcontent = result.wxcontent
                }
            }
            if (type === 'bubble') {
                // 纯文本格式 -> 回答 + 相关问题
                if (bubbleId) {
                    this.chatLogsContainer.updateChatLog(bubbleId, {
                        content: data.answer,
                        links: data.relatedQuestions || data.recommendquestion,
                        externalLink: data.externalLink
                    })
                } else {
                    this.chatLogsContainer.addLeftBubble(data.answer, data.relatedQuestions || data.recommendquestion, data.externalLink)
                }
            } else if (type === 'wxcontent' && wxcontent && wxcontent.length > 0) {
                // 单图片 -> 单张图片或者纯文本
                if (bubbleId) {
                    let bubbleIndex = this.chatLogsContainer.getChatLogIndexById(bubbleId)
                    let count = -1
                    for (let i = 0; i < wxcontent.length; i++) {
                        if (wxcontent[i].text) {
                            if (count === -1) {
                                // 刷新bubble text
                                this.chatLogsContainer.updateChatLog(bubbleId, {
                                    content: wxcontent[i].text
                                })
                            } else {
                                // 新增text
                                this.chatLogsContainer.insertLeftBubble(wxcontent[i].text, undefined, undefined, bubbleIndex + count)
                            }
                        } else if (wxcontent[i].imageurl) {
                            if (count === -1) {
                                // 第一个图片，应该去掉loading bubble
                                this.chatLogsContainer.updateChatLog(bubbleId, {
                                    imageUrl: wxcontent[i].imageurl
                                })
                            } else {
                                this.chatLogsContainer.insertSinglePicLog(wxcontent[i].imageurl, bubbleIndex + count)
                            }
                        }
                        count++
                    }
                } else {
                    // 没有需要刷新的bubble, 在末尾添加
                    for (let i = 0; i < wxcontent.length; i++) {
                        if (wxcontent[i].text) {
                            this.chatLogsContainer.addLeftBubble(wxcontent[i].text)
                        } else if (wxcontent[i].imageurl) {
                            this.chatLogsContainer.addSinglePicLog(wxcontent[i].imageurl)
                        }
                    }
                }
                if (data.relatedQuestions || data.recommendquestion) {
                    this.chatLogsContainer.addLeftBubble('', data.relatedQuestions || data.recommendquestion)
                }
            }
            // extendAnswer
            if (data.extendAnswer instanceof Array && data.extendAnswer.length > 0) {
                for (let i = 0; i < data.extendAnswer.length; i++) {
                    this.chatLogsContainer.addLeftBubble(data.extendAnswer)
                }
            }
        },
        handleCMDAnswer (res) {
            let answer = res
            if (answer.indexOf('[CMD]:') === -1) {
                return
            }
            answer = answer.substr('[CMD]:'.length, answer.length - '[CMD]:'.length)
            var isCmd = util.isJSON(answer)
            var cmd = isCmd ? JSON.parse(answer) : answer
            if (isCmd) {
                if (cmd.type === 'remind') {
                    answer = cmd.answer + '：' + cmd.remind_info[0].remind_time_info + ' ' + cmd.remind_info[0].remind_event
                } else if (cmd.type === 'planeticket') {
                    // eslint-disable-next-line
                    //  answer = "<a target='_blank' href='" + cmd.urls[0] + "'>点击打开订票链接</a>"
                    answer = {external_link: cmd.urls[0], text: '点击查看：'}
                } else if (cmd.type === 'news') {
                    var content = cmd.title + '<br/>'
                    for (var i = 0; i < cmd.items.length; i++) {
                        // eslint-disable-next-line
                        var item = "<a target='_blank' href='" + cmd.items[i].link + "'>" + cmd.items[i].title + "</a><br>"
                        content += item
                    }
                    answer = content
                } else if (cmd.type === 'ticket') {
                    // eslint-disable-next-line
                    // answer = cmd.answer + "<a target='_blank' href='" + cmd.link + "'> 点此打开 </a>";
                    answer = {external_link: cmd.link, text: '点击查看：'}
                } else if (cmd.type === 'kuaidi') {
                    answer = cmd.answers[0]
                } else {
                    var url = cmd.urls && cmd.urls.length > 0 ? cmd.urls[0] : cmd.url
                    if (url) {
                        var text = cmd.text ? cmd.text : '点击查看：'
                        // eslint-disable-next-line
                        // answer = "<a target='_blank' href='" + answer.external_link = cmd.urls[0] + "'> " + text + " </a>"
                        answer = {external_link: cmd.urls[0], text: text}
                    } else if (cmd.text || cmd.answer) {
                        answer = cmd.text || cmd.answer
                    } else {
                        answer = '未知数据格式：' + answer
                    }
                }
            }
            return answer
        },
        scrollToEnd (time) {
            this.$refs.scroll.scrollToEnd(time)
            this.showToBottomBtn = false
            this.showScrollButtons = true
        },
        onImageLoaded () {
            // 图片加载完，更新scroll高度以及滑到底部
            this.$refs.scroll.refresh()
            this.scrollToEnd()
        },
        onScroll (scrollBottom, upToTwoPages) {
            this.showScrollButtons = scrollBottom
            this.showToBottomBtn = upToTwoPages
        }
    },
    components: {
        Bubble,
        Scroll,
        Cards,
        Emoji,
        SinglePic,
        WXRecording,
        ScrollButtons,
        ExternalLink,
        ExternalPage
    }
}
</script>

<style lang='scss' scoped>
#app {
    height: 100%;
    width: 100%;
    transition: opacity 1.2s;
    .logo-wrapper{
        display: flex;
        align-items: center;
        padding-left: 20px;
        height: 50px;
        background: #FCFCFC;
        border-radius: 15px;
        img{
            width: 30px;
            height: 30px;
        }
        span{
            margin-left: 12px;
            font-size: 14px;
            color: #666666;
            letter-spacing: 0;
        }
    }
    .content-wrapper{
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 50px;
        bottom: 60px;
        left: 0;
        right: 0;
        .iframe{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 300;
            iframe{
                width: 100%;
                height: 100%;
            }
        }
        .scroll-container{
            // position: absolute;
            // top: 0;
            // left: 0;
            // right: 0;
            // bottom: 0;
            width: 100%;
            flex: 1;
            overflow: hidden;
            .end-div{
                height: 20px;
            }
            .end-div2{
                display: inline-block;
                height: 40px;
            }
            .end-div3{
                display: inline-block;
                height: 180px;
            }
            .chat-log{
                padding: 0px 20px;
                width: 100%;
                box-sizing: border-box;
            }
        }
        .scroll-buttons{
            position: fixed;
            bottom: 60px;
            padding-bottom: 5px;
            left: 0px;
            width: 100%;
            background: white;
        }
        .toBottomBtn{
            position: absolute;
            bottom: 10px;
            width: 126px;
            left: 50%;
            margin-left: -63px;
            height: 38px;
            color: #FFFFFF;
            background: #F68C6D;
            box-shadow: 0 2px 5px 0 #E9E9E9;
            border-radius: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            i{
                background-image: url(./assets/image/btm.png);
                background-size: 8px;
                margin-left: 10px;
                width: 8px;
                height: 4px;
                display: inline-block;
            }
        }
    }
    .input-wrapper{
        position: fixed;
        bottom: 0px;
        left: 0;
        width: 100%;
        background: #F7F7F7;
        .input-box-wrapper{
            height: 60px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            padding: 0px 20px;
            box-shadow: 0 0 0 0 #E9E9E9;
            .voice{
                background-image: url(./assets/image/voice.png);
                width: 36px;
                height: 36px;
                background-size: 36px;
                display: inline-block;
                &:hover{
                    cursor: pointer;
                }
            }
            .input-box{
                flex: 1;
                margin-left: 10px;
                .send-icon-wrapper{
                    width: 40px;
                    height: 100%;
                    .icon-send{
                        display: inline-block;
                        width: 20px;
                        height: 18px;
                        margin-top: 11px;
                        margin-right: 10px;
                        margin-left: 5px;
                        background-size: 20px 18px;
                    }
                    .icon-send-blue{
                        background-image: url(./assets/image/send-blue.svg);
                    }
                    .icon-send-none{
                        background-image: url(./assets/image/send-none.svg);
                    }
                }
            }
        }
        .iphonex-bottom {
            height: 2px;
        }
    }
}
.display {
    opcity: 1
}
.hide {
    opacity: 0
}
.tips {
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -113px;
    margin-top: -22px;
    width: 226px;
    height: 44px;
    opacity: 0.7;
    background: #000000;
    border-radius: 3px;
    font-size: 14px;
    color: #FFFFFF;
    letter-spacing: 0;
    line-height: 44px;
    text-align: center;
    z-index: 500;
}
.welcome-wrapper{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    img{
        width: 203px;
        height: 106px;
    }
}
.fade-enter-active, .fade-leave-active {
    transition: opacity .4s ease;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
.slide-fade-enter-active {
    transition: all .3s ease;
}
.slide-fade-leave-active {
    // transition: all .3s ease;
    transition: all .3s ease;
    // cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
    transform: translateY(50px);
    opacity: 0;
}
.tips-enter-active, .tips-leave-active {
    transition: opacity 1s;
}
.tips-enter, .tips-leave-to {
    opacity: 0;
}
.welcome-enter-active, .welcome-leave-active {
    transition: opacity 0.8s;
}
.welcome-enter, .welcome-leave-to {
    opacity: 0;
}
.external-page-enter-active, .external-page-leave-active {
    transition: opacity 1s;
}
.external-page-enter, .external-page-leave-to {
    opacity: 0;
}
</style>
