 <template>
    <div class="container comList">
        <div class="title">
            <el-checkbox v-if='headTitle[0].title=="全选"' @change='allSelect' v-model='allselect'></el-checkbox>
            <span v-for='item in headTitle' :span='item.span' @click="allSelect">{{item.title|titleShow}}</span>
        </div>
        <el-row v-for='(item,index) in spreadList' v-rowClick="[handle,item]" v-dragging='getDragg(item,spreadList, index)' :class="{'bunSet':bunSet(item),'spreadList':true}">
            <el-col :span='1'><el-checkbox v-model="checkArr[index]" v-boxClick='[spreadList,item]'></el-checkbox></el-col>
            <el-col v-for='(spread,code) in spreadFormat.text' class="title_col" :title="showSpread(spread&&spread.name,item,index)">
            <img :src='item&&item.iconUrl' v-if="code == 0&&item">{{spread&&spread.name|show(item,index)}}</el-col>
            <el-col v-for='data in spreadFormat.icons'  :span='1' ><span :class='coinClass(data,item)' :title='filterTitle(data.icon)' v-typeClick='[data, item, index, spreadList, $store.state.successStation]' v-if="isShow(item, data)"></span></el-col>
        </el-row>
        <div class="msg" v-if="msg">{{msg}}</div>
        <el-pagination 
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageTion.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageTion.currentSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total='pageTion.total'
          v-if='pageTion.show'>
        </el-pagination> 
    </div>
</template>
    
