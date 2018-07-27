<template>
    <div class="scroll-box">
        <scroll class="scroll" :data="options" direction="horizontal">
            <div class="scroll-content-box">
                <el-card class="card" v-for="(option, index) in options" :key="index" @click.native="selectCard"
                :body-style="{ padding: '15px', width: '120px', height: '145px', display: 'flex', 'flex-direction': 'column' }">
                    <div class="img-box"><img :src="option.iconUrl" class="image" height="64px"></div>
                    <div class="text-box" @click="selectCard">
                        <span>{{option.title}}</span>
                        <p>{{option.description}}</p>
                    </div>
                </el-card>
            </div>
        </scroll>
    </div>
</template>

<script>
import Scroll from '@/components/Scroll/Scroll'

export default {
    props: {
        options: {
            type: Array,
            default () {
                return [{iconUrl: '/static/01.png', title: 'Subscriptions', description: 'Send me news daily  Send me peoms daily '},
                    {iconUrl: '/static/02.png', title: 'Places nearby', description: 'What is the closest sweets shop? Any coffee shops around? haahhahahahahahahha'},
                    {iconUrl: '/static/03.png', title: 'Answers', description: 'When is the sunset? \\n Why is the skey blue? '},
                    {iconUrl: '/static/04.png', title: 'Sports', description: 'Tell me sports news who plays for the Rising Pune bbbbbbbb....'},
                    {iconUrl: '/static/05.png', title: 'Fun', description: 'Count from 1 to 10 \\n What am I thinking right noew? '},
                    {iconUrl: '/static/06.png', title: 'Weather', description: 'What is the weather? \\n What is the weather in Goa? '},
                    {iconUrl: '/static/07.png', title: 'Games', description: 'Play a Chat game \\n Play a Quiz game '},
                    {iconUrl: '/static/08.png', title: 'Nutrition', description: 'Calories in an apple \\n Fat in an egg'},
                    {iconUrl: '/static/09.png', title: 'Travel', description: 'Flights to Pune \\n Status of Delta 324'},
                    {iconUrl: '/static/10.png', title: 'Dictionary', description: 'Define abracadabra \\n What is the definition of abracadabra'},
                    {iconUrl: '/static/11.png', title: 'Personal stuff ', description: 'What is my next meeting? \\n When is my flight?'},
                    {iconUrl: '/static/12.png', title: 'Conversions', description: '1 kilo in pounds How many rupees in a dollar?'},
                    {iconUrl: '/static/13.png', title: 'Finance', description: 'Reliance stock price What is the NIFTY trading at？ '},
                    {iconUrl: '/static/14.png', title: 'Calculate', description: 'What is 8% of 63? What is pi times 157 squared?'},
                    {iconUrl: '/static/15.png', title: 'Transition', description: 'Hello in hindi Good morining in Malayalam?'}]
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
                    margin-bottom: 10px;
                }
                .text-box{
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    span{
                        font-size: 14px;
                        line-height: 18px;
                        height: 18px;
                        font-weight: bold;
                    }
                    p{
                        flex: 1;
                        margin-bottom: 10px;
                        font-size: 12px;
                        line-height: 14px;
                        white-space: normal;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }
}
</style>
