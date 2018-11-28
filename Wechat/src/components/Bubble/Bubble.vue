<template>
    <div class="container">
        <div v-if="props.direction==='left'" class="left">
     <!--        <div class="avatar-container">
                <img v-show="props.showAvatar" class="avatar" :src="logoPath"/>
            </div> -->
            <div class="content-wrapper" key="content-box">
                <transition name="expand" mode="out-in">
                    <div class="loading" v-if="loading" key="loadingbox">
                        <loading></loading>
                    </div>
                    <div v-else key="content1">
                        <div class="answer-wrapper" v-show="(props.content != undefined && props.content != '') || (props.links != undefined && props.links.length > 0)">
                            <span v-for="(item, key) in htmlContent" :key="key">
                                <Emoji v-if="item.type == 'emoji'" :name='item.content'></Emoji>
                                <span v-else>{{item.content}}</span>
                            </span>
                            <div v-show="props.links != undefined && props.links.length > 0">你可能还想问:</div>
                        </div>
                        <div class="links" v-for="(question, index) in props.links" :key="index" @click="linkClicked(question)">{{index+1}}. {{question}}</div>
                        <div v-show="showLike" class="like-wrapper">
                            <div class="like-box like-border">
                                <i :class="{'icon-like': !liked, 'icon-liked': liked}" @click="liked = !liked; disliked = false"></i>
                                <span @click="liked = !liked; disliked = false">有用</span>
                            </div>
                            <div class="like-box">
                                <i :class="{'icon-dislike': !disliked, 'icon-disliked': disliked}" @click="disliked = !disliked; liked = false"></i>
                                <span @click="disliked = !disliked; liked = false">无用</span>
                            </div>
                        </div>
                    </div>
    <!--            <div v-show="props.imageUrl != undefined && props.imageUrl != ''">
                        <img class="image" :src="props.imageUrl">
                    </div> -->
                </transition>
            </div>
        </div>
        <div v-else class="right">
            <div class="blank"></div>
            <div class="text">
                <span v-for="(item, key) in htmlContent" :key="key">
                    <Emoji v-if="item.type == 'emoji'" :name='item.content'></Emoji>
                    <span v-else class="answer-text">{{item.content}}</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import Emoji from '@/components/Emoji/Emoji'
import Loading from '@/components/Loading/Loading'
export default {
    props: {
        props: {
            type: Object,
            default () {
                return {
                    id: '', // 定位loading中的bubble，以便刷新某个bubble
                    // title: '',
                    direction: 'left', // or 'right'
                    content: '',
                    links: []
                    // imageUrl: '', // 回复单图片地址， String , showAvatar: true,  avatarUrl: '@/assets/logo.png'
                }
            }
        },
        showLike: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            liked: false,
            disliked: false
        }
    },
    updated () {
        const that = this
        // 隐藏loading & 显示内容的动画时间为0.2s
        setTimeout(function () {
            that.$emit('update')
        }, 210)
    },
    methods: {
        linkClicked (question) {
            this.$emit('clickLink', question)
        }
    },
    computed: {
        loading () {
            return (this.props.content === undefined || this.props.content === '') && this.props.links === undefined
        },
        htmlContent () {
            var str = this.props.content
            if (str === undefined) {
                return ''
            }
            var startIndx = str.indexOf('#icon--')
            var endIndx = str.indexOf('#', startIndx + 1)
            var lastEnd = 0
            var htmlContent = []
            while (startIndx !== -1 && endIndx > startIndx) {
                const iconname = str.substring(startIndx, endIndx) // #icon--angel
                htmlContent.push({type: 'text', content: str.substring(lastEnd, startIndx)})
                htmlContent.push({type: 'emoji', content: iconname})
                lastEnd = endIndx + 1
                startIndx = this.props.content.indexOf('#icon--', endIndx + 1)
                endIndx = this.props.content.indexOf('#', startIndx + 1)
            }
            htmlContent.push({type: 'text', content: str.substring(lastEnd, str.length)})
            return htmlContent
        }
    },
    components: {
        Emoji,
        Loading
    }
}
</script>

<style lang='scss' scoped>
@import '../../common/scss/index';

.container{
    width: 100%;
    .left{
        display: flex;
        // margin: 0px 20px 5px 20px;
        // padding: 5px;
        max-width: 70%;
        .avatar-container{
            width: 34px;
            min-width: 34px;
            height: 34px;
            margin-right: 8px;
            .avatar{
                width: 100%;
                height: 100%;
            }
        }
        .loading{
            // @extend .left-bubble;
        }
        .content-wrapper{
            font-size: 16px;
            line-height: 24px;
            letter-spacing: 0;
            min-height: 44px;
            min-width: 80px;
            @extend .left-bubble;
            .answer-wrapper{
                padding: 10px 15px;
                box-sizing: border-box;
                word-wrap: break-word;
            }
            .links{
                color: #3389EE;
                // box-shadow: inset 0 -1px 0 0 #E9E9E9;
                box-shadow: inset 0 1px 0 0 #E9E9E9;
                line-height: 24px;
                padding: 8px 15px;
            }
            .like-wrapper{
                display: flex;
                box-shadow: inset 0 1px 0 0 #E9E9E9;
                .like-border{
                    box-shadow: inset -1px 0 0 0 #E9E9E9;
                }
                .like-box{
                    flex: 1;
                    height: 44px;
                    line-height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 80px;
                    i{
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background-size: 16px;
                        margin-right: 10px;
                    }
                    .icon-like{
                        background-image: url(./like.png)
                    }
                    .icon-liked{
                        background-image: url(./liked.png)
                    }
                    .icon-dislike{
                        background-image: url(./dislike.png)
                    }
                    .icon-disliked{
                        background-image: url(./disliked.png)
                    }
                }
            }
            .image{
                max-width: 100%;
            }
        }
    }
    .right{
        display: flex;
        // margin: 0px 20px 5px 20px;
        // padding: 5px;
        max-width: 100%;
        .blank{
            flex: 1;
            display: inline-block;
            min-width: 30%;
        }
        .text{
            font-size: 16px;
            line-height: 24px;
            padding: 10px 15px;
            box-sizing: border-box;
            @extend .right-bubble;
            .answer-text{
                word-break: break-word;
            }
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
.expand-enter-active, .expand-leave-active {
    transition: all .1s linear;
}
.expand-enter, .expand-leave-to {
    opacity: 0;
    // width: 0px;
}
</style>
