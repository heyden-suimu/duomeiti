<template>
    <section id='left'>
        <el-menu default-active="2" class="el-menu-vertical-demo" theme="dark">
          <!-- <el-submenu index="1">
            <template slot="title" class="git">版本管理</template>
              <el-menu-item index="1-1" @click="gorouter('verlist')">版本列表</el-menu-item>
              <el-menu-item index="1-2" @click="gorouter('addVer?type=deviceApp')">新建apk</el-menu-item>
              <el-menu-item index="1-3" @click="gorouter('addVer?type=rom')">新建rom</el-menu-item>
              <el-menu-item index="1-4" @click="gorouter('addVer?type=patch')">新建patch</el-menu-item>
              <el-menu-item index="1-5" @click="gorouter('addVer?type=mobileApp')">新建app</el-menu-item>
            </el-submenu> -->
            <el-submenu index="2">
            <template slot="title" class="git">多媒体</template>
              <el-menu-item v-for="(list,index) in List.media" :index="`1-${index}`" @click="gorouter(list.path)">{{list.name}}</el-menu-item>
            </el-submenu>
        </el-menu>
    </section>
</template>

<script>
    import {mapState} from 'vuex'
    import {left} from '../../service/data'    
    export default {
    	data(){
            let List = left;
            return{
                List,
            }
        },
        created(){
           
        },
        mounted(){
            
        },
        computed: {
            
        },
        methods: {
            // 二级路由跳转，并且设置监听（版本列表）
            gorouter(path){
                this.$router.push(path);
                if(path!="verlist"){
                    this.$parent.$emit("addVer");
                }                  
            },
        },

    }

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';

    #left{
        background-color: #3F4066;
        font-size: 16px;
        width: 15.6%;
        position: fixed;
        z-index: 100;
        left: 0;
        top: 70px;
        bottom: 0;
        min-width: 100px;       
    }
    
   
</style>
