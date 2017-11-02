 <template>
    <div class="container songSheet musicList">
        <el-row>详细列表</el-row>
        <div class="doSome"> 
            <el-button @click="someDelete">批量删除</el-button>
        </div>
        <div></div>
        <div class="head_dialog">
            <el-input icon="search" placeholder='请输入搜索内容' v-model = 'serchInput' :on-icon-click='handleSearch' @keyup.enter.native="handleSearch"></el-input>
            <el-select v-model="type" placeholder="歌单">
                 <el-option
                  v-for="item in types"
                  :key="item.code"
                  :label="item.value"
                  :value="item.code">
                </el-option>
            </el-select>
        </div>
        <el-dialog title="音频信息" :visible.sync="dialogTableVisible" class="musicMes">
          <div v-for="item in detaileds" class="musicmes">
            <span>{{item.name}}:</span>
            <span>{{item.value}}</span>
          </div>
        </el-dialog>
        <com-list :spreadFormat='rule' :spreadList='test' :headTitle="headTitle" :handle="showMusic" :dragg='true' :pageTion='pageTion' ref='songSheet'></com-list>
        <input type="text" id="copyText">
        <div id='music' v-if="showMusicPlayer">
            <span class="el-icon-heyden-icon_roundclose_fill" @click='pauseMusic'></span>
            <Audio :src="musicSrc" controls   autoplay id="Music"></Audio>
        </div>
    </div>
</template>
    
