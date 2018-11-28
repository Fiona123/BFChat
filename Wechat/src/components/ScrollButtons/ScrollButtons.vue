<template>
    <div class="scroll-button-box">
        <scroll class="scroll" :data="items" direction="horizontal" :listenScroll="false">
            <div class="scroll-content-box">
                <span v-for="(item, index) in items" :key="index" @click="onButtonClick(item)">{{item}}</span>
            </div>
        </scroll>
    </div>
</template>

<script>
import Scroll from '@/components/Scroll/Scroll'

export default {
    props: {
        items: {
            type: Array,
            default () {
                return ['讲个笑话', '给我看一条新闻']
            }
        }
    },
    methods: {
        onButtonClick (text) {
            this.$emit('select', text)
        }
    },
    components: {
        Scroll
    }
}
</script>

<style lang='scss' scoped>
.scroll-button-box{
    width: 100%;
    height: 35px;
    line-height: 35px;
    background: white;
    .scroll{
        .scroll-content-box{
            white-space: nowrap;
            display: inline-block;
            white-space: nowrap;
            span{
                padding: 5px 10px;
                margin-right: 5px;
                border: 1px solid #1875F0;
                border-radius: 15px;
                font-size: 14px;
                color: #3D80FF;
                letter-spacing: 0;
                &:last-child {
                    margin-right: 0px;
                }
            }
        }
    }
}
</style>
