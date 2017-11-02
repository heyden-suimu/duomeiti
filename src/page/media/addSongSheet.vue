 <template>
    <div class="container songSheet">
        <el-row>
          <el-col :span="2"><span>歌单名称</span></el-col>
          <el-col :span="6"><el-input v-model="songSheet.name"></el-input></el-col>
        </el-row>
        <el-row>
          <el-col :span="2"><span>歌单类型</span></el-col>
          <el-col :span="6">
               <el-radio-group v-model="type">
                  <el-radio label="音乐" ></el-radio>
                  <el-radio label="节目"></el-radio>
                </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2"><span>上传logo</span></el-col>
          <el-col :span="12">
                <el-upload
                  action="http://up-z2.qiniu.com/"
                  list-type="picture-card"
                  :data="uploddata"
                  :before-upload="setToken"
                  :on-success="handlePictureCardPreview"
                  :file-list="fileList"
                  :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog v-model="dialogVisible" size="tiny">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2"><span>标签</span></el-col>
          <el-col :span="3" v-for ='(item,index) in ItemsStar' ><el-input :placeholder='`标签${index+1}`' v-model='songSheet.tags[index]'></el-input></el-col>
          <el-col :span="3"><span class="el-icon-plus" @click="addRelation('ItemsStar')"></span></el-col>
        </el-row>
        <el-row>
          <el-col :span="2"><span>过期时间</span></el-col>
          <el-col :span="6">
            <el-date-picker
            v-model="dateTime"
            type="datetimerange"
            placeholder="选择日期"
            :picker-options="pickerOptions0">
            </el-date-picker>
         </el-col>
        </el-row>
        <el-row v-if='false'>
          <el-col :span="2"><span>更新时间</span></el-col>
          <el-col :span="6">
            
         </el-col>
        </el-row>
        <el-row>
            <el-col :span="2"><span>歌单描述</span></el-col>
            <el-col :span="9">
                <el-input type="textarea" v-model="songSheet.description"></el-input>
            </el-col>
        </el-row>   
        <div class="songs">
            <com-list v-if = "add"></com-list>
        </div>
        <div class="foot">
            <el-button @click="submit">提交</el-button>
            <el-button @click="$router.go(-1)" class='cancel'>取消</el-button>  
        </div>     
    </div>
</template>
    
<script>
    import comList from "./comList"
    import {apiSongSheet, getToken, delQiniu} from "../../service/getData"
    import {qnUrl} from "../../service/data"
    import {layer} from '../../components/common/common'
    export default {
    	data(){
            return{
                ItemsRelation:[3,2,2],
                ItemsStar:[3,3,3],
                dialogImageUrl:'',
                type:'音乐',
                add:false,
                dateTime:[],
                fileList:[],
                pickerOptions0: {
                  disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                  }
                },
                dialogVisible:false,
                uploddata:'',
                photos:[],
                songSheet:{
                  "tags": [],              
                  "creator": "",
                  "name": "",
                  "iconUrl": "",
                  "description": "",
                  "type": 1,
                  "startTime": 0,
                  "endTime": 0
                }
            }
        },
        mounted(){
            
        },
        created(){
            this.$on("moveMedia",function(move){
                this.dialogFormVisible = move;
            });
            this.init();    
        },
        components:{
            comList
        },
        props: ['alertText'],
        methods: {
            async init(){
                if(!this.$route.query.row) return;
                let songSheet = JSON.parse(this.$route.query.row);
                this.songSheet.audioListId = '';
                Object.assign(this.songSheet,songSheet)
                this.type = this.songSheet.type == 1?'音乐':'节目';
                songSheet.tags&&songSheet.tags.map((item,index)=>{         
                    this.songSheet.tags[index] = item.name;
                })
                this.dateTime[0] = this.songSheet.startTime&& new Date(this.songSheet.startTime);
                this.dateTime[1] = this.songSheet.startTime&& new Date(this.songSheet.endTime);
                this.dialogImageUrl = this.songSheet.iconUrl;
                this.fileList.push({url:this.songSheet.iconUrl});
            },
            getType(){
                
            },  
            search(){
                this.$router.push('result')
            },
            addRelation(name){
                this[name].push(3)
            },
            async submit(){
                if(!this.songSheet.name){
                    layer(this,'歌单名称不能为空')
                    return
                }
                if(!this.songSheet.description){
                    layer(this,'歌单描述不能为空')
                    return
                }
                this.songSheet.startTime = this.dateTime[0]&&this.dateTime[0].getTime();
                this.songSheet.endTime = this.dateTime[1]&&this.dateTime[1].getTime();
                this.songSheet.type = this.type == '音乐'?1:2;
                this.songSheet.iconUrl = this.dialogImageUrl;
                this.songSheet.creator = 'admin';
                let type = !this.$route.query.row?'post':'put';
                let data = await apiSongSheet(type, this.songSheet);
                if(data.code == 0){
                    let msg = !this.$route.query.row?'添加成功':'修改成功'
                    layer(this, msg, 'success')
                    this.$router.push("songSheet");
                }else{
                    layer(this,data.msg)
                }
            },
            handlePictureCardPreview(res,file) {
                this.dialogImageUrl = qnUrl+res.hash;
                this.photos.push(this.dialogImageUrl);
            },
            layer(msg,type='error'){
                this.$message({
                    type:type,
                    message:msg
                })
            },
            async setToken(){
                let data = await getToken();
                this.uploddata = {
                    token:data.res
                }
            },
            async handleRemove(){
                // if(!this.fileList[0]) return
                // let token = await getToken();
                // token = token.res;
                // let obj = {
                //     token:token,
                //     EncodedEntryURI:this.fileList[0].url
                // }
                // let data = await delQiniu('post', obj)
                this.dialogImageUrl = this.fileList&&this.fileList[this.fileList.length-1]
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
	.container{
        position: absolute;
        top:0;
        left: 0;
        right: 0;
        font-size: 14px;
        overflow-y: scroll;
        >.el-row{
            // background:#D3DCE6;
            margin-left: 10%;
            padding: .1rem 0; 
        }
        .songs{
            position: relative;
            top:.2rem;
        }
        .foot{
            position: fixed;
            right: 0;
            bottom: 0;
            left: 15.2%;
            background: #ccc;
            text-align: center;
            .el-button{
                background: #ED4A4B;
                color: white;
                padding: .1rem .3rem;
                margin-right: .3rem;
            }
            .cancel{
                background: white;
                color: black;
            }
        }
    }
</style>
