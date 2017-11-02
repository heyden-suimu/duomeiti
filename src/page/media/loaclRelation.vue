 <template>
    <div class="container localRelation">
        <el-row>{{`映射列表`}}</el-row>
        <div class="doSome"> 
            <el-button @click="someDelete">批量删除</el-button>
        </div>
        <div class="head_dialog">
            <el-button @click="addSheet"><i class="el-icon-plus"></i>创建新映射</el-button>
            <el-input icon="search" placeholder='搜索歌单' v-model = 'serchInput' :on-icon-click="listSearch"></el-input>
            <el-select v-model="type" placeholder="歌单" @change="listSearch">
                <el-option
                  v-for="item in types"
                  :key="item.code"
                  :label="item.value"
                  :value="item.code">
                </el-option>
            </el-select>
        </div>
        <com-list :spreadFormat='rule' :spreadList='test' :headTitle="headTitle" :pageTion='pageTion' :spreadType="false"></com-list>
         <el-dialog title="映射" :visible.sync="addMapping">
            <div class="key">
                <span>关键字：</span>
                <span>
                   <el-input v-model='keyWord'></el-input>
                </span>
                 <el-input icon="search" placeholder='搜索歌单' v-model = 'serchInput' :on-icon-click="listSearch" @keyup.enter.native="listSearch" class= "search"></el-input>
            </div>
            <com-list :spreadList="songSheets" :headTitle="headTitle1" :spreadFormat='rule1' :handle='sendFile' :pageTion="pageTionLog" :secShow="true"></com-list>
        </el-dialog>
    </div>
</template>
    
<script>
    import comList from "./comList"
    import {layer, searh} from '../../components/common/common'
    import {apiSongSheet, keywordsMapping} from "../../service/getData"
    import {mapActions} from 'vuex'
    export default {
    	data(){
            return{
                type:0,
                type2:1,
                sheets:null,
                headTitle:[{title:'全选',span:1}, {title:'序号',span:3},{title:'关键字',span:3},{title:'歌单名称',span:2}, {title:'类型',span:4}, {title:'操作',span:4}],
                test:null,
                dialogFormVisible:false, 
                types:[{value:'全部',code:0},{value:'歌单',code:1},{value:'节目',code:2}],
                types2:[{value:'音乐',code:1},{value:'节目',code:2}],
                headTitle1:[{title:'全选',span:2},{title:'序号',span:1},{title:'歌单',span:4},{title:'类型',span:4},{title:'描述',span:4}],
                rule1:{},
                rule:{
                    text:[{name:"index",span:1},{name:"key",span:1}, {name:"targetName",span:4}, {name:"type",span:4}]
                },
                serchInput:'',
                copyTest:{},
                sheetTotal:0,
                dialogTableVisible:false,
                addMapping:false,
                keyWord:'',
                mtName:'',
                songSheets:[],
                buntype:1,
            }
        },
        mounted(){        
            this.init()
            this.$on('pageNation',this.init)
            this.$on('pageNation1',this.initSongs)
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
                this.rule1.text = [{name:"index",span:1}, {name:"name",span:4}, {name:"type",span:4}, {name:'description',span:1}];
                this.rule.icons = [{icon:'el-icon-heyden-icon_setting',method:this.edit},{icon:'el-icon-heyden-icon_delete_fill',method:this.deleteRe}];
            },
            async init(start=0,count=10,page=1){
                let data = await keywordsMapping();
                if(data.code  == 0){
                    this.test = data.res;
                    this.copyTest = data.res;
                    this.pageTion= {total:data.res.totalCount,currentSize:count,currentPage:page,show:true};
                    if(this.test.length<1) this.pageTion.show = false;
                }
                
            },
            async initSongs(start=0,count=10,page=1){
                let res = await apiSongSheet('get',{start:start,count:count});
                if(res.code  == 0){
                    this.songSheets = res.res.audioLists;
                    this.pageTionLog ={total:res.res.totalCount,currentSize:count,currentPage:page,show:true}
                }else{
                    layer(this,this.message)
                }            
            },
            addSheet(){
                this.addMapping = true;
                this.initSongs();
            },
            async deleteRe(row,resovle,reject){
                this.$confirm('是否删除该歌单？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(async () => {
                    let data = await keywordsMapping ('delete', {keywordsMappingId:row.keywordsMappingId});
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
                 this.$confirm(`是否${row.status?'禁用':'启用'}该映射`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(async () => {
                    let data = await keywordsMapping('put',{
                      "keywordsMappingId": row.keywordsMappingId,
                      "status": !row.status
                    })
                    if(data.code == 0){
                        layer(this, "配置成功",'success')
                    }else{
                        layer(this, data.message)
                    }
                }).catch((err) => {
                      reject('error')      
                });
            },
            async localDown(data){
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
            },
            async sendFile(data){   
               if(!this.keyWord) {
                 layer(this,'请填入关键字')
                 return
               }
               let obj = {
                      "key": this.keyWord,
                      "targetName": data.name,
                      "targetId": data.audioListId,
                      "status": true,
                      "type": data.type
                    }
                let res = await keywordsMapping('post', obj);
                if(res.code == 0){
                    layer(this,'新建成功','success');
                    this.addMapping = false
                    resovle('success')
                }else{
                    layer(this,res.message)
                }
            },
        },
        destroyed(){
            this.$store.state.currentSize = 10
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

        .el-dialog{
            .key{
                .el-input{
                    width: 20%;
                }
                .search{
                    width: 40%;
                    margin-left: 5%;
                }
            }
        }

    }
</style>
