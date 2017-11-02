 <template>
    <div class="container">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="ota类型" class="user">
                <el-select v-model="form.type" placeholder="无" id="type" :disabled="hastype">
                  <el-option label="deviceApp" value="deviceApp"></el-option>
                  <el-option label="mobileApp" value="mobileApp"></el-option>
                  <el-option label="rom" value="rom"></el-option>
                  <el-option label="patch" value="patch"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="ota_file" :disabled="allDisabled">
                <el-upload
                class="upload-demo"
                ref="upload"
                :action="uploadUrl"
                name="ota"
                :on-success="upload_suc"
                :on-error="upload_err"
                :file-list="fileList">
                <el-button slot="trigger" size="small" type="primary">立即上传</el-button>
                <div slot="tip" class="el-upload__tip">上传成功后，会返回otaId。若丢失，请自行查找(最多只有近6次otaId)</div>
                </el-upload>
                <el-col :span="18" class="otaId">
                    <el-popover
                      ref="popover"
                      placement="right"
                      width="400"
                      @show="searchId"
                      trigger="click">
                      <el-table :data="otaList"  @row-click="copyId">
                        <el-table-column width="200" property="fileName" label="文件名"></el-table-column>
                        <el-table-column width="200" property="id" label="otaId" ></el-table-column>
                      </el-table>
                    </el-popover>
                    <el-input v-model="otaId" placeholder="请输入otaId" icon="search" v-popover:popover :disabled="allDisabled"></el-input>              
                </el-col>
            </el-form-item>
            <el-form-item label="ota版本" >
                <el-input v-model="form.version" placeholder="版本格式：1.1.1" @blur="getblur" @focus="getfocus" spellcheck="false" :disabled="allDisabled"></el-input><span class="el-icon-circle-check input_tips" v-if="blur&&input_check" style="color: #13CE66;"></span><span class="el-icon-circle-cross input_tips" style="color:#CB533F" v-if="blur&&!input_check"></span>
            </el-form-item>
            <el-form-item label="ota更新名">
                <el-input v-model="form.name" placeholder="请输入更新名称" :disabled="allDisabled"></el-input>
            </el-form-item>
            <el-form-item label="md5">
                <el-input v-model="form.checksum" placeholder="请输入md5字符串" :disabled="allDisabled"></el-input>
            </el-form-item>
            <el-form-item label="增量类型" class="user" v-if="form.type!='patch'">
                <el-radio-group v-model="form.updateMode" :disabled="allDisabled">
                    <el-radio label="全量"></el-radio>
                    <el-radio label="增量"></el-radio>
                </el-radio-group>
                <el-select v-model="form.fromVersion" placeholder="选择可更新的版本来源" :disabled="allDisabled" class="upMode"  v-if="form.updateMode=='增量'">
                  <el-option v-for="(list,index) in List " :label="'v'+list" :value="list"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="黑白名单" class="user">
                <el-select v-model="userlist" placeholder="无" :disabled="allDisabled">
                  <el-option label="无" value="0"></el-option>
                  <el-option label="黑" value="blackList"></el-option>
                  <el-option label="白" value="whiteList"></el-option>
                </el-select>
                <el-input type="textarea" v-model="form.blackList" class="userList" :rows="16" v-if="userlist=='blackList'" placeholder="黑名单, 这些设备deviceId不可升级, 每个用逗号隔开 e.g “xbot3424343434,xbot89890890809”" :disabled="allDisabled"></el-input>
                <el-input type="textarea" v-model="form.whiteList" class="userList" :rows="16" v-if="userlist=='whiteList'" placeholder="白名单, 仅这些设备deviceId可升级 每个用逗号隔开 e.g “xbot3424343434,xbot89890890809”" :disabled="allDisabled"></el-input>
            </el-form-item>
            <el-form-item label="强制开关" v-if="form.type!='mobileApp'">
                <el-switch on-text="" off-text="" v-model="form.forceMode" :disabled="allDisabled"></el-switch>
            </el-form-item>
            <el-form-item label="熄火时间" v-if="form.type=='deviceApp'">
                <el-input v-model="form.offTime" placeholder="单位（秒/s），未填默认为30" :disabled="allDisabled"></el-input>
            </el-form-item>
            <el-form-item label="补丁版本" v-if="form.type=='patch'">
                <el-input v-model="form.comversion" :disabled="allDisabled"></el-input>
            </el-form-item>
            <el-form-item label="设备型号" v-if="form.type!='mobileApp'">
                <el-input type="textarea" v-model="form.models" placeholder="请输入设备型号，每个用逗号隔开(xbot3424343434,xbot89890890809)" :disabled="allDisabled"></el-input>
            </el-form-item>
            <el-form-item label="版本描述">
                <el-input type="textarea" v-model="form.description" placeholder="请输入该版本功能描述" :disabled="allDisabled"></el-input>
            </el-form-item>
          
            <el-form-item>
                <el-button type="primary" @click="submitUpload">{{sub_text}}</el-button>
                <el-button @click="$router.go(-1)">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {mapState} from "vuex"
    import {uploadota,add_Ver,getOtaId,ud_Ver,publishVer,getavList} from "../../service/getData"
    import {getPrams} from "../../components/common/common"
    export default {
    	data(){
            return{
                userlist:"",
                hastype:"disabled",
                blur:false,
                input_check:false,
                otaId:"",
                sub_text:"立即创建",
                uploadUrl:"http://www.aituyou.com:12105/api/v1/ota/uploadfile",
                allDisabled:false,
                getForm:{},
                List:[],
                form: {
                  type:"",
                  name: '',
                  version :"",
                  checksum :"",
                  description:"",
                  whiteList:"",
                  blackList:"",
                  updateMode:"全量",
                  forceMode:true,
                  fromVersion:"",
                  offTime:'',
                  models:""
                },
                prams:"",
                fileList:[],
                otaList: [],
            }
        },
        compontents:{
            
        },
        created(){
            this.init();
            this.getList(this.form.type);
        },
        mounted(){
            
        },
        computed:{ 
        },
        methods: {
            // 根据页面路由数据初始化
            init(){
                var prams = getPrams(location.href);
                this.form.type = prams.type;
                this.left_init(prams);
               // 为编辑或者查看状态赋予页面初始数据                                    
                if(prams&&prams.type=="edit"||prams.type=="read"){
                    if(this.$store.state.verList==null){
                        this.$message({
                            type:"error",
                            message:"数据获取错误",
                            onClose:()=>{
                                this.$router.go(-1)
                            }
                        })
                        return;
                    }
                    let form = this.$store.state.verList.filter((obj)=>{
                      return obj.id == prams.id;
                    })
                    this.getForm = form[0];
                    for(var key in form[0].configuration){
                       if(this.form[key]!=null){
                            this.form[key] = form[0].configuration[key]
                            if(this.form[key]=="full"){
                                this.form[key] ="全量"
                            }
                            if(this.form[key]=="incremental"){
                                this.form[key] ="增量"
                            }
                       }
                    }
                    for(var key in form[0].constraint){
                        if(this.form[key]!=null){
                            this.form[key] = form[0].constraint[key]
                        }                   
                    }
                    if(!form[0].type){
                        this.hastype = false;
                    }
                    console.log(form[0].fromVersion)
                    this.sub_text = "立即更新"
                    this.form.name = form[0].name;
                    this.form.fromVersion = form[0].fromVersion;
                    this.otaId = form[0].id;
                    this.form.version = form[0].version;
                    this.form.description = form[0].description;
                    this.form.checksum = form[0].checksum;
                    this.form.fromVersion = form[0].configuration.fromVersion;
                    this.form.type = form[0].type;
                    this.input_check = true;
                    if(form[0].constraint.blackList){
                        this.userlist = "blackList"
                    }
                    if(form[0].constraint.whiteList){
                        this.userlist = "whiteList"
                    }                 
                }
                if(prams.type =="read"){
                        this.allDisabled = "disabled"
                        this.sub_text = "发布"
                }
            },
            async submitUpload() {
                if(!this.form.type){
                  this.layer("ota类型错误")
                  return
                }
                if(!this.input_check){
                  this.layer("ota版本号不正确")
                  return
                }
                if(!this.form.name){
                  this.layer("请输入ota更新名")
                  return
                }
               
                if(!this.form.checksum){
                  this.layer("请输入md5")
                  return
                }
                if(!this.form.updateMode){
                  this.layer("请选择增量类型")
                  return
                } 
                if(this.userlist=="whiteList"&&!this.form.whiteList){
                    this.layer("请填写白名单")
                  return
                }
                if(this.userlist=="blackList"&&!this.form.blackList){
                    this.layer("请填写黑名单")
                  return
                }
                
                if(!this.form.description){
                  this.layer("请填写描述")
                  return
                }
                this.prams="?id="+this.otaId+"&";
                this.pram_data = {id:this.otaId};
                for(var key in this.form){
                    if(this.form[key]){
                        if(this.form[key]=="全量"){
                            this.form[key] ="full"
                        }
                        if(this.form[key]=="增量"){
                            this.form[key] ="incremental"
                        }
                        this.prams += key+'='+this.form[key]+"&"
                        this.pram_data[key] = this.form[key]
                    }else if(key =="offTime"&&this.form.type=="deviceApp"){
                        this.form.offTime = 30;
                        this.prams += key+'='+this.form[key]+"&"
                        this.pram_data[key] = this.form[key]
                    }                   
                }
                this.prams = this.prams.substring(0,this.prams.length-1);
                this.submit();
            },
            // 文本弹窗tips
            layer(text,callback){
                this.$parent.showAlert = true;
                this.$parent.alertText = text;
                setTimeout(() =>{
                    this.$parent.showAlert = false;
                    callback()           
                },1000) 
            },
            upload_suc(msg){
                this.otaId = msg.res.otaId;
                this.$message({
                    type:"success",
                    message:msg.ch
                })
            },
            upload_err(err){
                this.layer("上传失败")
            },
            // 版本正则
            getblur(){
                this.blur = true;
                if(/^(\d+\.){2,}\d+$/.test(this.form.version)){
                    this.input_check = true   ;              
                }else{
                    this.input_check = false;  
                }
            },
            getfocus(){
                this.blur = false;
            },
            async searchId(){
                var data = await getOtaId();
                this.otaList = data.res.reverse().splice(0,6);
            },
            copyId(row){
                this.otaId = row.id
            },
            // 获取可用版本来源
            async getList(type){
                var data = await getavList(type);
                this.List = data.res;
            },
            // 根据状态发送请求
            submit(){
                var Prams = getPrams(location.href);
                if(Prams.type == "edit"){
                    ud_Ver(this.prams).then((res)=>{
                        if(res.code == 0){
                            this.$message({
                                type:"success",
                                message:"更新成功",
                                onClose:()=>{
                                    this.$router.go(-1)
                                }
                            })
                        }else{
                            this.layer(res.ch)
                        }
                    });
                    return;
                }
                // 查看的状态下发布
                if(Prams.type == 'read'){
                    if(this.getForm.available==""){
                        this.layer("发布失败：该版本已经发布",()=>{
                            this.$router.go(-1)
                        })
                        return;
                    }
                    publishVer(this.otaId).then((res)=>{
                        if(res.code == 0){
                            this.$message({
                                type:"success",
                                message:"发布成功",
                                onClose:()=>{
                                    this.$router.go(-1)
                                }
                            })
                        }else{
                            this.layer(res.ch)
                        }
                    });
                    return;
                }
                // 新建时的请求
                add_Ver(this.pram_data).then((res)=>{
                    if(res.code == 0){
                        this.$message({
                            type:"success",
                            message:"新增成功",
                            onClose:()=>{
                                this.$router.go(-1)
                            }
                        })
                    }else{
                        this.layer(res.ch)
                    }
                });
            },
            // 根据左侧菜单，初始化非编辑页面
            left_init(prams){
                if(prams&&prams.type!="edit"){
                    this.$parent.$on("addVer",()=>{ 
                        var prams = getPrams(location.href);
                        this.form = null; 
                        this.form={
                            type:"",
                            otaId:"",
                            name: '',
                            version :"",
                            checksum :"",
                            description:"",
                            whiteList:"",
                            blackList:"",
                            updateMode:"全量",
                            forceMode:true,
                            fromVersion:"",
                            offTime:'',
                            models:"",
                        }
                     this.List=[];
                     this.sub_text="立即创建";
                     this.hastype = "disabled";
                     this.allDisabled = false;
                     this.userlist='';
                     this.fileList=[];
                     this.otaList = [];
                     this.blur=false;
                     this.input_check=false;
                     this.form.type = prams.type;
                     this.getList(prams.type);
                }); 
               }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
	.container{
        .el-form{
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            width: 44%;
            min-width: 300px;
            .user{
                position: relative;
                .userList{
                    position: absolute;
                    right: -105%;

                }
                .upMode{
                  width: 54%;
                  position: absolute;
                  left:106% ;
                  top:-.1rem;
                }
            }
        }
        .input_tips{
            position: absolute;
            left: 105%;
            top:50%;
            transform:translateY(-50%);
        }
        .otaId{
            position: absolute;
            left: 25%;
            top: 0;
        }
    }
    
</style>
