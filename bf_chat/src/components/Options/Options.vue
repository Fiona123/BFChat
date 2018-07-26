<template>
    <div class="scroll-box">
        <scroll-other class="scroll" direction="horizontal" :data="options">
            <div class="scroll-content-box">
                <div class="card-box" v-for="(option, index) in options" :key="index">test</div>
            </div>
              <!--   <el-card v-for="(option, index) in options" class="card" :key="index">
                    <img :src="option.iconUrl" class="image">
                    <div>
                        <span>{{option.title}}</span>
                        <p>{{option.description}}</p>
                    </div>
                </el-card> -->
        </scroll-other>
    </div>
</template>

<script>
import ScrollOther from '@/components/Scroll/ScrollOther'

export default {
    props: {
        options: {
            type: Array,
            default () {
                return [{iconUrl: '../Options/01.png', title: 'Subscriptions', description: 'Send me news daily \\n Send me peoms daily '},
                    {iconUrl: './02.png', title: 'Places nearby', description: 'What is the closest sweets shop? Any coffee shops around? bbbbbbb'},
                    {iconUrl: './03.png', title: 'Answers', description: 'When is the sunset? \\n Why is the skey blue? '},
                    {iconUrl: './04.png', title: 'Sports', description: 'Tell me sports news who plays for the Rising Pune bbbbbbbb....'},
                    {iconUrl: './05.png', title: 'Fun', description: 'Count from 1 to 10 \\n What am I thinking right noew? '},
                    {iconUrl: './06.png', title: 'Weather', description: 'What is the weather? \\n What is the weather in Goa? '},
                    {iconUrl: './07.png', title: 'Games', description: 'Play a Chat game \\n Play a Quiz game '},
                    {iconUrl: './08.png', title: 'Nutrition', description: 'Calories in an apple \\n Fat in an egg'},
                    {iconUrl: './09.png', title: 'Travel', description: 'Flights to Pune \\n Status of Delta 324'},
                    {iconUrl: './10.png', title: 'Dictionary', description: 'Define abracadabra \\n What is the definition of abracadabra'},
                    {iconUrl: './11.png', title: 'Personal stuff ', description: 'What is my next meeting? \\n When is my flight?'},
                    {iconUrl: './12.png', title: 'Conversions', description: '1 kilo in pounds How many rupees in a dollar?'},
                    {iconUrl: './13.png', title: 'Finance', description: 'Reliance stock price What is the NIFTY trading at？ '},
                    {iconUrl: './14.png', title: 'Calculate', description: 'What is 8% of 63? What is pi times 157 squared?'},
                    {iconUrl: './15.png', title: 'Transition', description: 'Hello in hindi Good morining in Malayalam?'}]
            }
        }
    },
    data () {
        return {

        }
    },
    components: {
        ScrollOther
    }
}
</script>

<style lang='scss' scoped>
.scroll-box{
    width: 100%;
    height: 150px;
    background-color: yellow;
    position: relative;
    .scroll{
        height: 100%;
        .scroll-content-box{
            .card-box{
                display: inline-block;
                width: 120px;
                height: 150px !important;;
                height: 100%;
                min-width: 120px;
                background-color: pink;
                margin-left: 10px;
            }
        }
    }
}
</style>
