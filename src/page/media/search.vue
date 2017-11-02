 <template>
    <div class="container search">
    <el-row>
        <el-select v-model="source" placeholder="本地" @change="getType">
            <el-option
              v-for="item in sources"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
        <el-select v-model="type" placeholder="音乐" :disabled="disabled">
            <el-option
              v-for="item in types"
              :key="item.code"
              :label="item.value"
              :value="item.code">
            </el-option>
        </el-select>
    </el-row>
    <el-row>
        <el-input
          placeholder="请输搜索入内容"
          icon="search"
          v-model="audio"
          :on-icon-click="search"
          @keyup.enter.native="search"
          >
        </el-input>
        <el-button @click='search'>搜索</el-button>                     
    </el-row>        
    </div>
</template>
    
<script>
    import {apiAudio,yunAudio,xmAudio} from "../../service/getData"
    import {layer} from '../../components/common/common'
    import {mapActions} from 'vuex'
    export default {
    	data(){
            let types1 = [{value:'歌单'},{value:'歌曲'},{value:'节目'}];
            return{
                source:'本地',
                type:1,
                sources:[{value:'本地'},{value:'网易云'},{value:'虾米'},{value:'喜马拉雅（节目）'}],
                types:[{value:'音乐',code:1},{value:'节目',code:2}],
                request:0,
                audio:'',
                disabled:false,
            }
        },
        mounted(){
            
        },
        
        created(){
            
        },
        compontents:{
            
        },
        props: ['alertText'],
        methods: {
            ...mapActions([
                'getResult'
                ]),
            getType(){
                if(this.source == '本地'){
                    this.request = 0;
                    this.disabled = false;
                }else if(this.source == '网易云'){
                    this.type = 1;
                    this.request = 2;
                    this.disabled = true;
                }else if(this.source == '虾米'){
                    this.type = 1;
                    this.request = 1;
                    this.disabled = true;
                }else if(this.source == this.sources[3].value){
                    this.type =2;
                    this.request = 3;
                    this.disabled = true;
                }
            },  
            async search(){
                if(!this.audio){
                    layer(this,'内容不能为空')
                    return
                }
                let data;
                if(this.request == 0){
                     data = await apiAudio('get',{name:this.audio, type:this.type}) 
                }else if(this.request == 3){
                     data = await xmAudio('get',{keywords:this.audio}) 
                }else{
                     data = await yunAudio('get',{keywords :this.audio,source:this.request}) 
                }
                if(data.code==0){
                    this.request == 0?this.getResult(data.res.audios):this.getResult(data.res);
                    this.$router.push('result')
                }else{
                    layer(this,data.message)
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
	.container{

        .el-row{
            // background:#D3DCE6;
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
            .el-select{
                width: 10%;
            }
            .el-input{
                width: 40%;
                margin-top: .8rem;
                margin-left: 20%;
            }
        }
    }
</style>
