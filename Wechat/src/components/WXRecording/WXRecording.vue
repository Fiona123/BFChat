<template>
    <transition name="voice">
        <div class="recording-wrappers">
            <div class="text-area">
                <el-input type="textarea" v-model="translatedText"></el-input>
            </div>
            <div class="operate-area">
                <div class="keyboard-btn" @click="onExit" v-show="translatedText==''"></div>
                <span class="clear-btn" @click="onClearText" v-show="translatedText!==''">清空</span>
                <span class="send-btn" @click="onSendMessage" v-show="translatedText!==''">发送</span>
                <div class="record-btn-box">
                    <div :class="{'record-btn': true, 'record-btn-background': isRecording}" :style="{width: recordingBtnWidth+'%', height: recordingBtnWidth+'%'}" @touchstart.prevent="startRecording" @touchend.stop="stopRecording"></div>
                </div>
                <span class="press-text" v-show="!isRecording">按住说话</span>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    data () {
        return {
            translatedText: '',
            isRecordReady: false,
            isRecording: false,
            recordingBtnWidth: 70 // unit: %, 制作录音时候的动画
        }
    },
    created () {
        // 获取微信js sdk, 配置签名
        const that = this
        this.WX.JsApiConfig(res => {
            that.isRecordReady = true
            that.WX.onVoiceRecordEnd({
                complete (res) {
                    console.log('voice ended' + res.localId)
                }
            })
        }, err => {
            console.log('wx js sdk config failed ' + err)
        })
    },
    methods: {
        onSendMessage () {
            if (this.translatedText === '') {
                return
            }
            this.$emit('send', this.translatedText)
            this.translatedText = ''
        },
        onExit () {
            this.$emit('close')
        },
        onClearText () {
            this.translatedText = ''
        },
        startRecording () {
            this.isRecording = true
            if (!this.isRecordReady) {
                this.translatedText = '不支持语音'
            }
            this._startTimer()
            this.WX.startRecord()
        },
        stopRecording () {
            this.isRecording = false
            const that = this
            this.WX.stopRecord(text => {
                that.translatedText += ' ' + text
            })
            this._stopTimer()
        },
        _startTimer () {
            const that = this
            this.recordingTimer = setInterval(function () {
                // 计算动画中width 70% -> 100%
                that.recordingBtnWidth = (that.recordingBtnWidth + 1) % 100
                if (that.recordingBtnWidth < 70) {
                    that.recordingBtnWidth = 70
                }
            }, 50)
        },
        _stopTimer () {
            clearInterval(this.recordingTimer)
        }
    }
}
</script>

<style lang='scss' scoped>
.voice-enter-active, .voice-leave-active {
    transition: transform 0.4s;
    transition: opacity 0.5s;
    transform: translateY(0px);
    opacity: 1;
}
.voice-enter, .voice-leave-to {
    transform: translateY(150px);
    opacity: 0;
}
.recording-wrappers {
    position: fixed;
    bottom: 0px;
    left: 0;
    // height: 240px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 14px;
    background: #F7F7F7;
    box-shadow: 0 0 0 0 #E9E9E9;
    .text-area {
        flex: 1;
        margin: 16px;
    }
    .operate-area{
        height: 100px;
        position: relative;
        .keyboard-btn{
            background-image: url(../../assets/image/keyboard.png);
            width: 36px;
            height: 36px;
            background-size: 36px;
            display: inline-block;
            position: absolute;
            left: 16px;
            bottom: 16px;
        }
        .clear-btn{
            position: absolute;
            left: 24px;
            bottom: 24px;
            font-size: 18px;
            color: #999999;
        }
        .send-btn{
            position: absolute;
            right: 24px;
            bottom: 24px;
            font-size: 18px;
            color: #3389EE;
        }
        .record-btn-box{
            width: 83px;
            height: 83px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            bottom: 0;
            left: 50%;
            margin-left: -42px;
            .record-btn{
                background: #F7F7F7 url(../../assets/image/recording.png) no-repeat center;
                background-size: 51px;
                border-radius: 50px;
                width: 70%;
                height: 70%;
            }
            .record-btn-background{
                background-color: rgba(51,137,238,0.20);
            }
        }
        .press-text{
            font-size: 14px;
            color: #868686;
            position: absolute;
            left: 50%;
            margin-left: -25px;
            bottom: 75px;
        }
    }
}
</style>
