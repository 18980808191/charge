import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    title: '计费稽核',
    ck: 1,
    userId:'',
    regionId:'',
    localLan:'',
    regionName:'',
    isProvincial:true,
    userName:'',
    timediff:''
  },
  mutations: {
    setTitle(state, ob) {
      state.title = ob.title;
      state.ck = ob.ck;
    },
    setUserInfo(state,ob){
      state.userId=ob.userId;
      state.regionName=ob.regionName;
      state.regionId=ob.regionId;
      state.userName=ob.userName;
      state.timediff=ob.timediff;
      state.isProvincial=ob.isProvincial;
    },
    setLocalLan(state,ob){
      state.localLan=ob.localLan;
    
    }

  },
  actions: {
    setTitle(context, ob) {
      context.commit('setTitle', ob);
    },
    setUserInfo(context, ob) {
      context.commit('setUserInfo', ob);
    },
    setLocalLan(context, ob) {
      context.commit('setLocalLan', ob);
    },
  }
})
