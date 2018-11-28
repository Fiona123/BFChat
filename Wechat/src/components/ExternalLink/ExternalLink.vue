<template>
    <div id="copyBtn" class="external-wrapper" @click="onClick">
        <slot></slot>
    </div>
</template>

<script>
import Clipboard from 'clipboard'

export default {
    props: {
        link: {
            type: String,
            default: ''
        }
    },
    methods: {
        onClick () {
            const that = this
            let res = this.WX.isMiniProg(isMiniProg => {
                if (isMiniProg) {
                    // 小程序环境
                    that.copyToClipboard()
                } else {
                    that.$emit('navigate', that.link)
                }
            })
            if (res === undefined) {
                that.$emit('navigate', that.link)
            }
        },
        copyToClipboard () {
            let that = this
            var clipboard = new Clipboard('.external-wrapper', {
                text: function () {
                    return that.link
                }
            })
            clipboard.on('success', e => {
                console.log('复制成功')
                // 释放内存
                clipboard.destroy()
                that.$emit('copied')
            })
            clipboard.on('error', e => {
                // 不支持复制
                console.log('该浏览器不支持自动复制')
                // 释放内存
                clipboard.destroy()
                this.$emit('failed')
            })
        }
        // triggerCopy () {
        //     if (document.all) {
        //         document.getElementById('copyBtn').click()
        //     } else {
        //         var e = document.createEvent('MouseEvents')
        //         e.initEvent('click', true, true)
        //         document.getElementById('copyBtn').dispatchEvent(e)
        //     }
        // }
    }
}
</script>

<style>
 .external-wrapper {
    display: inline-block
 }
</style>
