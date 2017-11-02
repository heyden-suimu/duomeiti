 <template>
    <div class="container">
        <el-row :sapn="24">
          <el-col :span="2">
              版本信息
          </el-col>
          <el-col :span="4">
              <el-input v-model="searchtext" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :span="2">
              发布日期
          </el-col>
            <el-col :span="5">
                <el-date-picker
                  v-model="value1"
                  type="date"
                  placeholder="选择日期"
                  >
                </el-date-picker>
          </el-col>
          <el-col :span="2">
              <el-button type="primary" @click="search(searchtext,value1)">搜索</el-button>
          </el-col>
        </el-row>
        <el-table
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="40">
        </el-table-column>
        <el-table-column
          prop="name"
          label="版本名称"
          sortable
          width="120">
        </el-table-column>
        <el-table-column
          prop='version'
          label="版本号"
          sortable
          width="100">
        </el-table-column>
        <el-table-column
          prop='type'
          label="升级类型"
          sortable
          width="120">
        </el-table-column>
        <el-table-column
          label="黑白名单"
          width="100">
          <template scope="scope" >
               <el-popover
                  ref="popover2"
                  placement="right"
                  :title="scope.row.userlist+'名单'"
                  width="600"
                  trigger="click"
                  @show="user_Text(scope.$index)"
                  :content="userText"
                  popper-class="serdes"
                  >                 
              </el-popover>
              <el-button type="text" size="small" style="color:#ccc" v-popover:popover2>
                  {{scope.row.userlist}}
              </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="configuration.updateMode"
          label="增量类型"
          width="95">
        </el-table-column>
        <el-table-column
          prop="configuration.forceMode"
          label="强制开关"
          width="95">
        </el-table-column>
        <el-table-column
          prop="configuration.offTime"
          label="熄火时间"
          sortable
          width="120">
        </el-table-column>
        <el-table-column
          label="版本描述"
          width="95">
          <template scope="scope" >
               <el-popover
                  ref="popover2"
                  placement="right"
                  title="版本描述"
                  width="800"
                  trigger="click"
                  :content="scope.row.description"
                  popper-class="serdes">                 
              </el-popover>
              <el-button type="text" size="small" style="color:#ccc" v-popover:popover2>
              查看
              </el-button>
          </template>

        </el-table-column>
        <el-table-column
          prop="available"
          label="是否发布"
          width="95"
          class-name="description">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="140">
          <template scope="scope">
            <el-button @click="handleClick(scope.row.id,'read')" type="text" size="small">查看</el-button>
            <el-button type="text" size="small" @click="handleClick(scope.row.id,'edit')">编辑</el-button>
            <el-button type="text" size="small" @click.native.prevent="open(scope.$index,tableData,scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>
    
<script>
    import {getVerlist,deleteVer} from "../../service/getData"
    export default {
    	data(){
            return{
                searchtext: '',
                value1:"",
                userText:"",
                tableData: [],
                multipleSelection: [],
                userlist:"",
                date:''
            }
        },
        mounted(){
            
        },
        
        created(){
            this.get_Verlist()
        },
        compontents:{
            
        },
        props: ['alertText'],
        methods: {
            handleClick(id,type) {
                this.$router.push("addVer?id="+id+"&type="+type)
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            deleteRow(index, rows) {
                rows.splice(index, 1);
            },
            async get_Verlist(){
                var data =await getVerlist();
                this.tableData = data.res.otas;
                var getform = data.res.otas;
                for(var i=0,len=getform.length;i<len;i++){
                    if(getform[i].available==true){
                        this.tableData[i].available = "已发布"
                    }else{
                        this.tableData[i].available = "未发布"
                    }
                    if(getform[i].type == "patch"){
                        this.tableData[i].configuration.updateMode = "--"
                    }else if(getform[i].configuration.updateMode == "full"){
                        this.tableData[i].configuration.updateMode = "全量"
                    }else if(getform[i].configuration.updateMode == "incremental"){
                        this.tableData[i].configuration.updateMode = "增量"
                    }
                    if(getform[i].configuration.forceMode&&getform[i].type!="mobileApp"){
                        this.tableData[i].configuration.forceMode = "开"
                    }else if(!getform[i].configuration.forceMode&&getform[i].type!="mobileApp"){
                        this.tableData[i].configuration.forceMode = "关"
                    }else{
                        this.tableData[i].configuration.forceMode = "--"
                    }
                    if(!getform[i].constraint){
                        break;
                    }
                    if(getform[i].constraint.hasOwnProperty("blackList")){
                        this.tableData[i].userlist = "黑"
                    }else if(getform[i].constraint.hasOwnProperty("whiteList")){
                        this.tableData[i].userlist = "白"
                    }else{
                        this.tableData[i].userlist = "--"
                    }   
                }
                this.$store.state.verList = data.res.otas;
            },
            search(text,date){
                var arr = JSON.parse(JSON.stringify(this.$store.state.verList));
                console.log(this.$store.state.verList)
                for(var i = 0;i<arr.length;i++){
                    if((arr[i].version.indexOf(text) == -1)||(this.date.indexOf(date) == -1)){
                        arr.splice(i,1);
                        i--;                        
                    }
                }
                this.tableData = arr;
                console.log(arr)
                console.log(this.tableData)
            },
            open(index,tableData,id) {
                this.$confirm('此操作将删除该版本记录, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  tableData.splice(index,1);
                  deleteVer(id).then((msg)=>{
                    this.$message({
                        type: 'success',
                        message: msg.message,
                    });
                  });
                  
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });          
                });
            },
            showUser(text){
                console.log(text)
            },
            user_Text(i){
                 if(this.tableData[i].constraint.hasOwnProperty("blackList")){
                        this.userText = this.tableData[i].constraint.blackList
                    }else if(this.tableData[i].constraint.hasOwnProperty("whiteList")){
                        this.userText = this.tableData.constraint.whiteList
                    }else{
                        this.userText = ""
                    }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
	.container{
        .el-row{
            background:#D3DCE6;
            margin-bottom: 20px;
            height: 60px;
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
            .el-col:nth-child(3){
                text-align: right;
                margin-left: -.1rem;
                margin-right: .08rem;
            }
            .el-col:nth-child(5){
                margin-left: 2%;
            }
        }
        .el-table{
            .el-table-column{
                height: 40px;
                overflow: hidden;
            }          
        }
    }
</style>
