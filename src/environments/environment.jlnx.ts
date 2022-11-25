// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
//
// export const environment = {
//     SERVER_URL: `./`,
//     production: true,
//     useHash: true,
//     hmr: false,
//     //runtime_server_url: 'http://192.168.10.101:8220/view-engine/runtime',
//     common_crud_url: 'http://192.168.10.103:8220/rest/common',
//
//     runtime_server_url:'http://192.168.10.103:8220/view-engine/runtime',
// //    busi_server_url:'http://192.168.10.188:8203/manage/sys',
//     gateway_server_url: 'http://192.168.10.188:7092',
//     manage_server_url: 'http://192.168.10.188:7092/manage',
//   //  trade_server_url: 'http://192.168.10.188:8080/busi/logrt',
//
//     cis_server_url: 'http://192.168.10.188:8204/busi',
//     hall_manager_server_url: 'http://192.168.10.188:8203/busi',
//     hall_server_url:'http://192.168.10.188:8203/busi',
//     file_server_url: 'http://127.0.0.1:8098/file'
//
//     // runtime_server_url:'http://127.0.0.1:8220/view-engine/runtime',
//     // busi_server_url:'http://127.0.0.1:8082/sys',
//     // gatway_server_url:'http://127.0.0.1:8082',
//     // manage_server_url:'http://127.0.0.1:8082/'
// };

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
import {project} from "@env/environment.base";
export const environment = {
    SERVER_URL: `./`,
    production: true,
    useHash: true,
    hmr: false,
    common_crud_url: project.baseUrl+'/engine/rest/common',
    runtime_server_url:project.baseUrl+'/engine/view-engine/runtime',
    gateway_server_url: project.baseUrl+'',
    manage_server_url: project.baseUrl+'/manage',
    cis_server_url: project.baseUrl+'/busi',
    hall_manager_server_url: project.baseUrl+'/busi',
    hall_server_url:project.baseUrl+'/busi',
    file_server_url:project.baseUrl+'/zuul/file/file',
    file_download_server_url:project.baseUrl+'/file/file/download?filename=',

    //标准版
    programName:'自助设备运营管理系统',
    loginImage:'url(\'/assets/images/jiling-background-logo.gif\')',
    loginBg:'/assets/images/loginBg.png',//吉林登录输入框背景图
    loginHome:'home',
    logoFullImage:'./assets/jiling-logo.png',//吉林logo
    //logoFullImage:'./assets/luzhou-logo.png',//泸州logo
    headerBg:'url(\'/assets/images/headerbg.png\')',//吉林头部背景
    programId:'jlnx',
    showLogo:false,//是否显示登录页的logo
    smallLogo:'/assets/jiling_small_logo.png',//吉林小logo
    titleImg:'/assets/jiling_title_img.png',//吉林title图标
    gif:'/assets/images/jilingGif.gif',//吉林登录gif动图
    monitor_table:true,
    trade_monitor:true,//交易监控页面是否显示交易记录控件
    clickType:1,//控制所属机构单击或双击选中，0：单击，1：双击
    sessionLogin: true //开启sessionStorage保存用户登录信息
};
