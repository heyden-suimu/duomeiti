 <template>
    <div class="container result">
        <div class="doSome"> 
            <el-button @click="someDelete">批量删除</el-button>
            <el-button @click="someDelete">批量移动</el-button>
        </div>
        <el-row>{{`${type}列表`}}</el-row>
        <div class="el-icon-arrow-left back" @click="back">返回</div>
        <el-dialog title="" :visible.sync="dialogFormVisible" size="small">
            <div class="head_dialog">
                <span @click="moveNew(false)" v-if='addNew'><i class="el-icon-plus"></i>移动到新歌单</span>
                <span v-if='!addNew'><el-input placeholder="请输入歌单名称" v-model="newName"></el-input><span class="el-icon-heyden-icon_checkbox_fill" style="font-size:24px;margin-left:.4rem;" @click="addNewMove"></span><span class="el-icon-heyden-icon_roundclose_fill" @click="moveNew(true)" style="font-size:24px;margin-left:.4rem;"></span></span>
                <el-input icon="search" placeholder='搜索歌单' v-model = 'serchInput' :on-icon-click="listSearch" @keyup.enter.native="listSearch" v-if='addNew'></el-input>
            </div>
             
            <com-list :spreadList="songSheets" :headTitle="headTitle1" :spreadFormat='rule1' :handle='sendFile' :pageTion="pageTionLog" :secShow="true"></com-list>
        </el-dialog>
        <com-list 
        :spreadList="spreadList" 
        :headTitle="headTitle" 
        :spreadFormat='rule'
        :pageTion="pageTion"
        :handle="sheetList"
        ></com-list> 
        <div id='music' v-if="showMusicPlayer">
            <span class="el-icon-heyden-icon_roundclose_fill" @click='pauseMusic'></span>
            <Audio :src="musicSrc" controls   autoplay id="Music"></Audio>
        </div>
    </div>
</template>
    
