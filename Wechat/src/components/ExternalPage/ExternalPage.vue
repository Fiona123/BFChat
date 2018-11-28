<template>
    <!-- <div class="frame-wrapper">
        <i class="icon-back" @click="back">back</i>
        <iframe :src="link" class="external-page"></iframe>
    </div> -->
    <div class="frame-wrapper">
        <iframe :src="link" class="external-page" scrolling="auto" frameborder="0"></iframe>
    </div>
</template>

<script>
export default {
    props: {
        link: {
            default: 'https://bf.emotibot.com/BF/Wechat/dist/index.html#/',
            type: String
        }
    },
    methods: {
        back () {
            this.$emit('back')
        }
    }
}
</script>

<style lang='scss' scoped>
.frame-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll;
    z-index: 100;
    .external-page {
        width: 100%;
        height: 100%;
    }
    .icon-back{
        position: absolute;
        display: inline-block;
        background-color: black;
        color: white;
        width: 50px;
        height: 50px;
        margin-left: 30px;
        margin-top: 30px;
    }
}
</style>
