import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
	successStation:false,
	songSheet:{
      "tags": [],              
      "creator": "",
      "name": "",
      "iconUrl": "",
      "description": "",
      "type": 1,
      "startTime": 0,
      "endTime": 0
    },
    audioResult:null,
	xbInfo:{LicenseNo:null},
	orderlist:null,
	userlist:null,
  currentSize:10,	
}

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
})