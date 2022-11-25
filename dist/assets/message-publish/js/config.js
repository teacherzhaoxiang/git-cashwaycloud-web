var URL = '';
//var URL = 'http://114.116.120.8:8090';
$.ajax({
    url: '../localConfig-xjnx.json',
    async: false,
    success: function (data) {
        URL = data.__url;
        console.log(data.__url);
    },
    error: (function (err) {
        console.log(err);
    })()
});
var showWeather = true; //true:开启天气   false:隐藏天气
//var token = "eyJhbGciOiJIUzI1NiJ9.eyJyYW5kb21LZXkiOiJjZmRhM2JlZjFmN2YyZmRlOGRjNzA1NDgwMTZjOTFlYiIsImF1ZCI6IjEiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTYxMjMxNDA0MSwidXNlclJvbGVMaXN0IjoiW1wiMVwiXSIsImlhdCI6MTYxMTcwOTI0MX0.KdW-cSY1kUV4IzThU_7SC5ET9Xmfip49zv1UbAi_Pcg";
var native_url = 'file:///sdcard/CashwayAd';