<script>
    import comList from "./comList"
    import {apiSongSheet, getToken, localAudio, moveAudio, jieMuApi, browse} from "../../service/getData"
    import {layer, searh} from '../../components/common/common'
    export default {
    	data(){
            let types1 = [{value:'歌单'},{value:'歌曲'},{value:'节目'}];
            return{
                source:'本地',
                type:'资源',
                headTitle:[{title:'全选',span:1}, {title:'序号',span:1},{title:'音频信息',span:4},{title:'类型',span:4},{title:'操作',span:4}],
                headTitle1:[{title:'全选',span:2},{title:'序号',span:1},{title:'歌单',span:4},{title:'类型',span:4},{title:'描述',span:4}],
                has_updateTime:true,
                updataTime:[1],
                dialogFormVisible:false, 
                sources:[{value:'本地'},{value:'网易云'},{value:'1'},{value:'2'}],
                types:[{value:'歌单'},{value:'节目'}],
                audioList:"",
                rule:{},
                rule1:{},
                audioId:'',
                songSheets:null,
                row:{},
                showMusicPlayer:false,
                spreadList:[],
                showSheet:false,
                addNew:true,
                newName:''
            }
        },
        mounted(){
            
        },
        created(){
            this.$on("moveMedia",function(move){
                this.dialogFormVisible = move;
            });
            this.spreadList = this.$store.state.audioResult
            this.init();
            this.$on('pageNation', this.initList)
            this.$on('pageNation1', this.initSongs)
        },
        components:{
            comList
        },
        props: ['alertText'],
        methods: {
            init(){
               this.getRule()
               this.rule1 = JSON.parse(JSON.stringify(this.rule));
               this.rule1.text.push({name:'description',span:1})
               this.copyText = this.spreadList.concat([])
               this.rule1.icons = [];
               this.initList();
            },
            initList(start=0,count=10,page=1){
                this.spreadList =  this.copyText.slice(start,start+count);
                this.pageTion = {total:this.copyText.length,currentSize:count,currentPage:page,show:true};
                if(this.spreadList.length<1) this.pageTion.show = false;
            },
            getRule(){
                this.rule.text = [{name:"index",span:1}, {name:"name",span:4}, {name:"type",span:4}];
                this.rule.icons = [];

                let makeCoin = [{icon:'el-icon-heyden-icon_download',method:this.edit},{icon:'el-icon-heyden-yinlebofang',method:this.player},{icon:'el-icon-d-arrow-right', method:this.readyFile}]

                makeCoin.map((value)=>{
                    this.rule.icons.push({icon : value.icon, method:value.method});
                }) 
            },
            getType(){
                
            },  
            search(){
                this.$router.push('result')
            },
            back(){
                if(this.showSheet){
                    this.spreadList = this.$store.state.audioResult;
                    this.copyText = this.spreadList.concat([])
                    this.initList()
                    this.showSheet =false;
                }else{
                    this.$router.go(-1)
                } 
            },
            edit(){

            },
            async readyFile(data){
                 this.row = data;
                 this.$on('pageNation1', this.initSongs)
                 if(data.hasOwnProperty('audioId')){
                    this.initSongs(data);
                    this.dialogFormVisible = true;
                    return;
                }
                 this.$confirm(`是否本地化并移动该音频？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    this.localMt()
                }).catch((err) => {
                    reject('error')      
                });
            },
            async initSongs(start=0,count=10,page=1){
                let res = await apiSongSheet('get',{start:start,count:count});
                if(res.code  == 0){
                    this.songSheets = res.res.audioLists;
                    this.copyTest = res.res.audioLists;
                    this.pageTionLog ={total:res.res.totalCount,currentSize:count,currentPage:page,show:true}
                }else{
                    layer(this,this.message)
                }            
            },
            async localMt(){
                this.initSongs();
                let local;
                let obj = {
                  "sourceId": "string",
                  "name": "string",
                  "albumId": "string",
                  "albumName": "string",
                  "iconUrl": "string",
                  "fileUrl": "string",
                  "description": "string",
                  "artistName": "string",
                  "singer": "string",
                  "size": 0,
                  "length": 0,
                  "source": "admin",
                  "type": 0,
                  "localization": false
                }
                obj = Object.assign(obj, this.row);
                local = await localAudio('post',obj)
                if(local.code == 0){
                    this.row.audioId = local.res.audioId;
                    this.dialogFormVisible = true;
                }else if(local.code = -1108){
                     this.row.audioId = local.audioId;
                     this.dialogFormVisible = true;
                }else{
                    layer(this,local.ch)
                }
            },
            async sendFile(data){
                let res;
                if(this.row.type == 1){
                    let obj = {
                        audioId:this.row.audioId,
                        audioListId:data.audioListId
                    }
                    res = await moveAudio('post',obj)
                }else{
                    let obj = {
                      "audioListId": data.audioListId,
                      "sourceId": this.row.sourceId,
                      "source": this.row.source||'ximalaya',
                      localization:false,
                      count:0,
                      name:this.row.name,
                      iconUrl:this.row.iconUrl
                    }
                    res = await jieMuApi('post',obj)
                }
                if(res.code == 0){
                    layer(this,"已添加到歌单",'success')
                    this.dialogFormVisible = false;
                }else{
                   layer(this,res.ch)
                }
            },
            player(data){
                this.showMusicPlayer = true;
                this.musicSrc = data.fileUrl; 
            },
            async sheetList(data){
                if(data.type == 1) return
                let res = await browse('get',{sourceId :data.sourceId})
                if(res.code  == 0){
                    this.spreadList = res.res.browses;
                    this.copyText = res.res.browses;
                    this.initList()
                    this.showSheet = true;
                }else{
                    layer(this,this.message)
                }
            },
            pauseMusic(){
                let mus = document.getElementById('Music');
                mus.pause();
                this.showMusicPlayer = false;
            },
            listSearch(){
                let searchList = new searh({
                    destArr: this.copyTest, 
                    searhArr:[{name:'name', value:this.serchInput}]
                });
                this.songSheets =  searchList.getMultFilter()  
                this.pageTion.show = !!!this.serchInput
            },
            moveNew(bol){
                this.addNew = bol;
            },
            async addNewMove(){
                let songSheet;
                if(!this.newName){
                    layer(this,'歌单名称不能为空')
                    return;
                }
                let data = await apiSongSheet('post', {
                    name:this.newName,
                    // description:'移入新歌单',
                    creator:'admin',
                    type:this.row.type,
                });
                if(data.code == 0){
                    songSheet = data.audioListId;
                }else{
                    layer(this,data.message)
                }
                let res;
                if(this.row.type == 1){
                    let obj = {
                        audioId:this.row.audioId,
                        audioListId:songSheet
                    }
                    res = await moveAudio('post',obj)
                }else{
                    let obj = {
                      "audioListId":songSheet,
                      "sourceId": this.row.sourceId,
                      "source": this.row.source||'ximalaya',
                      localization:false,
                      count:0,
                      name:this.row.name,
                      iconUrl:this.row.iconUrl
                    }
                    res = await jieMuApi('post',obj)
                }
                if(res.code == 0){
                    layer(this,"已添加到新建歌单",'success')
                    this.dialogFormVisible = false;
                }else{
                    console.log(res)
                   layer(this,res.ch||res.message||res.msg.message||res.msg[0].message)
                   debugger
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
	.result{
        font-size: 14px;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top:0;
        .back{
            position: absolute;
            top: .24rem;
            left: .2rem;
            font-size: 16px;
        }
        .el-row{
            // background:#D3DCE6;

            margin-bottom: 10px;
            height: 60px;
            text-align: center;
            font-size: 16px;
            line-height: 60px;
            border-radius: 4px;
            padding-left: 3%;
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
        .el-dialog{
            width: 20%;
            .head_dialog{
                margin-left: 6%;
                .el-input{
                    width:25%;
                    margin-left: 8%;      
                }
            }
            .updateTime{
                .el-select{
                    width: 15%;
                }
            }
        }
        #music{
            position: fixed;
            bottom: .1rem;
            left: 35%;
            width: 40%;
            z-index: 9999;
        }
    }
</style>
