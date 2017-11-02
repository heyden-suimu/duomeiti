import App from '../App'

const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')
const login = r => require.ensure([], () => r(require('../page/login/login')), 'login')
const verList = r =>require.ensure([], () => r(require('../page/version/verList')), 'verList')
const addVer = r =>require.ensure([], () => r(require('../page/version/addVer')), 'addVer')
const search_media = r => require.ensure([], () => r(require('../page/media/search')), 'search')
const result_media = r => require.ensure([], () => r(require('../page/media/result')), 'result')
const songSheet_media = r => require.ensure([], () => r(require('../page/media/songSheet')), 'songSheet')
const addSongSheet_media = r => require.ensure([], () => r(require('../page/media/addSongSheet')), 'addSongSheet')
const homeView_media = r => require.ensure([], () => r(require('../page/media/homeView')), 'homeView')
const localSheet_media = r => require.ensure([], () => r(require('../page/media/localSheet')), 'localSheet')
const musicList_media = r => require.ensure([], () => r(require('../page/media/musicList')), 'musicList')
const loaclRelation_media = r => require.ensure([], () => r(require('../page/media/loaclRelation')), 'loaclRelation')

export default [{
    path: '/',
    component: App, //顶层路由，对应index.html
    children: [ //二级路由。对应App.vue
        //地址为空时跳转home页面
        {
            path: '',
            redirect: '/login'
        },
        {
            path: '/home',
            component: home,
            children:[
                {path: '',redirect: '/media/search'},
                // {path:"/home/verList",component:verList},
                // {path:"/home/addVer",component:addVer},
                {path:"/media/search",component:search_media},
                {path:"/media/result",component:result_media},
                {path:"/media/songSheet",component:songSheet_media},
                {path:"/media/addSongSheet",component:addSongSheet_media},
                {path:"/media/homeView",component:homeView_media},
                {path:"/media/localSheet",component:localSheet_media},
                {path:"/media/musicList",component:musicList_media},
                {path:"/media/loaclRelation",component:loaclRelation_media},
            ]
        },
        //登陆注册页
        {
            path: '/login',
            component: login
        },
    ]
}]
