const Mock = require('mockjs') // 获取mock对象
const domain = 'http://localhost:8080/charge' // 定义默认域名，随便写
Mock.domain=domain;
Mock.mock(domain+'/login', 'post', require('./json/user'));

Mock.mock(domain+'/schedule01', 'post', require('./json/schedule01'));

Mock.mock(domain+'/schedule02', 'post', require('./json/schedule02'));

Mock.mock(domain+'/op01', 'post', require('./json/op01'));

Mock.mock(domain+'/op02', 'post', require('./json/op02'));

Mock.mock(domain+'/op03', 'post', require('./json/op03'));

Mock.mock(domain+'/op04', 'post', require('./json/op04'));

Mock.mock(domain+'/op05', 'post', require('./json/op05'));

Mock.mock(domain+'/op06', 'post', require('./json/op05'));

Mock.mock(domain+'/opall', 'post', require('./json/opall'));

Mock.mock(domain+'/oplocalall', 'post', require('./json/oplocalall'));
export default Mock;