<template>
    <div class="Container">
        <div class="login">
            <div class="sitename">后台管理系统</div>
            <form class="loginForm" >
                <div class="item line"><span class="user"></span><input autocomplete="on"  id="UserName" maxlength="20" name="UserName" placeholder="登录名" type="text" v-model="userAccount"></div>
                <div class="item line">
                    <span class="pwd"></span></span><input class="txtbox" id="Password" maxlength="20" name="Password" placeholder="密码" type="password" v-model="passWord" @keyup.enter="mobileLogin"></div>
                <div class="login_container" @click="mobileLogin">登录</div>
            </form>
            <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
        </div> 
    </div>
</template>

<script>
    import alertTip from '../../components/common/alertTip'
    import {mapState, mapMutations} from 'vuex' 

    export default {
        data(){
            return {
                userAccount: null, //用户名
                passWord: null, //密码
                user_name:"admin", //正确用户
                password:"admin",//正确密码
                showAlert: false, //显示提示组件
                alertText: null, //提示的内容
            }
        },
        created(){
            
        },
        components: {
            alertTip,
        },
        computed: {
            
        },
        methods: {

            //发送登陆信息
            async mobileLogin(){
                if (!this.userAccount) {
                    this.layer("请输入用户名")              
                    return
                }
                if(!this.passWord){
                    this.layer("密码不能为空")              
                    return
                }
                if(this.userAccount==this.user_name&&this.passWord==this.password){
                    this.$router.push("/home")
                }else{
                    this.layer("账号或密码不存在")
                }
            },
            closeTip(){
                this.showAlert = false;
            },
            layer(text){
                this.showAlert = true;
                this.alertText = text;
                setTimeout(() =>{
                    this.showAlert = false;           
                },800) 
            }
        }
    }

</script>

<style lang="scss" scoped  rel="stylesheet/scss" type="text/css">
    @import '../../style/mixin';
    .Container{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
        right: 0;
        background: #687CE5;
        .login{
            width: 40%;
            height: 350px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform:translate(-50%,-50%);
            border:1px solid white;
            border-radius: 5px;
            background: white;
            .sitename{
                font-size: 28px;
                text-align: center;
                padding-top: 50px;
            }
            .loginForm{
                width: 60%;       
                margin: 0 auto;
                text-align: left;
                padding-top: 10px;
                .item{
                    width: 100%;
                    overflow: hidden;
                    padding-bottom: 2px;
                    height: 70px;
                    border-bottom: solid 2px #e8ecf1; 
                    position: relative; 
                    span{
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 28px;
                        height: 30px;
                        background: url("../../images/user.png") no-repeat center center;
                    }
                    input{
                        height: 30px;
                        position: absolute;
                        bottom: 0;
                        left: 32px;
                    }
                    span.pwd{
                        background: url("../../images/password.png") no-repeat center center;
                    }
                }
                .login_container{
                    width: 70%;
                    margin: 0 auto;
                    font-size: 16px;
                    background-color: #f76e42;
                    border: solid 1px #f76e42;
                    border-radius: 30px;
                    text-align: center;
                    color: white;
                    padding:10px 0;
                    margin-top: 34px;
                }              
            }
        }

    }
    
</style>
