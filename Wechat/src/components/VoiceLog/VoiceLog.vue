<template>
    <div class="voice-container">
        <div v-if="voice.owner==='robot'" class="robot">
            <div class="avatar-container">
                <img v-show="voice.showAvatar" class="avatar" :src="logoPath"/>
            </div>
            <div class="voice" :style="{width:timeLength(voice.time)}">voice here </div>
        </div>
        <div v-else class="user">
            <div class="blank"></div>
            <div class="voice" :style="{width:timeLength(voice.time)}">
                <span>{{voice.time}}"</span>
            </div>
            <div class="avatar-container">
                <img v-show="voice.showAvatar" class="avatar" src="/static/logo.png"/>
            </div>
        </div>
    </div>
</template>

<script>
// 最长时间60秒
const MAX_TIME = 60

export default {
    props: {
        voice: {
            type: Object,
            default () {
                return {owner: 'user', url: '', time: 30, showAvatar: true, avatarUrl: '@/assets/logo.png'} // time unit: ms
            }
        }
    },
    methods: {
        timeLength (time) {
            var percent = time / MAX_TIME < 0.2 ? 0.2 : time / MAX_TIME
            return `${percent * 100}%`
        }
    },
    data () {
        return {
            logoPath: process.env.NODE_ENV === 'production' ? './static/logo.jpg' : '/static/logo.jpg'
        }
    }
}
</script>

<style lang='scss' scoped>
@import '../../common/scss/index';

.voice-container{
    width: 100%;
    .robot{
        display: flex;
        margin: 5px;
        padding: 5px;
        max-width: 90%;
        .avatar-container{
            width: 34px;
            min-width: 34px;
            height: 34px;
            margin-right: 8px;
            .avatar{
                width: 100%;
                heigth: 100%;
            }
        }
        .voice{
            @extend .left-bubble;
            span{
                font-size: 14px;
                line-height: 24px;
            }
        }
    }
    .user{
        display: flex;
        margin: 5px;
        padding: 5px;
        .blank{
            flex: 1;
            display: inline-block;
            min-width: 10%;
        }
        .voice{
            @extend .right-bubble;
            span{
                font-size: 14px;
                line-height: 24px;
                margin-left: 10px;
            }
        }
        .avatar-container{
            margin-left: 8px;
            width: 34px;
            min-width: 34px;
            height: 34px;
            .avatar{
                width: 100%;
                heigth: 100%;
            }
        }
    }
}
</style>
