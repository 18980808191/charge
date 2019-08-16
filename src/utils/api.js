const baseUrl = ''//---开发调试环境
//export const baseUrlApi = 'https://test.mini.com'//---测试环境https
//export const baseUrlApi = 'https://product.mini.com'//---生产环境https
const api={
    login:baseUrl+"/user/auth",
    logintemp:baseUrl+"/user/auth03280857",
    scheduleOverProvince:baseUrl+"/schedule/overProvince",
    scheduleLocalLan:baseUrl+"/schedule/localLan",
    scheduleLocalLanDetail:baseUrl+"/schedule/localLanDetail",

    incomeThis:baseUrl+"/income/this",
    incomeProvinceThreeMonth:baseUrl+"/income/provinceThreeMonth",
    incomeItems:baseUrl+"/income/items",
    incomeRanks:baseUrl+"/income/ranks",
    incomeLanTrendsThreeMonth:baseUrl+"/income/lanTrendsThreeMonth",
    incomeTeletrafficTrendsMonth:baseUrl+"/income/teletrafficTrendsMonth",
    incomeDetailListTrendsMonth:baseUrl+"/income/detailListTrendsMonth",

}

export default api