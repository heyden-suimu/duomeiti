import fetch from '../config/fetch'
// 歌单列表API
var apiSongSheet = (type='GET',obj={})=>fetch(type,"/api/v1/media/audioList",obj)
//音频api
const  localAudio =(type='GET',obj={})=>fetch(type,"/api/v1/media/audio",obj)
// 删除青牛图片(无法调用)
const delQiniu = (type='get',obj={})=>fetch(type,'http://up-z2.qiniu.com/delete')
// 本地映射api
const keywordsMapping =(type='GET',obj={})=>fetch(type,"/api/v1/media/keywordsMapping",obj)


// 搜索资源
const  apiAudio =(type='GET',obj={})=>fetch(type,"/api/v1/media/audio",obj)
//网易、虾米
const  yunAudio =(type='GET',obj={})=>fetch(type,"/api/v1/media/searchsongs",obj)
//喜马拉雅
const  xmAudio =(type='GET',obj={})=>fetch(type,"/api/v1/media/searchxmly",obj)
//移动到歌单
const  moveAudio =(type='GET',obj={})=>fetch(type,"/api/v1/media/audioListDetails",obj)
// 获取节目详情
const  browse =(type='GET',obj={})=>fetch(type,"/api/v1/media/browse",obj)

// 获取首页歌单
const  apiHome =(type='GET',obj={})=>fetch(type,"/api/v1/media/homePage",obj)
//获取歌单里面的音频列表
const  getAudios =(type='GET',obj={})=>fetch(type,"/api/v1/media/audios",obj)

// 节目放入歌单
const  jieMuApi =(type='GET',obj={})=>fetch(type,"/api/v1/media/audioListAutoUpdateRule",obj)

//更新歌曲、歌单链接
const  songurl =(type='GET',obj={})=>fetch(type,"/api/v1/media/updateAudioUrl",obj)
const  songListUrl =(type='GET',obj={})=>fetch(type,"/api/v1/media/updateAudioListUrl",obj)

//获取青牛token
var getToken = ()=>fetch("get","http://121.40.68.137:15000/api/v1/insurance/uploadToken",{})
export {apiSongSheet,getToken,delQiniu,apiAudio,yunAudio,xmAudio, moveAudio, 
	apiHome,localAudio, getAudios, jieMuApi, keywordsMapping, browse, songurl, songListUrl}
