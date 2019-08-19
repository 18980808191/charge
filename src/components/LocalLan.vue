<template>
  <div>
    <van-notice-bar :scrollable="false" color="#1989fa" background="#ecf9ff" left-icon="volume-o">{{curmonth}}月总收入：{{total}}万元</van-notice-bar>

    <div id="myChart001" :style="{width: '100%', height: '300px'}"></div>
    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 15px' }"></van-divider>
    <div v-show="localflag" :style="{marginTop:'-30px'}">
      <van-tabs type="card" v-model="optab" color="#22A5F1" @change="tabchange">
        <van-tab v-for="item in optablist" :key="item.value" :name="item.value" :title="item.text"></van-tab>
      </van-tabs>
      <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 15px' }"></van-divider>
    </div>
    <div id="myChart002" :style="{width: '100%', height: '300px'}"></div>
    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 15px' }"></van-divider>
    <div id="myChart003" :style="{width: '100%', height:heightchart3+'px'}"></div>

  </div>
</template>

<script>
//import {mapGetters,mapState,mapActions} from 'vuex';
import { mapState, mapActions } from "vuex";
export default {
  name: "LocalLan",
  data() {
    return {
      dataop01: undefined,
      dataop02: undefined,
      dataop03: undefined,
      dataop04: undefined,
      dataop05: undefined,
      dataop06: undefined,
      failtime: 50,
      total: "**",
      localflag: true,
      heightchart3: 600,
      optab: "0",
      optablist: [
        { text: "移动语音", value: "0" },
        { text: "移动数据", value: "1" }
      ]
    };
  },
  computed: {
    ...mapState([
      "userId",
      "regionId",
      "localLan",
      "regionName",
      "isProvincial"
    ]),
    curmonth: function() {
      var tt = new Date();
      return tt.getMonth() + 1;
    }
  },
  mounted() {
    if (this.userId == "") {
      return;
    }
    if (this.isProvincial) {
      this.redirectTolocal([this.regionId, 0, this.regionName], 1);
    } else {
      this.redirectTolocal([this.regionId, 0, this.regionName], 2);
    }
  },
  created() {
    if (this.userId == "") {
      this.$router.push("/login");
    }
    // else{
    //   if (this.isProvincial) {
    //     console.log("-----loadpart01----------------");
    //     this.loadpart01();
    //   } else {
    //     this.loadpart02();
    //   }
    // }
  },
  methods: {
    ...mapActions(["setTitle", "setLocalLan"]),
    loadpart01() {
      var _this = this;
      this.$fly
        .post(this.$api.incomeProvinceThreeMonth)
        .then(function(response) {
          if (response.status == 200) {
            _this.dataop01 = response.data;
          }
        });
      this.$fly.post(this.$api.incomeItems).then(function(response) {
        if (response.status == 200) {
          _this.dataop02 = response.data;
        }
      });
      this.$fly.post(this.$api.incomeRanks).then(function(response) {
        if (response.status == 200) {
          _this.dataop03 = response.data;
        }
      });
      this.$fly
        .post(this.$api.incomeThis, { localLan: this.localLan })
        .then(function(response) {
          if (response.status == 200) {
            _this.total = response.data;
          }
        });
    },
    loadpart02() {
      var _this = this;
      this.$fly
        .post(this.$api.incomeLanTrendsThreeMonth, { localLan: this.localLan })
        .then(function(response) {
          if (response.status == 200) {
            _this.dataop04 = response.data;
          }
        });
      this.$fly
        .post(this.$api.incomeDetailListTrendsMonth, {
          localLan: this.localLan
        })
        .then(function(response) {
          if (response.status == 200) {
            _this.dataop05 = response.data;
          }
        });
      this.$fly
        .post(this.$api.incomeTeletrafficTrendsMonth, {
          localLan: this.localLan
        })
        .then(function(response) {
          
          if (response.status == 200) {
            _this.dataop06 = response.data;
          }
        });
      this.$fly
        .post(this.$api.incomeThis, { localLan: this.localLan })
        .then(function(response) {
          if (response.status == 200) {
            _this.total = response.data;
          }
        });
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
    drawchart001: function(ob) {
      let months = [];
      let items = [];
      let sdatas = [];
      for (let i = 0, len = ob.length; i < len; i++) {
        if (i == 0) {
          for (let aa of ob[i].income) {
            months.push(aa.month);
          }
        }
        if(!isNaN(ob[i].item)){
          ob[i].item = this.$itemname[ob[i].item];
        }
       
        items.push(ob[i].item);
        let cc = [];
        for (let bb of ob[i].income) {
          cc.push(bb.value);
        }
        sdatas.push({
          name: ob[i].item,
          type: "line",
          data: cc,
          lineStyle: {
            width: 3 //设置线条粗细
          }
        });
      }
      let option = {
        title: {
          text: "近三月收入趋势图",
          subtext: "（单位：万元）"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: items,
          icon: "roundRect",
          x: "left",
          orient: "vertical",
          width: 100,
          top: 60
        },
        grid: {
          top: "50px",
          left: "100px",
          right: "30px",
          bottom: "10px",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: months
        },
        yAxis: {
          type: "value"
        },
        series: sdatas,
        color: [
          "#9933CC",
          "#FF9933",
          "#FFFF00",
          "#339933",
          "#CC3333",
          "#990066",
          "#333333",
          "#bda29a",
          "#6e7074",
          "#546570",
          "#c4ccd3"
        ]
      };
      var myChart = this.$echarts.getInstanceByDom(
        document.getElementById("myChart001")
      );
      if (!myChart) {
        myChart = this.$echarts.init(document.getElementById("myChart001"));
      }
      myChart.clear();
      myChart.setOption(option, true);
    },
    drawchart002: function(ob) {
      let tpob = [];
      let items=[];
      for (let aa of ob) {
        if(!isNaN(aa.item)){
          aa.item = this.$itemname[aa.item];
        }
        items.push(aa.item);
        tpob.push({ value: aa.value, name: aa.item });
      }
      let option = {
        title: {
          text: "收入项",
          subtext: "（单位：万元）",
          x: "left"
        },
        tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: items,
        top: 60
    },
    series : [
        {
            name: '收入',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:tpob,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
      };
      var myChart = this.$echarts.getInstanceByDom(
        document.getElementById("myChart002")
      );
      if (!myChart) {
        myChart = this.$echarts.init(document.getElementById("myChart002"));
      }
      myChart.clear();
      myChart.setOption(option, true);
    },
    drawchart003: function(ob) {
      let tpob = [];
      for (let item of ob) {
        let am = [item.regionId, item.income, item.regionName];
        tpob.unshift(am);
      }
      tpob.unshift(["regionId", "income", "regionName"]);
      let option = {
        title: {
          text: "本地网收入排名",
          subtext: "（单位：万元）"
        },
        dataset: {
          source: tpob
        },
        grid: { containLabel: true, bottom: "1%" },
        xAxis: { name: "amount" },
        yAxis: { type: "category" },
        series: [
          {
            type: "bar",
            encode: {
              // Map the "amount" column to X axis.
              x: "income",
              // Map the "product" column to Y axis
              y: "regionName"
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: "right",
                  formatter: function(value) {
                    return value.data[1];
                  },
                  textStyle: {
                    fontSize: 12,
                    color: "#000",
                    fontWeight: 600,
                    fontFamily: "Microsoft YaHei"
                  }
                }
              }
            }
          }
        ]
      };
      var _this = this;
      var myChart = this.$echarts.getInstanceByDom(
        document.getElementById("myChart003")
      );
      if (!myChart) {
        myChart = this.$echarts.init(document.getElementById("myChart003"),{width:"70%"});
      }
      myChart.resize({ height: this.heightchart3 + "px" });
      myChart.clear();
      myChart.setOption(option, true);
      myChart.on("click", function(param) {
        _this.redirectTolocal(param.data, 2);
      });
    },
    drawchart004: function(ob) {
      let months = [];
      let cc = [];
      for (let i = 0, len = ob.length; i < len; i++) {
        months.push(ob[i].month);
       
        cc.push(ob[i].income);
      }
      let option = {
        title: {
          text: "近三个月收入趋势图",
          subtext: "（单位：万元）"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "20px",
          right: "20px",
          bottom: "10px",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: months
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "收入",
            type: "line",
            data: cc,
            lineStyle: {
              width: 3 //设置线条粗细
            }
          }
        ]
      };
      var myChart = this.$echarts.getInstanceByDom(
        document.getElementById("myChart001")
      );
      if (!myChart) {
        myChart = this.$echarts.init(document.getElementById("myChart001"));
      }
      myChart.clear();
      myChart.setOption(option, true);
    },
    drawchart005: function(ob) {
      let days = [];
      for (let kk = 1; kk <= 31; kk++) {
        if (kk < 10) {
          days.push("0" + kk);
        } else {
          days.push("" + kk);
        }
      }
      let itemlist = [];
      let items = [];
      let sdatas = [];
      for (let i = 0, len = ob.length; i < len; i++) {
        if (i == Number(this.optab)) {
          for (let aa of ob[i].detail) {
            items.push(aa.month);
            let cc = [];
            for (let ff of aa.days) {
              cc.push(ff.value);
            }
            sdatas.push({
              name: aa.month,
              type: "line",
              data: cc,
              lineStyle: {
                width: 3 //设置线条粗细
              }
            });
          }
        }
        if(!isNaN(ob[i].item)){
          ob[i].item = this.$itemname[ob[i].item];
        }
        itemlist.push({ text: ob[i].item, value: "'" + i + "'" });
      }
      this.optablist = itemlist;
      let option = {
        title: {
          text: "清单收入日走势图",
          subtext: "（单位：万元）"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: items,
          top: "30px",
          icon: "roundRect"
        },
        grid: {
          top: "70px",
          right: "30px",
          bottom: "10px",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: days
        },
        yAxis: {
          type: "value"
        },
        series: sdatas,
        color: ["#007ACC","#C43D39"]
      };
      var myChart = this.$echarts.getInstanceByDom(
        document.getElementById("myChart002")
      );
      if (!myChart) {
        myChart = this.$echarts.init(document.getElementById("myChart002"));
      }
      myChart.clear();
      myChart.setOption(option, true);
    },
    drawchart006: function(ob) {
      let days = [];
      for (let kk = 1; kk <= 31; kk++) {
        if (kk < 10) {
          days.push("0" + kk);
        } else {
          days.push("" + kk);
        }
      }
      let itemlist = [];
      let items = [];
      let sdatas = [];
      for (let i = 0, len = ob.length; i < len; i++) {
        if (i == Number(this.optab)) {
          for (let aa of ob[i].detail) {
            items.push(aa.month);
            let cc = [];
            for (let ff of aa.days) {
              cc.push(ff.value);
            }
            sdatas.push({
              name: aa.month,
              type: "line",
              data: cc,
              lineStyle: {
                width: 3 //设置线条粗细
              }
            });
          }
        }
        if(!isNaN(ob[i].item)){
          ob[i].item = this.$itemname[ob[i].item];
        }
        itemlist.push({ text: ob[i].item, value: i });
      }
      this.optablist = itemlist;

      let option = {
        title: {
          text: "清单话务量日走势图",
          subtext: "（单位：万元）"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: items,
          top: "30px",
          icon: "roundRect"
        },
        grid: {
          top: "70px",
          right: "30px",
          bottom: "10px",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: days
        },
        yAxis: {
          type: "value"
        },
        series: sdatas,
        color: ["#007ACC","#C43D39"]
      };
      var myChart = this.$echarts.getInstanceByDom(
        document.getElementById("myChart003")
      );
      if (!myChart) {
        myChart = this.$echarts.init(document.getElementById("myChart003"));
      }
      myChart.resize({ height: this.heightchart3 + "px" });
      myChart.clear();
      myChart.setOption(option, true);
    },
    redirectTolocal(data, ck) {
      this.$parent.$refs.cpv.scrollTo(0, 0);
      this.setLocalLan({ localLan: data[0] });
      this.total="**";
      var myChart1 = this.$echarts.getInstanceByDom(
        document.getElementById("myChart001")
      );
      if (myChart1) {
        myChart1.clear();
      }

      var myChart2 = this.$echarts.getInstanceByDom(
        document.getElementById("myChart002")
      );
      if (myChart2) {
        myChart2.clear();
      }
      var myChart3 = this.$echarts.getInstanceByDom(
        document.getElementById("myChart003")
      );
      if (myChart3) {
        myChart3.clear();
      }

      if ("2" == ck) {
        this.setTitle({ title: data[2], ck: ck });
        this.localflag = true;
        this.heightchart3 = 300;
        this.loadpart02();
        this.func("this.dataop04", "this.drawchart004", "this.dataop04");
        this.func("this.dataop05", "this.drawchart005", "this.dataop05");
        this.func("this.dataop06", "this.drawchart006", "this.dataop06");
      } else if ("1" == ck) {
        this.setTitle({ title: "全省", ck: "1" });
        this.localflag = false;
        this.heightchart3 = 600;
        this.loadpart01();
        this.func("this.dataop01", "this.drawchart001", "this.dataop01");
        this.func("this.dataop02", "this.drawchart002", "this.dataop02");
        this.func("this.dataop03", "this.drawchart003", "this.dataop03");
      }
      //重新渲染
    },
    tabchange(name, title) {
      this.$parent.$refs.cpv.scrollTop = 340;
      this.func("this.dataop05", "this.drawchart005", "this.dataop05");
      this.func("this.dataop06", "this.drawchart006", "this.dataop06");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
