import {
	SUCCESS_STATION,
	AUDIO_RESULT,
} from './mutation-types.js'

export default {
	// 记录用户信息
	[SUCCESS_STATION](state,successStation){
		state.successStation = !successStation
	},
	[AUDIO_RESULT](state,audioresult){
		state.audioResult = audioresult
	},	
}