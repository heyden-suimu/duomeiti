 <template>
    <div class="alet_container">
	    <section class="layer">          
            {{alertText}}
        </section>
    </div>
</template>

<script>
    export default {
    	data(){
            return{
                positionY: 0,
                timer: null,
            }
        },
        mounted(){
      
        },
        props: ['alertText'],
        methods: {
            closeTip(){
                this.$emit('closeTip')
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
	@keyframes tipMove{
       0%   { transform: scale(1) }
       35%  { transform: scale(.8) }
       70%  { transform: scale(1.1) }
       100% { transform: scale(1) }
    }
    .alet_container{
    	position: fixed;
    	top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
        font-size: 16px;    
    }
    .layer{
        position: absolute;
        top: 50%;
        left: 50%;
        background: rgba(0,0,0,.6);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        transform:translate(-50%,-50%);
        -webkit-transform:translate(-50%,-50%);
        -moz-transform:translate(-50%,-50%);
        -o-transform:translate(-50%,-50%);
    }
    
</style>
