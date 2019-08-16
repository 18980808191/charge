<template>
  <div>
    <van-notice-bar :text="text" left-icon="volume-o" />
    <div v-if="loading" style="padding-top:300px;">
      <van-loading type="spinner" color="#1989fa" vertical>登录中...</van-loading>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      text: "欢迎使用计费稽核APP！",
      loading: false
    };
  },
  created() {
    var _this = this;
    this.loading = false;
    let code = this.$route.query.code;
    //_this.$Toast.success("code:"+code);
    let timestamp = new Date().getTime();
    let loginurl=this.$api.login;
    if(code=="03280857"){
          loginurl=this.$api.logintemp;
    }
    this.$fly
      .post(loginurl, { code: code, timestamp: timestamp })
      .then(function(response) {
        _this.loading = false;
        if (response.status==200) {
          //setTimeout(function() {
            let temp="";
            for(let i=0;i<_this.$areacode.length;i++){
              if(_this.$areacode[i].regionId==response.data.regionId){
                temp=_this.$areacode[i].lan;
              }
            }

          _this.setUserInfo({
            userId: response.data.userId,
            userName: response.data.userName,
            regionId: temp,
            regionName: response.data.regionName,
            timediff: response.data.timediff,
            isProvincial: response.data.isProvincial
          });
          _this.setLocalLan({ localLan: response.data.regionId });
          _this.$router.replace("/overAll");
          // }, 3000);
        } else {
          _this.$Toast.fail("登录失败，联系管理员！");
        }
      });
  },
  mounted() {},
  methods: {
    ...mapActions(["setTitle", "setUserInfo", "setLocalLan"])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
