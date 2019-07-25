import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    title: '计费稽核',
    ck: 1,
    userId:'',
    regionId:'',
    regionName:'',
    isProvincial:true,
    userName:'',
    timeDiff:''
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
      state.timeDiff=ob.timeDiff;
      state.isProvincial=ob.isProvincial;
    }
  },
  actions: {
    setTitle(context, ob) {
      context.commit('setTitle', ob);
    },
    setUserInfo(context, ob) {
      context.commit('setUserInfo', ob);
    },
  }
})
