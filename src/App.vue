<template>
  <div>
    <van-nav-bar
      ref="navbar"
      fixed
      :title="title"
      :left-text="menutext"
      left-arrow
      @click-left="onClickLeft"
    >
      <div slot="right">
        <van-icon name="user-o" />{{userName}}
      </div>
    </van-nav-bar>
    <div
      ref="cpv"
      :style="{height:ht+'px',paddingTop:mg+'px',paddingBottom:mt+'px',overflow:'auto'}"
    >
      <router-view ref="cp" />
    </div>
    <van-tabbar
      v-show="showflag"
      ref="bottombar"
      v-model="active"
    >
      <van-tabbar-item
        name="overAll"
        icon="eye"
        to="overAll"
      >进度</van-tabbar-item>
      <van-tabbar-item
        name="localLan"
        icon="location"
        to="localLan"
      >收入</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      active: "overall",
      menutext: "关闭",
      ht: 200,
      mg: 46,
      mt: 50,
      showflag: false
    };
  },
  mounted() {
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    this.mg = this.$refs.navbar.offsetHeight;
    this.mt = this.$refs.bottombar.$el.offsetHeight;
    this.ht = h - this.mg - this.mt;
  },
  computed: {
    ...mapState({
      title: "title", // 第一种写法
      ck: "ck",
      regionId: "regionId",
      userId:"userId",
      userName: "userName",
      isProvincial:"isProvincial"
      //sex: (state) => state.sex, // 第二种写法
    })
  },
  methods: {
    onClickLeft() {
      // if (1 == this.ck) {
      //   alert("关闭");
      //   if(window.history.length > 1){
      //     this.$router.go(-1);
      //   }
      // }
      if (2 == this.ck && this.isProvincial) {
        this.$refs.cp.redirectTolocal([this.regionId, 0, "全省"], 1);
      }else{
        var _this=this;
         clplus.clAMS.backToPortal(function(error){
           _this.$Toast.fail(error);
         });
      }
    },
    watchroute(to,from) {
      if(!to.name){
        this.$router.push("/login");
      }
      this.$refs.cpv.scrollTo(0, 0);
      if (to.path == "/localLan") {
        this.showflag = true;
        this.active = "localLan";
      } else if (to.path == "/overAll") {
        this.showflag = true;
        this.active = "overAll";
      } else if (to.path == "/login") {
        this.showflag = false;
      }
    }
  },
  created() {
    if (this.userId == "" && this.$route.path!="/login" ) {
      this.$router.push({path:"/login",query:{code:this.$route.query.code}});
    }
  },
  watch: {
    $route: "watchroute",
    ck: {
      handler(newValue, oldValue) {
        if (newValue == 2 && this.isProvincial) {
          this.menutext = "返回";
        } else {
          this.menutext = "关闭";
        }
      }
    }
  }
};
</script>
<style>
html,
body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}
</style>
