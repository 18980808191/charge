import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible'
import { Tabbar, TabbarItem } from 'vant';
import { NavBar } from 'vant';
import { Divider } from 'vant';
import { Step, Steps } from 'vant';
import { Popup } from 'vant';
import { Panel } from 'vant';
import { Button } from 'vant';
import { NoticeBar } from 'vant';
import { Toast } from 'vant';
import { Tab, Tabs } from 'vant';
import { Loading } from 'vant';
import { Icon } from 'vant';
import { Tag } from 'vant';
import {Collapse, CollapseItem,Row,Col} from 'vant';
Vue.use(Tag).use(Row).use(Col);;
Vue.use(Icon).use(Loading).use(Tab).use(Tabs).use(Toast).use(NoticeBar).use(Button).use(Panel);
Vue.use(Popup).use(Step).use(Steps).use(Divider).use(NavBar).use(Tabbar).use(TabbarItem).use(Collapse).use(CollapseItem);
// 添加Fastclick移除移动端点击延迟
import FastClick from 'fastclick'
//FastClick的ios点击穿透解决方案
FastClick.prototype.focus = function (targetElement) {
    let length;
    if (targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
        length = targetElement.value.length;
        targetElement.focus();
        targetElement.setSelectionRange(length, length);
    } else {
        targetElement.focus();
    }
};

FastClick.attach(document.body);

Vue.config.productionTip = false

var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
require('echarts/lib/chart/gauge');
require('echarts/lib/chart/line');
require('echarts/lib/chart/pie');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require("echarts/lib/component/legend");
Vue.prototype.$echarts = echarts;
Vue.prototype.$Toast = Toast;
import fly from "./utils/fly";
import api from "./utils/api";
import areacode from "./utils/areacode";
import itemname from "./utils/itemname";
Vue.prototype.$fly = fly;
Vue.prototype.$api = api;
Vue.prototype.$itemname = itemname;
Vue.prototype.$areacode = areacode;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
