<template>
    <div class="container">
        <div v-if="chat.owner==='robot'" class="robot">
            <div class="avatar-container">
                <img v-show="chat.showAvatar" class="avatar" src="/static/logo.jpg"/>
            </div>
            <div class="text">{{chat.content}}</div>
        </div>
        <div v-else class="user">
            <div class="blank"></div>
            <div class="text">{{chat.content}}</div>
            <div class="avatar-container">
                <img v-show="chat.showAvatar" class="avatar" src="/static/logo.png"/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        chat: {
            type: Object,
            default () {
                return {type: 'text', owner: 'robot', content: '您好，有什么能帮您的吗？', showAvatar: true, avatarUrl: '@/assets/logo.png'}
            }
        }
    },
    data () {
        return {
        }
    }
}
</script>

<style lang='scss' scoped>
.container{
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
        .text{
            display: inline-block;
            font-size: 16px;
            line-height: 18px;
            border-top-left-radius:30px;
            border-top-right-radius:30px;
            border-bottom-right-radius:30px;
            border-bottom-left-radius:10px;
            padding: 7px 10px;
            background-color: rgb(79, 138, 201);
            color: white;
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
        .text{
            display: inline-block;
            font-size: 16px;
            line-height: 18px;
            border-top-right-radius: 30px;
            border-top-left-radius: 30px;
            border-bottom-left-radius: 30px;
            border-bottom-right-radius: 10px;
            padding: 7px 10px;
            // background-color: rgb(0, 167, 141);
            background-color: rgb(64, 163, 172);
            color: white;
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
