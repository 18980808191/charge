<template>
  <div>
    <div id="myChart01" :style="{width: '100%', height: '300px'}"></div>
    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 15px' }"></van-divider>

    <van-collapse v-model="activeNames" @change="collapsechange" accordion>
      <van-collapse-item v-for="(item,index) in schedulelist" :key="index" :title="item.regionName" :name="item.regionId" icon="location-o" :value="(item.schedule==null||item.schedule=='')?'0%':(item.schedule+'%')">
        <van-col span="8" v-for="(it,ix) in flowlist" :key="ix">
          <div :style="{textAlign:'center',lineHeight:'35px',height:'35px',fontSize:'12px',color:'#ffffff',background:it.flowValue==100?'#07C160':'#FF976A',margin:'10px'}" size="large" @click.stop="flowdetail(item.regionId,it.flowId,item.regionName,it.flowName)">{{it.flowName}}{{(it.flowValue==null||it.flowValue=='')?'0':it.flowValue}}%</div>
        </van-col>
      </van-collapse-item>
    </van-collapse>

    <van-popup v-model="popupshow" position="right" :style="{marginBottom:'50px',width:'206px' }">
      <van-panel :title="paneltitle" :status="panelstatus">
        <div>
          <van-row v-for="(item,index) in steplist" :key="index" style="border-bottom:1px solid #969799;padding-top:10px;">
            <van-col span="8" offset="4">
              <van-icon name="clock-o" />{{item.startDate}}</van-col>
            <van-col span="8">
              <van-icon name="clock-o" />{{item.startDate}}</van-col>
            <van-col span="20" offset="2">
              <div :style="{color:'#ffffff',background:item.value==100?'#07C160':'#FF976A',margin:'10px',height:'30px',lineHeight:'30px',textAlign:'center'}">{{item.name}}{{(item.value==null||item.value=='')?'0':item.value}}%</div>
            </van-col>
          </van-row>
        </div>
        <div slot="footer">
          <van-button size="small" type="info" @click="shutdownpopup">关闭</van-button>
        </div>
      </van-panel>
    </van-popup>
  </div>
</template>

<script>
//import {mapGetters,mapState,mapActions} from 'vuex';
import { mapState, mapActions } from "vuex";
export default {
  name: "OverAll",
  data() {
    return {
      schedule01: undefined,
      schedulelist: [],
      steplist: [],
      flowlist: [],
      activeNames: [],
      failtime: 20,
      popupshow: false,
      paneltitle: "",
      panelstatus: ""
    };
  },
  computed: {
    ...mapState(["userId"])
  },
  created() {
    if (this.userId == "") {
      this.$router.push("/login");
    } else {
      var _this = this;
      this.$fly.post(this.$api.scheduleOverProvince).then(function(response) {
        if (response.status == 200) {
          _this.schedule01 = response.data;
        }
      });
      this.$fly.post(this.$api.scheduleLocalLan).then(function(response) {
        if (response.status == 200) {
          _this.schedulelist = response.data;
        }
      });
    }
  },
  mounted() {
    if (this.userId == "") {
      return;
    }
    this.setTitle({ title: "进度", ck: "1" });
    this.func("this.schedule01", "this.drawchart01", "this.schedule01");
  },
  methods: {
    ...mapActions(["setTitle"]),
    collapsechange(e) {
      this.flowlist = [];
      if (e) {
        var _this = this;
        this.$fly
          .post(this.$api.scheduleLocalLanDetail, { localLan: e })
          .then(function(response) {
            if (response.status == 200) {
              _this.flowlist = response.data;
            }
          });
      }
    },
    flowdetail(regionId, flowId, regionName, flowName) {
      this.paneltitle = regionName;
      this.panelstatus = flowName;
      let monthId = this.getLastMonthId();
      var _this = this;
      this.$fly
        .post(this.$api.scheduleLocalLanPetriStep, {
          localLan: regionId,
          flowId: flowId,
          monthId: monthId
        })
        .then(function(response) {
          if (response.status == 200) {
            _this.steplist = response.data;
            _this.popupshow = true;
          }
        });
    },
    getLastMonth() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth();
      if (month == 0) {
        year = year - 1;
        month = 12;
      }
      return year + "年" + month + "月";
    },
    getLastMonthId() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth();
      if (month == 0) {
        year = year - 1;
        month = 12;
      }
      if (month < 10) {
        month = "0" + month;
      }

      return "1" + String(year).substr(2, 2) + month;
    },
    func(a, b, c) {
      var _this = this;
      var abc = eval(a);
      if (!eval(a)) {
        if (_this.failtime > 0) {
          setTimeout(function() {
            _this.func(a, b, c);
          }, 300);
          _this.failtime--;
        }
      } else {
        eval(b + "(" + c + ");");
      }
    },
    drawchart01(rate) {
      let myChart = this.$echarts.init(document.getElementById("myChart01"));
      let option = {
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%"
        },
        title: {
          text: this.getLastMonth() + "出账总进度"
        },
        series: [
          {
            name: "进度",
            type: "gauge",
            detail: { formatter: "{value}%" },
            data: [{ value: rate, name: "完成" }]
          }
        ]
      };
      myChart.setOption(option, true);
    },
    shutdownpopup: function() {
      this.popupshow = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
