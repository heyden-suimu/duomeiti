export default {
	updateUser:state=>{
		return state.userinfo
	},
	getxbinfo:state=>{
		let obj = {
			"basic":[
				{value:state.xbInfo.CheSun>0?1:0,name:"车辆损失险",code:"CheSun",mianpei:!!state.xbInfo.BuJiMianCheSun},
				{value:state.xbInfo.SanZhe,name:"第三者责任险",code:"SanZhe",mianpei:!!state.xbInfo.BuJiMianSanZhe,slect_list:[{name:"5万",price:50000},{name:"10万",price:100000},{name:"15万",price:150000},{name:"20万",price:200000},{name:"25万",price:250000},{name:"30万",price:300000},{name:"35万",price:350000},{name:"40万",price:400000},{name:"45万",price:450000},{name:"50万",price:500000},{name:"100万",price:1000000},{name:"150万",price:1500000},{name:"200万",price:2000000},{name:"250万",price:2500000},{name:"300万",price:3000000},{name:"500万",price:5000000}]},
				{value:state.xbInfo.DaoQiang>0?1:0,name:"全车盗抢险",code:"DaoQiang",mianpei:!!state.xbInfo.BuJiMianDaoQiang},
				{value:state.xbInfo.SiJi,name:"司机座位责任险",code:"SiJi",mianpei:!!state.xbInfo.BuJiMianSiJi,slect_list:[{name:"1万",price:10000},{name:"2万",price:20000},{name:"3万",price:30000},{name:"4万",price:40000},{name:"5万",price:50000},{name:"10万",price:100000},{name:"20万",price:200000},{name:"50万",price:500000},{name:"100万",price:1000000}]},
				{value:state.xbInfo.ChengKe,name:"乘客座位责任险",code:"ChengKe",mianpei:!!state.xbInfo.BuJiMianChengKe,slect_list:[{name:"1万",price:10000},{name:"2万",price:20000},{name:"3万",price:30000},{name:"4万",price:40000},{name:"5万",price:50000},{name:"10万",price:100000},{name:"20万",price:200000},{name:"50万",price:500000},{name:"100万",price:1000000}]},				
			],
			'other':[
				{value:state.xbInfo.HuaHen,name:"划痕险",code:"",code:"HuaHen",mianpei:!!state.xbInfo.BuJiMianHuaHen,slect_label:[2000,5000,10000,20000]},
				{value:state.xbInfo.BoLi,name:"玻璃单独破碎险",code:"BoLi",slect_list:[{name:0,value:"不投保"},{name:1,value:"国产"},{name:2,value:"进口"}]},
				{value:state.xbInfo.SheShui>0?1:0,name:"涉水行驶损失险",code:"SheShui",mianpei:!!state.xbInfo.BuJiMianSheShui},
				{value:state.xbInfo.ZiRan>0?1:0,name:"自燃损失险",code:"ZiRan",mianpei:!!state.xbInfo.BuJiMianZiRan},
				{value:state.xbInfo.HcSanFangTeYue,name:"机动车无法找到第三方险",code:"HcSanFangTeYue"},
				// {value:state.xbInfo.HcJingShenSunShi>0?1:0,name:"精神损失险保额",code:"HcJingShenSunShi",mianpei:state.xbInfo.BuJiMianJingShenSunShi},
				{
					value:parseInt(state.xbInfo.HcXiuLiChangType),
					name:"指定修理厂险",
					code:"HcXiuLiChangType",
					slect_list:[{name:-1,value:"不投保"},{name:0,value:"国产"},{name:1,value:"进口"}],
					xishu:{
						0:[{name:"0",value:0},{name:"0.1",value:"10%"},{name:"0.15",value:"15%"},{name:"0.2",value:"20%"},{name:"0.3",value:"30%"}],
						1:[{name:"0.15",value:"15%"},{name:"0.2",value:"20%"},{name:"0.3",value:"30%"},{name:"0.4",value:"40%"},{name:"0.5",value:"50%"},{name:"0.6",value:"60%"}],
						"-1":[],
					},
					HcXiuLiChang:state.xbInfo.HcXiuLiChang
				}
			]
		}
		return obj
	}
}