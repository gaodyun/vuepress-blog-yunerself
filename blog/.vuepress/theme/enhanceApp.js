import { Timeline, TimelineItem, Collapse, CollapseItem } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

export default ({
    Vue, // the version of Vue being used in the VuePress app
    options, // the options for the root Vue instance
    router, // the router instance for the app
    siteData // site metadata
}) => {
    // ...apply enhancements to the app
    // 应用级别的路由配置
    // router.addRoutes([
    //     {
    //         path: '/archive/',
    //         component: () => import('../components/Archive.vue')
    //     },
    // ])
    Vue.use(Timeline);
    Vue.use(TimelineItem);
    Vue.use(Collapse);
    Vue.use(CollapseItem);
}