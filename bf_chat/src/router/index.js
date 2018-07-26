import Vue from 'vue'
import Router from 'vue-router'
import TextLog from '@/components/TextLog/TextLog'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'TextLog',
            component: TextLog
        }
    ]
})
