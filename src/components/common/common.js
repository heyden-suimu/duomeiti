var getPrams = function (url) {
	if(url.indexOf("?") == -1){return}
	var pram = url.split("?")[1];
	pram = pram.split("&");
	var prams = {},pra=[];
	for (var i = 0; i < pram.length; i++) {
		 pra = pram[i].split("=");
		 prams[pra[0]] = pra[1];
	}
	return prams;
}
//弹窗方法，首先得传vnode
const layer = (vnode,msg, type='error')=>{
	vnode.$message({
		type:type,
		message:msg
	})
}

class searh {
	constructor(obj){
		if(typeof obj !== 'object') return
		if(obj.hasOwnProperty('searhArr')) this.condition = obj.searhArr;
		this.destArr = obj.destArr;
	}

	getMultFilter(searhArr = this.condition){
		let arr = this.destArr;
		searhArr.map((item)=>{
			let {name,value} = item;
			arr = this.filterData(name, value, arr)
		})
		return arr
	}

	filterData(name, value, destArr = this.destArr){
		if(!value) return destArr
		let arr = destArr.filter((item)=>{
			return item[name].hasOwnProperty('includes')&&item[name].includes(value)||item[name]==value;
		})
		return arr
	}
}
export {getPrams,layer, searh}