<script>
    import {apiSongSheet} from "../../service/getData"
    import {mapState, mapActions} from 'vuex'
    export default {
    	data(){
           return{
                checkArr: [],
                allselect:false,
                pageTionNmae:'pageNation'
           }
        },
        mounted(){

        },
        computed:{
            ...mapState([
                'successStation'
            ]),
            msg:{        
                get(){
                    let msg;
                    if(this.spreadList&&this.spreadList.length<1){
                        msg = "没有相应资源~";
                    }
                    return msg;
                },
            }
        },
        created(){
            if(!this.dragg) return;
            this.$dragging.$on('dragged',(obj)=>{
              this.$parent.$emit('dragged',obj.value)
            })
        },
        compontents:{
            
        },
        props: {
            spreadList:{
                default:null,
            },
            handle:{
                default:null,
            },
            spreadFormat:{
                default:null,
            },
            headTitle:{
                default:null,
            },
            dragg:{
                default:null,
            },
            pageTion:{
                default:{
                    total:0,
                    currentSize:10,
                    currentPage:1,
                    show:true
                }
            },
            secShow:{
                default:false,
            },
        },
        filters:{
            show(val,item, index){
                let tag;
                switch(val){
                    case 'index' :
                    tag = index + 1;break
                    case 'name' :
                    tag = item&&item.name;break
                    case 'type' :
                    tag = item&&item.type == 2?'节目':'音乐';break
                    case 'tags' :
                    if( !item || !item.tags) {
                        tag='--';
                        break;
                    }
                    let arr = [];
                    item.tags.map((list)=>{
                        arr.push(list.name)
                        tag = arr.join(',')
                    });break
                    case 'Time' :
                    let length = item&&item.length/60
                    tag = length.toFixed(1);break
                    default:tag = item&&item[val];
                }

                return tag
            },
            titleShow(val){
                if(val=="全选") return ''
                return val
            }
        },
        methods: {
            ...mapActions([
                'getSuccess'
                ]),
            move(){
                this.$parent.$emit('moveMedia',true)
            },
            getSheet(){
                // console.log(1)
            },
            filterTitle(title){
                let tag;
                switch(title){
                    case 'el-icon-heyden-icon_download' :
                    tag = '本地下载';break
                    case 'el-icon-heyden-dianping' :
                    tag = '编辑';break
                    case 'el-icon-heyden-icon_delete_fill' :
                    tag = '删除';break
                    case 'el-icon-heyden-icon_setting' :
                    tag = '禁用配置';break
                    case 'el-icon-heyden-refresh' :
                    tag = '更新链接';break
                    case 'el-icon-heyden-fuzhilianjie' :
                    tag = '复制歌曲链接';break
                    default :
                    tag = '';
                }
                return tag;
            },
            handleSizeChange(size){
                
                if(this.secShow){
                    this.$parent.$parent.$emit('pageNation1', (this.pageTion.currentPage-1)*this.pageTion.currentSize, size,this.pageTion.currentPage)
                }else{
                    this.$parent.$emit('pageNation', (this.pageTion.currentPage-1)*this.pageTion.currentSize, size,this.pageTion.currentPage)
                }
                this.$store.state.currentSize = size;
                this.allselect = false;
                this.allSelect()
            },
            handleCurrentChange(currentPage){
                if(this.secShow){
                    this.$parent.$parent.$emit('pageNation1', (currentPage-1)*this.$store.state.currentSize,this.$store.state.currentSize,currentPage)
                }else{
                    this.$parent.$emit('pageNation', (currentPage-1)*this.$store.state.currentSize,this.$store.state.currentSize,currentPage)
                }
                this.allselect = false;
                this.allSelect()
            },
            getDragg(item,spreadList, index){
                if(!this.dragg) return {item: null, list: null, group: null};
                return {item: item, list: spreadList, group: "comlist", index:index};
            },
            bunSet(item){
                const date = new Date();
                let time = date > (item&&item.endTime||99999999999999999)
                if(item.hasOwnProperty('status')){
                    return time || !item.status
                }else{
                    return time
                }
            },
            isShow(item, data){
                return true
            },
            allSelect(){    
                this.spreadList.map((item, index)=>{
                    this.checkArr.splice(index, 1, this.allselect)
                })
            },
            coinClass(data,item){
                if(data.icon == 'el-icon-heyden-icon_download'){
                   let classNmae =  item.localization ==0?data.icon:item.localization==1?'el-icon-heyden-dengdai2':data.icon;
                    return {[classNmae]:true, "success": item.localization==2}
                }
                return {[data.icon]:true}
            },
            showSpread(val,item,index){
                let tag;
                switch(val){
                    case 'index' :
                    tag = index + 1;break
                    case 'name' :
                    tag = item&&item.name;break
                    case 'type' :
                    tag = item&&item.type == 2?'节目':'音乐';break
                    case 'tags' :
                    if( !item || !item.tags) {
                        tag='--';
                        break;
                    }
                    let arr = [];
                    item.tags.map((list)=>{
                        arr.push(list.name)
                        tag = arr.join(',')
                    });break
                    case 'Time' :
                    let length = item&&item.length/60
                    tag = length.toFixed(1);break
                    default:tag = item&&item[val];
                }

                return tag
            }
        },
        directives:{
            typeClick:{
                bind(el, binding, vnode){
                    el.addEventListener('click', async function(){
                        event.stopPropagation();
                        if(!binding.value[0]) return
                        function success(){
                            let promise = new Promise(function(resolve, reject){
                                let res = binding.value[0].method(binding.value[1],resolve,reject)
                            })
                            return promise;
                        }
                        let station = await success()
                        if(station = 'success'){
                            binding.value[3].splice(binding.value[2],1)
                        }
                    })
                },
            },
            rowClick:{
                bind(el, binding, vnode){
                    el.addEventListener('click', async function(){
                        if(binding.value[0]){
                            binding.value[0](binding.value[1])
                        }
                    })
                },
            },
            boxClick:{
                bind(el, binding, vnode){
                    el.addEventListener('click', async function(){
                       event.stopPropagation();
                    })
                }
            },
            allSelect:{
                bind(el, binding, vnode){
                    el.addEventListener('click', async function(){
                       event.stopPropagation();
                       binding.value[2].map((item, index)=>{
                          binding.value[0][index] = true
                       })
                    })
                }
            }
        },
        destroyed(){
            this.headTitle = null;
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    @import '../../assets/icons/iconfont.css';
	.comList{
        padding: 0 .4rem;
        div.title{
            border-bottom: 1px solid #ccc;
            overflow: hidden;
            span{
                display: inline-block;
                padding: .08rem 0;
            }
            span:nth-child(2){
                width: 1.2%;      
            }
            span:nth-child(3){
                width: 11.8%;     
            }
            span:nth-child(4){
                width: 12%;     
            }
            span:nth-child(5){
                width: 12%;     
            }
            span:nth-child(6){
                width: 19%;     
            }
            span:nth-child(7){
                width: 21%;     
            }
        }
        .el-row{
            font-size: 14px;
            padding: 0.03rem 0rem 0.02rem;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            border-bottom: 1px solid #ccc;
            border-left: 1px solid #ccc;
            display: flex;
            img{
                width: .4rem;
                height: .4rem;
            }
            .title_col{
                margin-top: .013rem;
                padding-left: 0;
                width: 11%;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                font-size: 14px;
                margin-right: 1%;
            }
            .title_col:nth-of-type(2){
                width:10%;
                max-width: 10%;
            }
            .title_col:nth-of-type(5){
                width:18%;
                max-width: 18%;
            }
            .title_col:nth-of-type(6){
                width:20%;
                max-width: 20%;
            }
        }
        .el-collapse{
            .head_collapse{
                float: right;
                margin-right: .2rem;
            }
            .el-row{
                font-size: 16px;
                text-align: left;
                margin-bottom: .3rem;
            }
            .el-button{
                border:none;
                padding: 0;
                margin: 0;
                margin-right:.1rem;
            }
        }
        .msg{
            font-size: 16px;
            color: #ccc;
            text-align: center;
            padding-top: 1rem;
        }
        .spreadList{
            height: .48rem;
            padding: 0;
            line-height: .5rem;
        }
        .bunSet{
            background: rgb(223, 230, 236);
            .el-icon-heyden-icon_setting{
                color: gray;
            }
        }
        .el-pagination {
            margin-top: .2rem;
            text-align: center;
            padding-bottom: .1rem;
        }
    }
</style>
