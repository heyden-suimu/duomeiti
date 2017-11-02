import {
	login,
	getCity,
	getxbInfo,
	orderlist
} from '../service/getData'
import{
	tkUrl
}from '../service/data'
import{
	Cookie,
}from '../components/common/common'
import {
	SUCCESS_STATION,
	AUDIO_RESULT,
	XB_INFO,
	ORDER_LIST,
} from './mutation-types.js'


export default {
	getSuccess({
		commit,
		state
	}, station) {
		commit(USER_INFO,station)	
	},
	getResult({
		commit,
		state
	}, data) {
		commit(AUDIO_RESULT,data)	
	},
	
}