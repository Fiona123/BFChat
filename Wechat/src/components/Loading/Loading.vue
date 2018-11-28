<template>
    <div class="loading-wrapper">
        <span v-for="(bar, key) in bars" :key="key" :style="{'height':bar+'px'}"></span>
    </div>
</template>

<script>
export default {
    data () {
        return {
            bars: [16, 12, 10, 12, 14, 16, 14, 12], // unit: px, range: 8-18
            directions: ['+', '+', '+', '-', '-', '-', '-', '+']
        }
    },
    mounted () {
        const that = this
        setInterval(function () {
            // 随机分配高度
            for (var i = 0; i < that.bars.length; i++) {
                let operator = Math.round(Math.random())
                // let num = Math.round(Math.random() * 10 + 6)
                const gap = 4
                if (operator === 1) {
                    if (that.bars[i] >= 16) {
                        // that.$set(that.bars, i, num) // that.bars[i] - 4)
                        that.$set(that.bars, i, that.bars[i] - gap)
                    } else {
                        // that.$set(that.bars, i, num) // that.bars[i] + 4)
                        that.$set(that.bars, i, that.bars[i] + gap)
                    }
                } else {
                    if (that.bars[i] <= 8) {
                        // that.$set(that.bars, i, num) // that.bars[i] + 4)
                        that.$set(that.bars, i, that.bars[i] + gap)
                    } else {
                        // that.$set(that.bars, i, num) // that.bars[i] - 4)
                        that.$set(that.bars, i, that.bars[i] - gap)
                    }
                }
            }
        }, 200)
    }
}
</script>

<style lang='scss' scoped>
.loading-wrapper{
    margin: 12px 15px;
    display: flex;
    height: 20px;
    align-items: center;
    span{
        width: 4px;
        margin-left: 2px;
        background: #3389EE;
        border-radius: 2px;
        display: inline-block;
        transition: height 0.2s linear;
        &:last-child{
            margin-right: 2px;
        }
    }
}
</style>
