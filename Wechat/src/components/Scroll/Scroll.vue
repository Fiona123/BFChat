<template>
    <div ref="wrapper" v-if="direction==='horizontal'">
        <slot></slot>
    </div>
    <div ref="wrapper" v-else>
        <div ref="contentWrapper">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'

const DIRECTION_H = 'horizontal'
const DIRECTION_V = 'vertical'
// 内容高度 that.$refs.contentWrapper.clientHeight
// 外框高度 that.$refs.wrapper.clientHeight

export default {
    props: {
        probeType: {
            type: Number,
            default: 3 // 可选值：1、2、3 = 【非实时】【实时】【实时+momentum滚动实时】派发滚动事件
        },
        click: {
            type: Boolean,
            default: true
        },
        listenScroll: {
            type: Boolean,
            default: true
        },
        data: {
            type: Array,
            default: null
        },
        pullup: {
            type: Boolean,
            default: false
        },
        beforeScroll: {
            type: Boolean,
            default: false
        },
        refreshDelay: {
            type: Number,
            default: 20
        },
        direction: {
            type: String,
            default: DIRECTION_V
        },
        mouseWheel: {
            type: Boolean,
            default: true
        },
        scrollToEndByDefault: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            firstLoad: true
        }
    },
    mounted () {
        setTimeout(() => {
            this._initScroll()
        }, 20)
    },
    methods: {
        _initScroll () {
            if (!this.$refs.wrapper) {
                return
            }
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: this.click,
                // eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V
                scrollY: this.direction === DIRECTION_V,
                scrollX: this.direction === DIRECTION_H,
                mouseWheel: this.mouseWheel
            })

            if (this.listenScroll) {
                const that = this
                this.scroll.on('scroll', (pos) => {
                    // 参数2 - 是否滑动到前面两页
                    var v1 = that.$refs.contentWrapper.clientHeight - that.$refs.wrapper.clientHeight
                    var v2 = pos.y
                    if (!this.scrollingByCode) {
                        this.$emit('scroll', v1 + v2 < 50, pos.y > that.$refs.wrapper.clientHeight * 3 - that.$refs.contentWrapper.clientHeight)
                    }
                })
            }

            if (this.pullup) {
                this.scroll.on('scrollEnd', () => {
                    if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                        this.$emit('scrollToEnd')
                    }
                })
            }

            if (this.beforeScroll) {
                this.scroll.on('beforeScrollStart', () => {
                    this.$emit('beforeScroll')
                })
            }
            this.scroll.on('scrollEnd', () => {
                this.scrollingByCode = false
            })
        },
        disable () {
            this.scroll && this.scroll.disable()
        },
        enable () {
            this.scroll && this.scroll.enable()
        },
        refresh () {
            this.scroll && this.scroll.refresh()
        },
        scrollTo () {
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement () {
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        },
        scrollToEnd (t) {
            let time = t === undefined ? 300 : t
            const that = this
            this.scrollingByCode = true
            this.$nextTick(function () {
                // that.refresh()
                const clientY = that.$refs.contentWrapper.clientHeight - that.$refs.wrapper.clientHeight
                if (clientY < 0) {
                    return
                }
                const easing = {
                    style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    fn: function (t) {
                        return t * (2 - t)
                    }
                }
                that.scroll && that.scroll.scrollTo(0, -clientY, time, easing)
            })
        }
    },
    watch: {
        data () {
            setTimeout(() => {
                this.refresh()
                if (this.scrollToEndByDefault && this.firstLoad) {
                    this.scrollToEnd()
                    this.firstLoad = false
                }
            }, this.refreshDelay)
        }
    }
}
</script>

<style>
</style>
