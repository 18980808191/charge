<template>
  <div>
    <van-notice-bar
      :text="text"
      left-icon="volume-o"
    />
    <div
      v-if="loading"
      style="padding-top:300px;"
    >
      <van-loading
        type="spinner"
        color="#1989fa"
        vertical
      >登录中...</van-loading>
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
      loading: true
    };
  },
  created() {
    var _this = this;
    this.loading=true;
    //console.log(this.$route.query.code);
    this.$fly.post("/login").then(function(response) {
      _this.loading = false;
      if (response.success) {
        //setTimeout(function() {
          _this.setUserInfo({
            userId: response.data.userId,
            userName: response.data.userName,
            regionId: response.data.regionId,
            regionName: response.data.regionName,
            timeDiff: response.data.timeDiff,
            isProvincial:response.data.isProvincial
          });
          _this.$router.replace("/overAll");
        //}, 1000);
      } else {
        _this.$Toast.fail({
          duration: 0, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          message: "登录失败，联系管理员！"
        });
      }
    });
  },
  mounted() {},
  methods: {
    ...mapActions(["setTitle", "setUserInfo"])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
