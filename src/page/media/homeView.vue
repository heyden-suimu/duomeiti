 <template>
    <div class="container homeView">
        <div class='doSome'>
            <el-button @click="addShow">添加歌单</el-button>
            <el-button @click="subPostion">提交位置</el-button>
            <el-button @click="someDelete">批量删除</el-button>
        </div>
        <el-dialog title="" :visible.sync="dialogFormVisible">
            <el-input icon="search" placeholder='搜索歌单'></el-input>
            <el-select v-model="type" placeholder="歌单">
                <el-option
                  v-for="item in types"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <com-list :spreadList="songSheets" :headTitle="headTitle1" :spreadFormat='rule1' :handle='addHome'></com-list>
        </el-dialog>
        <div class="view">
            <!-- <el-button @click='dialogFormVisible=true'>预览</el-button> -->
              <el-tabs v-model="activeName" @tab-click="initSongs">
                <el-tab-pane label="音乐" :name="1">
                </el-tab-pane>
                <el-tab-pane label="节目" :name="2">
                </el-tab-pane>
              </el-tabs>                                    
        </div>
        <el-dialog
          :title="homeSet?'启用':'禁用'"
          :visible.sync="dialogVisible"
          size="tiny"
          >
          <span v-if='!homeSet'>是否立即禁用?</span>
          <div v-if="homeSet">
                <span>选择到期时间：</span>
              <el-date-picker
              v-model="endDate"
              type="datetime"
              :picker-options="pickerOptions0"
              placeholder="默认一直开启"
              >
          </el-date-picker>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="homeBun">确 定</el-button>
          </span>
        </el-dialog>
        <com-list :spreadList="homeSong" :headTitle="headTitle" :spreadFormat='rule' handle='' :dragg='true' :pageTion='{show:false}' ref='songSheet'></com-list>
    </div>
</template>
    
<script>
    import comList from "./comList"
    import {apiHome, apiSongSheet} from "../../service/getData"
    import {layer} from '../../components/common/common'
    export default {
    	data(){
            let types1 = [{value:'音乐'},{value:'节目'}];
            return{
                source:'本地',
                activeName:1,
                headTitle:[{title:'全选',span:1}, {title:'歌单序号',span:3},{title:'名称',span:3},{title:'类型',span:2}, {title:'标签',span:4},{title:'描述',span:4}, {title:'操作',span:8}],
                headTitle1:[{title:'全选',span:2},{title:'歌单',span:4},{title:'类型',span:4}],
                type:'全部',
                has_updateTime:true,
                updataTime:[1],
                dialogFormVisible:false, 
                sources:[{value:'本地'},{value:'网易云'},{value:'1'},{value:'2'}],
                types:[{value:'全部'},{value:'歌单'},{value:'节目'}],
                rule:{},
                rule1:{},
                homeSong:null,
                songSheets:'',
                sheetPostion:'',
                sheetId:'',
                dialogVisible:false,
                homeSet:false,
                pickerOptions0: {
                  disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                  }
                },
                endDate:'',
            }
        },
        mounted(){

        },
        created(){
            this.$on("dragged",function(data){
                this.sheetPostion = data[1]&&data[1].index;
                this.sheetId = data[1].item.audioListId;
            });
            this.init()
        },
        components:{
            comList
        },
        props: ['alertText'],
        methods: {
            init(){
                this.getRule();
                this.initSongs();
                this.getRule()
                this.rule1 = JSON.parse(JSON.stringify(this.rule));
                this.rule1.icons = [];
            },
            async initSongs(){
                let data = await apiHome('get',{type:this.activeName})
                if(data.code == 0 ){
                    this.homeSong = data.res;
                }else{
                    layer(this,data.message);
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

            getRule(){
                this.rule.text = [{name:"index",span:1}, {name:"name",span:4}, {name:"type",span:4},{name:"tags",span:4}, {name:"description",span:8}];
                this.rule.icons = [];

                let makeCoin = [{icon:'el-icon-heyden-icon_setting',method:this.edit},{icon:'el-icon-heyden-icon_delete_fill',method:this.deleteView, type:'delete'}]

                makeCoin.map((value)=>{
                    this.rule.icons.push({icon : value.icon, method:value.method});
                }) 
            },

            async addShow(){
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

            async addHome(data){
                let obj = {
                    audioListId:data.audioListId,
                    type:Number(this.activeName),
                }
                debugger
                let res = await apiHome('post',obj)
                this.apiRes(res, "添加成功")
            },

            async deleteView(data){
                 this.$confirm('是否删除该歌单？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(async () => {
                    let  res = await apiHome('delete', {
                        audioListId: data.audioListId,
                    })
                    this.apiRes(res, "删除成功")
                }).catch((err) => {
                      reject('error')      
                }); 
               
            },

            apiRes(res,msg){
                if(res.code == 0){
                    layer(this, msg,'success')
                    this.dialogFormVisible = false;
                    this.initSongs();
                }else{
                    layer(this, res.message)
                }
            },

            async subPostion(){
                let sortArray = [];
                this.homeSong.map((item, index)=>{
                    sortArray.push({audioListId:item.audioListId, index: index, name: item.name})
                })
                let obj = {
                  "type": this.activeName,
                  "sortArray": sortArray
                }
                let res = await apiHome('put', obj) 
                this.apiRes(res,'移动成功')
            },

            edit(row){
                this.endDate = '';
                this.sheetId = row.audioListId;
                let date = new Date();
                this.homeSet = date.getTime()>(row.endTime||99999999999999999);
                this.dialogVisible = true;
            },

            async homeBun(){
                let Time = this.homeSet?this.endDate&&this.endDate.getTime()||99999999999999999:666666
                let data =  await apiSongSheet('put',{
                    audioListId : this.sheetId,
                    endTime : Time
                })
                let msg = this.homeSet?'启用成功':'禁用成功';
                this.apiRes(data, msg)
                this.dialogVisible = false;
            },
            someDelete(){
                this.$confirm('是否删除选中歌单？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    this.$refs.songSheet.checkArr.map(async (item,index)=>{
                        if(item){
                            let data = await apiHome('delete', {audioListId:this.homeSong[index].audioListId});
                            if(data.code == 0){
                                layer(this,'删除成功','success');
                            }else{
                                layer(this,data.message)
                            }
                        }
                        if(index == this.$refs.songSheet.checkArr.length-1) this.initSongs(); 
                    })
                }).catch((err) => {
                      reject('error')      
                });
                
            }
        }
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
        .head_dialog{
            margin-left: 6%;
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
    .homeView{
        .el-carousel__item{
            
        }
        .el-dialog{
            .el-input{
                width: 36%;
                margin-bottom: .2rem;
            }
            .el-select{
                width: 14%;
            }
            .comList{
                padding: 0;
            }
            .el-date-editor{
                    width: 50%;
            }
        }
        .el-tabs{
            width: 30%;
            margin-left: 32%;
            text-align: center;
            margin-bottom: .16rem
        }
    }
</style>
