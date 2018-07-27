<template>
    <div id="app">
        <div class="content-box">
            <Scroll class="scroll-container" :data="chatList" ref="scroll">
                <div class="chat-log" v-for="(item, index) in chatList" :key="index">
                    <text-log v-if="item.type === 'text'" :chat="item"></text-log>
                    <options v-else-if="item.type === 'options'"></options>
                </div>
                <img src="/static/gif.gif">
                <el-button type="danger" plain @click="clickBtn">危险按钮</el-button>
                <div class="end-div" ref="end"></div>
            </Scroll>
        </div>
        <div class="input-container">
            <el-input class="input-box" :placeholder="placeholder" v-model="inputQuestion" :readonly="isVoiceType"
            @change="sendChat">
                <i slot="prefix" class="el-icon-close stop-recording" v-show="isVoiceType" @click="switchToVoice"></i>
                <i slot="suffix" class="el-icon-caret-left switch-to-voice" v-show="!isVoiceType" @click="switchToVoice"></i>
                <i slot="suffix" class="el-icon-loading switch-to-voice orange" v-show="isVoiceType"></i>
            </el-input>
        </div>
    </div>
</template>

<script>
import TextLog from '@/components/TextLog/TextLog'
import Scroll from '@/components/Scroll/Scroll'
import Options from '@/components/Options/Options'
// eslint-disable-next-line
import https from '@/common/js/https'

export default {
    name: 'App',
    data () {
        return {
            chatList: [
                {type: 'text', owner: 'robot', content: 'Hi', showAvatar: true},
                {type: 'text', owner: 'robot', content: 'What can I do for you?', showAvatar: false},
                {type: 'options', owner: 'robot', content: []}
            ],
            isVoiceType: false,
            inputQuestion: '',
            placeholder: 'Say something...'
        }
    },
    methods: {
        switchToVoice () {
            this.isVoiceType = !this.isVoiceType
            if (this.isVoiceType) {
                this.placeholder = '   Listening...'
                this.inputQuestion = ''
            } else {
                this.placeholder = 'Say something...'
            }
        },
        sendChat () {
            let showAvatar = false
            const that = this
            if (this.chatList[this.chatList.length - 1].owner === 'robot') {
                showAvatar = true
            }
            this.chatList.push({type: 'text', owner: 'user', content: this.inputQuestion, showAvatar: showAvatar})

            if (this.inputQuestion.indexOf('can you do') !== -1) {
                this.inputQuestion = ''
                this.chatList.push({type: 'options', owner: 'robot', content: []})
                return
            }
            https.sendChatRequest(this.inputQuestion, {
                success: function (data) {
                    let num = that.chatList.length
                    if (num < 1) {
                        return
                    }
                    let showAvat = that.chatList[that.chatList.length - 1].owner === 'user'
                    that.chatList.push({type: 'text', owner: 'robot', content: data, showAvatar: showAvat})
                    that.$refs.scroll.scrollToEnd()
                },
                fail: function () {
                    console.log('failed')
                }
            })
            this.inputQuestion = ''
            this.$refs.scroll.scrollToEnd()
        }
    },
    components: {
        TextLog,
        Scroll,
        Options
    }
}
</script>

<style lang='scss' scoped>
#app {
    height: 100%;
    width: 100%;
    .content-box{
        display: inline-block;
        position: absolute;
        top: 0;
        bottom: 60px;
        left: 0;
        right: 0;
        .scroll-container{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            overflow: hidden;
            .end-div{
                height: 20px;
                width: 100%;
            }
        }
    }
    .input-container{
        position: fixed;
        bottom: 0px;
        left: 0;
        padding-bottom: 10px;
        height: 50px;
        width: 100%;
        background-color: white;
        .input-box{
            width: 96%;
            margin: 5px 2%;
        }
        .stop-recording{
            font-size: 1.5rem;
            margin-top: 8px;
            margin-left: 10px;
        }
        .switch-to-voice{
            font-size: 1.5rem;
            margin-top: 8px;
            margin-right: 3px;
        }
        .orange{
            color: #ff8a65;
        }
    }
}
</style>