<script>
    import comList from "./comList"
    import {layer, searh} from '../../components/common/common'
    import {apiSongSheet, getAudios, moveAudio, songurl, apiAudio} from "../../service/getData"
    import {mapActions} from 'vuex'
    export default {
    	data(){
            let types1 = [{value:'歌单'},{value:'歌曲'},{value:'节目'}];
            return{
                type:0,
                sheets:null,
                headTitle:[{title:'全选',span:1}, {title:'序号',span:1},{title:'名称',span:4},{title:"歌手",span:2},{title:'类型',span:4}, {title:'时长/分',span:8}, {title:'来源',span:8},{title:'操作',span:4}],
                test:null,
                dialogFormVisible:false, 
                types:[{value:'全部',code:0},{value:'歌单',code:1},{value:'节目',code:2}],
                rule:{},
                rowSheet:{},
                detaileds:[{key:'name',name:'名称'}, {key:'type',name:'类型'},  {key:'fileUrl',name:'文件链接'}, {key:'albumName',name:'专辑名称'},{key:'length',name:'时长'},{key:'source',name:'来源'},{key:'status',name:'是否可用'}],
                dialogTableVisible:false,
                musicSrc:'',
                showMusicPlayer:false,
                copyTest:'',
                serchInput:''
            }
        },
        mounted(){        
            this.init()
            this.$on('pageNation',this.init)
        },
        created(){
            this.getRule()  
        },
        components:{
            comList
        },
        methods: {
            ...mapActions([
                'getSuccess'
                ]),
            getRule(){
                this.rule.text = [{name:"index",span:1}, {name:"name",span:4},{name:'singer', span:2}, {name:"type",span:4}, {name:"Time",span:8}, {name:"source",span:1}];
                this.rule.icons = [];
                let makeCoin = [{icon:'el-icon-heyden-icon_download',method:this.localDown},{icon:'el-icon-heyden-refresh',method:this.refresh},{icon:'el-icon-heyden-fuzhilianjie',method:this.copyUrl},{icon:'el-icon-heyden-yinlebofang',method:this.player},{icon:'el-icon-heyden-icon_setting',method:this.Bun}]
                makeCoin.map((value)=>{
                    this.rule.icons.push({icon : value.icon, method:value.method});
                }) 
            },
            async init(start=0,count=10,page=1){
                this.rowSheet =  JSON.parse(this.$route.query.row)
                let obj= {
                    audioListId : this.rowSheet.audioListId,
                    start:start, 
                    count:count
                }
                let data = await getAudios('get', obj);
                if(data.code  == 0){
                    this.test = data.res.audios;
                    this.copyTest = data.res.audios;
                    this.pageTion = {total:data.res.totalCount,currentSize:count,currentPage:page,show:true};
                }   
            },
            async Bun(data){
                this.$confirm(`是否${data.status?'禁用':'启用'}该音频？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(async() => {
                    let res = await apiAudio('put',{
                        audioId:data.audioId,
                        status:!data.status
                    })

                    if(res.code == 0){
                        layer(this,'配置成功','success')   
                    }else{
                        layer(this,res.message)
                    }
                }).catch((err) => {
                         
                });
            },  
            search(){
                this.$router.push('result')
            },
            addSheet(){
                this.$router.push('addSongSheet')
            },
            async deleteSheet(row,resovle,reject){
                if(!row.audioId) return;
                this.$confirm('是否删除该音频？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(async () => {
                    let data = await moveAudio('delete', {audioListId:this.rowSheet.audioListId, audioId:row.audioId});
                    if(data.code == 0){
                        layer(this,'删除成功','success');
                        resovle('success')
                    }else{
                        layer(this,data.message)
                    }
                }).catch(() => {
                      // reject('error')      
                });               
            },
            edit(row){
                this.$router.push({path:'addSongSheet',query:{row:JSON.stringify(row)}})
            },
            showMusic(data){
                this.dialogTableVisible = true;
                this.detaileds.map((item)=>{
                    item.value = data[item.key]
                })
            },
            copyUrl(data,resolve,reject){
               let el =  document.getElementById('copyText');
               el.value = data.fileUrl;
               el.select();
               document.execCommand("Copy");
               layer(this,'已复制链接', 'success')
            },
            handleSearch(){
                let searchList = new searh({
                    destArr: this.copyTest, 
                    searhArr:[{name:'name', value:this.serchInput},{name:'type',value:this.type}]
                });
                this.test =  searchList.getMultFilter()  
                this.pageTion.show = !!!this.serchInput
            },
            async localDown(data){
                if(data.localization == 1){
                    layer(this,'正在本地化中', 'warning')
                    return
                }
                if(data.localization == 2){
                    layer(this,'已本地下载', 'warning')
                    return
                }
                let res =  await apiSongSheet('put',{
                    audioListId : data.audioListId,
                    localization : 1,
                })
                if(res.code == 0){
                    layer(this, "已开始本地化",'success')
                }else{
                    layer(this, res.message)
                }
            },
            player(data){
                this.showMusicPlayer = true;
                this.musicSrc = data.fileUrl;
            },
            pauseMusic(){
                let mus = document.getElementById('Music');
                mus.pause();
                this.showMusicPlayer = false;
            },
            async refresh(data){
                if(data.type != 1) {
                    layer(this, "只能更新音乐") 
                    return
                }
                let res = await songurl('get',{audioId  :data.audioId})
                if(res.code == 0){
                    layer(this, "更新成功",'success')
                }else{
                    layer(this, res.ch)
                }
            },
            someDelete(){
                this.$confirm(`是否删除选中音频？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    this.$refs.songSheet.checkArr.map(async (item,index)=>{
                        if(item){
                            let data = await moveAudio('delete', {audioListId:this.rowSheet.audioListId, audioId:this.test[index].audioId});
                            if(data.code == 0){
                                layer(this,'删除成功','success');
                            }else{
                                layer(this,data.ch)
                            }
                        }
                        if(index == this.$refs.songSheet.checkArr.length-1) this.init() 
                    })
                }).catch((err) => {
                      reject('error')      
                });
            }
        },
        // destroyed(){
        //     this.Items = null;
        // }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
	.container{
        font-size: 14px;
        .el-row{
            // background:#D3DCE6;
            margin-bottom: 10px;
            height: 60px;
            text-align: center;
            font-size: 16px;
            line-height: 60px;
            border-radius: 4px;
            padding-left: 0%;
            min-width: 900px;
            .el-col{
                text-align: center;
                font-size: 14px;
                color: #48576A;   
            }
            .el-select{
                width: 10%;
            }
            .el-input{
                width: 40%;
                margin-top: .8rem;
                margin-left: 20%;
            }
        }
        .head_dialog{
            margin-left: 2.2%;
            margin-bottom: .16rem;
            .el-button{
                border:none;
                background: none;     
            }
            .el-input{
                width:25%;
                margin-left: 5%;      
            }
            .el-select{
                width: 8%;
                margin-left: 1%;
            }
        }
        .musicMes{
            .musicmes{
                margin-bottom: .1rem;
                span{
                    margin-right: .06rem;
                }
            }
        }
    }
</style>
