import Vue from 'vue'
import Router from 'vue-router'
import Bubble from '@/components/Bubble/Bubble'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Bubble',
            component: Bubble
        }
    ]
})
