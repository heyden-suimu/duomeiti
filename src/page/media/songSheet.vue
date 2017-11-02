 <template>
    <div class="container songSheet">
        <div v-if='!showTime'>
            <div class="doSome"> 
                <el-button @click="someDelete">批量删除</el-button>
            </div>
            <el-row>{{`歌单列表`}}</el-row>
            <div class="head_dialog">
                <el-button @click="addSheet" style="color:#20a0ff"><i class="el-icon-plus"></i>创建新歌单</el-button>
                <el-input icon="search" placeholder='搜索歌单' v-model = 'serchInput' :on-icon-click="listSearch" @keyup.enter.native="listSearch"></el-input>
                <el-select v-model="type" placeholder="歌单" @change="listSearch">
                    <el-option
                      v-for="item in types"
                      :key="item.code"
                      :label="item.value"
                      :value="item.code">
                    </el-option>
                </el-select>
            </div>
            <com-list :spreadFormat='rule' :spreadList='test' :headTitle="headTitle" :handle="readSheet" :pageTion='pageTion' ref='songSheet'></com-list>
        </div>
        <div class="editTime" v-if="showTime">
            <el-row>节目列表</el-row>
            <div class="el-icon-arrow-left back" @click="back">返回</div>
            <com-list :spreadFormat='ruleTime' :spreadList='testTime' :headTitle="headTitleTime" :handle="upTime" :pageTion='{show:false}' ></com-list>
            <el-dialog :title="Time_name" :visible.sync="dialogTableVisible">
                <div class="nameT">

                </div>
                <div>
                    <span>时间点：</span>
                    <span>
                        <el-time-select
                          v-model="upTimeValue"
                          :picker-options="{
                            start: '00:00',
                            step: '01:00',
                            end: '24:00'
                          }"
                          placeholder="选择时间">
                        </el-time-select>
                    </span>
                </div>
                <div>
                    <span>频率：</span>
                    <span>
                        <el-select v-model="upTimeDate" placeholder="默认每周一">
                            <el-option
                              v-for="item in upTimeDateList"
                              :key="item.code"
                              :label="item.value"
                              :value="item.code">
                            </el-option>
                          </el-select>
                    </span>
                </div>
                <div class="submit"><el-button @click='subTime'>提交</el-button></div>
            </el-dialog>
        </div>
    </div>
</template>
    
