 <template>
    <div class="container songSheet localSheet">
        <el-row>{{`本地列表`}}</el-row>
        <div class="head_dialog">
            <el-input icon="search" placeholder='搜索歌单' v-model = 'serchInput' :on-icon-click="listSearch"
            @keyup.enter.native="listSearch"></el-input>
            <el-select v-model="type" placeholder="音乐" @change="listSearch">
                <el-option
                  v-for="item in types"
                  :key="item.code"
                  :label="item.value"
                  :value="item.code">
                </el-option>
            </el-select>
        </div>
        <com-list :spreadFormat='rule' :spreadList='test' :headTitle="headTitle" :handle="readSheet" :pageTion='pageTion' ref='songSheet'></com-list>
        <input type="text" id="copyText">
        <div id='music' v-if="showMusicPlayer">
            <span class="el-icon-heyden-icon_roundclose_fill" @click='pauseMusic'></span>
            <Audio :src="musicSrc" controls   autoplay id="Music"></Audio>
        </div>
        <el-dialog title="" :visible.sync="dialogFormVisible">
            <div class="head_dialog">
                <span><i class="el-icon-plus"></i>移动到新歌单</span>
                <el-input></el-input>
            </div>
            <com-list :spreadList="songSheets" :headTitle="headTitle1" :spreadFormat='rule1' :handle='sendFile' :pageTion="{show:true}"></com-list>
        </el-dialog>
    </div>
</template>
    
<script>
    import comList from "./comList"
    import {layer, searh} from '../../components/common/common'
    import {apiSongSheet, apiAudio, songurl} from "../../service/getData"
    import {mapActions} from 'vuex'
    export default {
        data(){
            let types1 = [{value:'歌单'},{value:'歌曲'},{value:'节目'}];
            let detaileds = [{key:'name', value:'歌名'},{key:'name', value:'歌名'}]
            return{
                type:0,
                sheets:null,
                headTitle:[{title:'全选',span:1}, {title:'序号',span:1},{title:'名称',span:4},{title:'类型',span:4}, {title:'时长/分',span:8}, {title:'来源',span:8},{title:'操作',span:4}],
                test:null,
                dialogFormVisible:false, 
                types:[{value:'全部',code:0},{value:'音乐',code:1},{value:'节目',code:2}],
                rule:{},
                serchInput:'',
                copyTest:{},
                showMusicPlayer:false,
                musicSrc:'',
                bunType:'',
                dialogFormVisible:false
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
                this.rule.text = [{name:"index",span:1}, {name:"name",span:4}, {name:"type",span:4}, {name:"Time",span:8}, {name:"source",span:1}];
                this.rule.icons = [];
                let makeCoin = [{icon:'el-icon-heyden-icon_download',method:this.localDown},{icon:'el-icon-heyden-refresh',method:this.refresh},{icon:'el-icon-heyden-fuzhilianjie',method:this.copyUrl},{icon:'el-icon-heyden-yinlebofang',method:this.player},{icon:'el-icon-heyden-icon_setting',method:this.Bun},{icon:'el-icon-d-arrow-right', method:this.readyFile}]
                makeCoin.map((value)=>{
                    this.rule.icons.push({icon : value.icon, method:value.method});
                }) 
            },
            async init(start=0,count=10,page=1){
                let data = await apiAudio('get', {start:start, count:count})
                if(data.code  == 0){
                    this.test = data.res.audios;
                    this.copyTest = data.res.audios;
                    this.pageTion = {total:data.res.totalCount,currentSize:count,currentPage:page,show:true};
                }           
            },
            getType(){
                
            },  
            search(){
                this.$router.push('result')
            },
            addSheet(){
                this.$router.push('addSongSheet')
            },
            async deleteSheet(row,resovle,reject){
                if(!row.audioId) return;
                this.$confirm('是否删除该歌单？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(async () => {
                    let data = await apiAudio('delete', {audioId:row.audioId});
                    if(data.code == 0){
                        layer(this,'删除成功','success');
                        resovle('success')
                    }else{
                        layer(this,data.message)
                    }
                }).catch((err) => {
                      reject('error')      
                }); 
               
            },
            edit(row){
                this.$router.push({path:'addSongSheet',query:{row:JSON.stringify(row)}})
            },
            readSheet(data){
                this.$router.push({path:'musicList', query:{row:JSON.stringify(data)}})
            },
            listSearch(){
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
            copyUrl(data,resolve,reject){
               let el =  document.getElementById('copyText');
               el.value = data.fileUrl;
               el.select();
               document.execCommand("Copy");
               layer(this,'已复制链接', 'success')
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
            Bun(data){
                this.rowList = data;
                this.$confirm(`是否${this.bunType}该音频？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(async() => {
                    let res = await apiAudio('put',{
                        audioId:this.rowList.audioId,
                        status:!this.rowList.status
                    })
                    if(res.code == 0){
                        layer(this,'配置成功','success')   
                    }else{
                        layer(this,res.message)
                    }
                }).catch((err) => {
                      reject('error')      
                });
            },
            async readyFile(data){
                    if(!this.songSheets){
                        let res = await apiSongSheet();
                        if(res.code  == 0){
                            this.songSheets = res.res.audioLists;
                        }else{
                            layer(this,this.message)
                        }
                    }
                    this.dialogFormVisible = true;
            },

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
    }
</style>
