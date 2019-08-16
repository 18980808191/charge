const Mock = require('mockjs') // 获取mock对象
const domain = 'http://localhost:8080/charge' // 定义默认域名，随便写
Mock.domain=domain;
// Mock.mock(domain+'/user/auth03280857', 'post', require('./json/user'));

// Mock.mock(domain+'/schedule/overProvince', 'post', require('./json/schedule01'));

// Mock.mock(domain+'/schedule/localLan', 'post', require('./json/schedule02'));
// Mock.mock(domain+'/schedule/localLanDetail', 'post', require('./json/schedule03'));

// Mock.mock(domain+'/income/provinceThreeMonth', 'post', require('./json/op01'));

// Mock.mock(domain+'/income/items', 'post', require('./json/op02'));

// Mock.mock(domain+'/income/ranks', 'post', require('./json/op03'));

// Mock.mock(domain+'/income/lanTrendsThreeMonth', 'post', require('./json/op04'));

// Mock.mock(domain+'/income/teletrafficTrendsMonth', 'post', require('./json/op05'));

// Mock.mock(domain+'/income/detailListTrendsMonth', 'post', require('./json/op05'));

// Mock.mock(domain+'/income/this', 'post', require('./json/opall'));
export default Mock;