<script>
    import comList from "./comList"
    import {layer, searh} from '../../components/common/common'
    import {apiSongSheet, jieMuApi, songListUrl} from "../../service/getData"
    import {mapActions} from 'vuex'
    export default {
    	data(){
            let types1 = [{value:'歌单',},{value:'歌曲'},{value:'节目'}];
            let detaileds = [{key:'name', value:'歌名'},{key:'name', value:'歌名'}]
            return{
                type:0,
                sheets:null,
                headTitle:[{title:'全选',span:1}, {title:'歌单序号',span:3},{title:'名称',span:3},{title:'类型',span:2}, {title:'标签',span:4},{title:'描述',span:4}, {title:'操作',span:8}],
                test:null,
                dialogFormVisible:false, 
                types:[{value:'全部',code:0},{value:'歌单',code:1},{value:'节目',code:2}],
                rule:{},
                serchInput:'',
                copyTest:{},
                sheetTotal:0,
                ruleTime:{},
                testTime:[],
                headTitleTime:'',
                showTime:false,
                upTimeValue:'',
                upTimeDateList:[{value:'每天',code:0},{value:'周一',code:1},{value:'周二',code:2},{value:'周三',code:3},{value:'周四',code:4},{value:'周五',code:5},{value:'周六',code:6},{value:'周日',code:7}],
                upTimeDate:1,
                dialogTableVisible:false,
                Time_name:'',
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
                this.rule.text = [{name:"index",span:1}, {name:"name",span:4}, {name:"type",span:4}, {name:"tags",span:4}, {name:"description",span:8}];
                this.rule.icons = [];
                let makeCoin = [{icon:'el-icon-heyden-icon_download',method:this.localDown},{icon:'el-icon-heyden-refresh',method:this.refresh},{icon:'el-icon-heyden-dianping',method:this.edit},{icon:'el-icon-heyden-gengxinshijian',method:this.editTm},{icon:'el-icon-heyden-icon_delete_fill',method:this.deleteSheet, type:'delete'}]
                makeCoin.map((value)=>{
                    this.rule.icons.push({icon : value.icon, method:value.method});
                }) 
            },
            async init(start=0,count=10,page=1){
                let data = await apiSongSheet('get',{start:start,count:count});
                if(data.code  == 0){
                    this.test = data.res.audioLists;
                    this.copyTest = data.res.audioLists;
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
                if(!row.audioListId) return;
                this.$confirm('是否删除该歌单？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(async () => {
                    let data = await apiSongSheet('delete', {audioListId:row.audioListId});
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
                    localization : true,
                })
                if(res.code == 0){
                    layer(this, "已开始本地化",'success')
                }else{
                    layer(this, res.message)
                }
            },
            listSearch(){
                let searchList = new searh({
                    destArr: this.copyTest, 
                    searhArr:[{name:'name', value:this.serchInput},{name:'type',value:this.type}]
                });
             this.test =  searchList.getMultFilter()  
                this.pageTion.show = !!!this.serchInput
            },
            async someDelete(){
                this.$confirm(`是否删除选中歌单？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    this.$refs.songSheet.checkArr.map(async (item,index)=>{
                        if(item){
                            let data = await apiSongSheet('delete', {audioListId:this.test[index].audioListId});
                            if(data.code == 0){
                                layer(this,'删除成功','success');
                            }else{
                                layer(this,data.message)
                            }
                        }
                        if(index == this.$refs.songSheet.checkArr.length-1) this.init() 
                    })
                }).catch((err) => {
                      reject('error')      
                });
            },
            editTm(data){
                if(!data.audioListAutoUpdateRule||data.audioListAutoUpdateRule.length<1) {
                    layer(this,'该歌单没有节目')
                    return
                }
                this.showTime = true;
                this.headTitleTime = [{title:'全选',span:1}, {title:'节目序号',span:3},{title:'名称',span:3},{title:'类型',span:2}, {title:'操作',span:8}];
                this.ruleTime.text = [{name:"index",span:1}, {name:"name",span:4}, {name:"type",span:4}];
                this.ruleTime.icons = [{icon:'el-icon-heyden-dianping',method:this.upTime}];
                this.testTime = data.audioListAutoUpdateRule;
            },
            upTime(data){
                this.dialogTableVisible = true;
                this.Time_name = data.name;
                this.audioListAutoUpdateRuleId = data.audioListAutoUpdateRuleId
            },
            back(){
                this.showTime =false;
            },
            async subTime(){
                if(!this.upTimeValue){
                    layer(this, '请选择时间点')
                    return
                }
                let obj = {
                      "audioListAutoUpdateRuleId": this.audioListAutoUpdateRuleId,
                      "time": this.upTimeValue,
                      "dayOfWeek": this.upTimeDate
                    }
                let data = await jieMuApi('put', obj);
                if(data.code == 0){
                    layer(this,'设置成功','success');
                    this.dialogTableVisible = false;
                }else{
                    layer(this,data.message)
                }
            },
            async refresh(data){
                if(data.type != 1) {
                    layer(this, "只能更新音乐") 
                    return
                }
                let res = await songListUrl('get',{audioListId : data.audioListId})
                if(res.code == 0){
                    layer(this, "更新成功",'success')
                }else{
                    layer(this, res.message)
                }
            }
        },
        destroyed(){
            this.$store.state.currentSize = 10;
        },
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
        i.el-icon-search{
            background: #ccc!important;
            color: white;
            border-radius: 3px;
        }
        .back{
            position: absolute;
            top: .24rem;
            left: .2rem;
            font-size: 16px;
        }
        .editTime{
            .el-dialog{
                div{
                    margin-bottom: .1rem;
                    width: 58%;
                    text-align: right;
                }
                div.nameT{
                    text-align: left;
                    margin-top: -.1rem;
                    margin-bottom: .3rem;
                }
                div.submit{
                    width: 100%;
                    text-align: center;
                    .el-button{
                        padding: .1rem .4rem;
                        margin-top: .2rem;
                        background: #ED4A4B;
                        color: white;
                    }
                }
            }

        }
    }
</style>
