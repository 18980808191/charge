<template>
  <div>
    <div
      id="myChart01"
      :style="{width: '100%', height: '300px'}"
    ></div>
    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 15px' }"></van-divider>
    <div
      id="myChart02"
      :style="{width: '100%', height: '600px'}"
    ></div>
    <van-popup
      v-model="popupshow"
      :overlay="false"
      position="right"
      :style="{marginBottom:'50px' }"
    >
      <van-panel
        :title="regionName"
        status="状态"
        style="border:1px solid green;"
      >
        <div>
          <van-steps
            :active="stepsactive1"
            direction="vertical"
          >
            <van-step>{{flowName1}}<van-tag type="success">{{flowValue1}}</van-tag></van-step>
            <van-step>{{flowName2}}<van-tag type="success">{{flowValue2}}</van-tag></van-step>
            <van-step>{{flowName3}}<van-tag type="success">{{flowValue3}}</van-tag></van-step>
          </van-steps>
          <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 15px' }"></van-divider>
          <van-steps
            :active="stepsactive2"
            direction="vertical"
          >
            <van-step>{{flowName4}}<van-tag type="success">{{flowValue4}}</van-tag></van-step>
            <van-step>{{flowName5}}<van-tag type="success">{{flowValue5}}</van-tag></van-step>
          </van-steps>
        </div>
        <div slot="footer">
          <van-button
            size="small"
            type="danger"
            @click="shutdownpopup"
          >关闭</van-button>
        </div>
      </van-panel>
    </van-popup>
  </div>
</template>

<script>
//import {mapGetters,mapState,mapActions} from 'vuex';
import { mapState,mapActions } from "vuex";
export default {
  name: "OverAll",
  data() {
    return {
      schedule01:undefined,
      failtime:20,
      schedule02:undefined,
      popupshow: false,
      stepsactive1: -1,
      stepsactive2: -1,
      regionName: "",
      flowValue1:"",
      flowValue2:"",
      flowValue3:"",
      flowValue4:"",
      flowValue5:"",
      flowName1:"",
      flowName2:"",
      flowName3:"",
      flowName4:"",
      flowName5:""
    };
  },
  computed:{
    ...mapState(["userId"])
  },
  created(){
    if (this.userId == "") {
      this.$router.push("/login");
    }else{
      var _this=this;
      this.$fly.post(this.$api.scheduleOverProvince)
      .then(function (response) {
        if(response.status==200){
          _this.schedule01=response.data;
        }
      });
      this.$fly.post(this.$api.scheduleLocalLan)
      .then(function (response) {
        if(response.status==200){
          _this.schedule02=response.data;
        }
      })
    }
  },
  mounted() {
    if (this.userId == "") {
      return;
    }
    this.setTitle({ title: "进度", ck: "1" });
    this.func('this.schedule01',"this.drawchart01",'this.schedule01');
    this.func('this.schedule02',"this.drawchart02",'this.schedule02');
  },
  methods: {
    ...mapActions(["setTitle"]),
    getLastMonth(){
    var date = new Date; 
    var year = date.getFullYear();
    var month = date.getMonth();
    if(month == 0){
         year = year -1;
         month = 12; 
    }
    return year+"年"+month+"月";
},
    func(a,b,c){
      var _this=this;
      var abc=eval(a);
      if(!eval(a)){
        if(_this.failtime>0){
          setTimeout(function(){_this.func(a,b,c)}, 300);
          _this.failtime--;
        }
        
      }else{
        eval(b+"("+c+");");
      }
    },
    drawchart01(rate){
      let myChart = this.$echarts.init(document.getElementById("myChart01"));
      let option = {
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%"
        },
        title: {
          text: this.getLastMonth()+"出账总进度",
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
    drawchart02: function(ob) {
     
      let tpob=[];
      for(let item of ob){
        let am=[item.regionId,item.schedule,item.regionName];
        tpob.unshift(am);       
      }
      tpob.unshift(['regionId','schedule','regionName']);
      let myChart = this.$echarts.init(document.getElementById("myChart02"),{width:'70%'});
      let option = {
        title: {
          text: "本地网进度排名"
        },
        dataset: {
          source: tpob
        },
        grid: { containLabel: true },
        xAxis: { name: "amount" },
        yAxis: { type: "category" },
        series: [
          {
            type: "bar",
            encode: {
              // Map the "amount" column to X axis.
              x: "schedule",
              // Map the "product" column to Y axis
              y: "regionName"
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: "right",
                  formatter: function(value) {
                    return value.data[1] + "%";
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

      myChart.setOption(option, true);
      let _this = this;
      myChart.on("click", function(param) {
        _this.popup(param.data);
      });
    },
    popup: function(data) {
      this.popupshow = false;
      this.flowValue1="";
      this.flowValue2="";
      this.flowValue3="";
      this.flowValue4="";
      this.flowValue5="";
      this.flowName1="";
      this.flowName2="";
      this.flowName3="";
      this.flowName4="";
      this.flowName5="";
      this.regionName = data[2];
      var _this=this;
      this.$fly.post(this.$api.scheduleLocalLanDetail,{localLan:data[0]})
      .then(function (response) {
        if(response.status==200){
          for(var i=0;i<response.data.length;i++){
            eval('_this.flowName'+(i-0+1)+'=response.data[i].flowName');
            eval('_this.flowValue'+(i-0+1)+'=response.data[i].flowValue+"%";');
          }
          _this.popupshow = true;
        }
      })

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
