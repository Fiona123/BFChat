<template>
    <div class="scroll-box" @mousewheel.stop @mousewheel.prevent>
        <scroll class="scroll" :data="options" direction="horizontal" :listenScroll="false">
            <div class="scroll-content-box">
                <el-card class="card" v-for="(option, index) in options" :key="index" @click.native="selectCard"
                :body-style="{ padding: '0px', width: '145px', display: 'flex', 'flex-direction': 'column' }">
                    <div class="img-box"><img src="./card.png" class="image" height="108px"></div>
                    <div class="text-box" @click="selectCard">
                        <span>产品卡片{{index}}</span>
                        <p>现在的学生可以使用各种电子设备和应用来辅助学习</p>
                    </div>
                </el-card>
            </div>
        </scroll>
    </div>
</template>

<script>
import Scroll from '@/components/Scroll/Scroll'
const prefix = process.env.NODE_ENV === 'production' ? '.' : ''

export default {
    props: {
        options: {
            type: Array,
            default () {
                return [{iconUrl: './card.png', title: 'Subscriptions', description: 'Send me news daily  Send me peoms daily '},
                    {iconUrl: prefix + '/static/02.png', title: 'Places nearby', description: 'What is the closest sweets shop? Any coffee shops around? haahhahahahahahahha'},
                    {iconUrl: prefix + '/static/03.png', title: 'Answers', description: 'When is the sunset? \\n Why is the skey blue? '},
                    {iconUrl: prefix + '/static/04.png', title: 'Sports', description: 'Tell me sports news who plays for the Rising Pune bbbbbbbb....'},
                    {iconUrl: prefix + '/static/05.png', title: 'Fun', description: 'Count from 1 to 10 \\n What am I thinking right noew? '},
                    {iconUrl: prefix + '/static/06.png', title: 'Weather', description: 'What is the weather? \\n What is the weather in Goa? '},
                    {iconUrl: prefix + '/static/07.png', title: 'Games', description: 'Play a Chat game \\n Play a Quiz game '},
                    {iconUrl: prefix + '/static/08.png', title: 'Nutrition', description: 'Calories in an apple \\n Fat in an egg'},
                    {iconUrl: prefix + '/static/09.png', title: 'Travel', description: 'Flights to Pune \\n Status of Delta 324'},
                    {iconUrl: prefix + '/static/10.png', title: 'Dictionary', description: 'Define abracadabra \\n What is the definition of abracadabra'},
                    {iconUrl: prefix + '/static/11.png', title: 'Personal stuff ', description: 'What is my next meeting? \\n When is my flight?'},
                    {iconUrl: prefix + '/static/12.png', title: 'Conversions', description: '1 kilo in pounds How many rupees in a dollar?'},
                    {iconUrl: prefix + '/static/13.png', title: 'Finance', description: 'Reliance stock price What is the NIFTY trading at？ '},
                    {iconUrl: prefix + '/static/14.png', title: 'Calculate', description: 'What is 8% of 63? What is pi times 157 squared?'},
                    {iconUrl: prefix + '/static/15.png', title: 'Transition', description: 'Hello in hindi Good morining in Malayalam?'}]
            }
        }
    },
    data () {
        return {

        }
    },
    methods: {
        selectCard () {
            alert('card selected! ')
        }
    },
    components: {
        Scroll
    }
}
</script>

<style lang='scss' scoped>
.scroll-box{
    width: 100%;
    .scroll{
        .scroll-content-box{
            white-space: nowrap;
            display: inline-block;
            white-space: nowrap;
            .card{
                display: inline-block;
                margin-left: 10px;
                &:last-child{
                    margin-right: 10px;
                }
                .img-box{
                    display: inline-block;
                    display: flex;
                    justify-content: center;
                    margin-bottom: 8px;
                }
                .text-box{
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    margin: 0px 10px 10px 10px;
                    span{
                        font-size: 14px;
                        color: #333333;
                        height: 20px;
                        font-weight: bold;
                    }
                    p{
                        flex: 1;
                        font-size: 12px;
                        color: #999999;
                        text-align: left;
                        line-height: 16px;
                        height: 32px;
                        text-overflow:ellipsis;
                        display:-webkit-box;
                        -webkit-box-orient:vertical;
                        -webkit-line-clamp:2;
                        white-space: normal;
                        overflow: hidden;
                    }
                }
            }
        }
    }
}
</style>
