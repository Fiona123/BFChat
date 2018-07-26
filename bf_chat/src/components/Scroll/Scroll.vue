<template>
    <div class="scroll-wrapper" ref="scrollWrapper">
        <div class="content-wrapper" ref="contentWrapper">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'

const DIRECTION_H = 'horizontal'
const DIRECTION_V = 'vertical'

export default {
    props: {
        probeType: {
            type: Number,
            default: 1
        },
        click: {
            type: Boolean,
            default: true
        },
        direction: {
            type: String,
            default: DIRECTION_V
        },
        data: {
            type: Array || Object,
            default: null
        },
        listenScroll: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        data () {
            setTimeout(() => {
                this.refresh()
            }, 20)
        }
    },
    mounted () {
        setTimeout(() => {
            this._initScroll()
        }, 20)
    },
    methods: {
        _initScroll () {
            this.scroll = new BScroll(this.$refs.scrollWrapper, {
                probeType: this.probeType,
                click: this.click,
                eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V
            })
            if (this.listenScroll) {
                let me = this
                this.scroll.on('scroll', (pos) => {
                    me.$emit('scroll', pos)
                })
            }
        },
        refresh () {
            this.scroll && this.scroll.refresh()
        },
        scrollTo () {
            this.scroll && this.scroll.scrollTo(arguments)
        },
        scrollToElement () {
            console.log('scroll heigth = ' + this.$refs.contentWrapper.clientHeight)
            this.scroll && this.scroll.scrollToElement(arguments)
        },
        scrollToEnd () {
            const that = this
            this.$nextTick(function () {
                const clientY = that.$refs.contentWrapper.clientHeight - that.$refs.scrollWrapper.clientHeight
                if (clientY < 0) {
                    return
                }
                that.scroll && that.scroll.scrollTo(0, -clientY)
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.scroll-wrapper{
    height: 100%;
    overflow: hidden;
}
</style>
