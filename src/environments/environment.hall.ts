// file can be replaced during build by using the `fileReplacements` array.
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
//     file_server_url: 'http://172.20.10.3:8098/file'
//
//     // runtime_server_url:'http://172.20.10.3:8220/view-engine/runtime',
//     // busi_server_url:'http://172.20.10.3:8082/sys',
//     // gatway_server_url:'http://172.20.10.3:8082',
//     // manage_server_url:'http://172.20.10.3:8082/'
// };

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


import {project} from '@env/environment.base';

export const environment = {
    SERVER_URL: `./`,
    production: true,
    useHash: true,
    hmr: false,
    // project.baseUrl:'http://172.20.10.3:8090',
    // runtime_server_url: 'http://192.168.10.101:8220/view-engine/runtime',
    // common_crud_url: 'http://192.168.1.101:8220/rest/common',
    // common_crud_url: 'http://192.168.2.235:8090/engine/rest/common',
    common_crud_url: project.baseUrl + '/engine/rest/common',
    // runtime_server_url:'http://192.168.1.101:8220/view-engine/runtime',
    // runtime_server_url:'http://192.168.2.235:8090/engine/view-engine/runtime',
    runtime_server_url: project.baseUrl + '/engine/view-engine/runtime',
//    busi_server_url:'http://192.168.10.188:8203/manage/sys',
//     gateway_server_url: 'http://192.168.1.105:8090',
//     gateway_server_url: 'http://192.168.2.235:8090',
    gateway_server_url: 'https://localhost:8090',
    // manage_server_url: 'http://192.168.1.105:8090/manage',
    // manage_server_url: 'http://192.168.2.235:8090/manage',
    manage_server_url: project.baseUrl + '/manage',
    //  trade_server_url: 'http://192.168.10.188:8080/busi/logrt',

    // cis_server_url: 'http://192.168.1.111:8204/busi',
    // cis_server_url: 'http://192.168.2.235:8204/busi',
    cis_server_url: project.baseUrl + '/busi',

    // hall_manager_server_url: 'http://192.168.10.111:8203/busi',
    hall_manager_server_url: project.baseUrl + '/busi',

    // hall_server_url:'http://192.168.1.111:8203/busi',
    hall_server_url: project.baseUrl + '/busi',

    // file_server_url: 'http://192.168.10.188:8098/file'
    // file_server_url:'http://192.168.1.105:8090/file/file'
    file_server_url: project.baseUrl + '/zuul/file/file',

    //log_path_url:project.baseUrl+'/manage/download?filename',
    log_path_url:project.baseUrl+'/manage/sys/getLog/download?path=',
    // log_path_url:project.baseUrl+'/zuul/manage/download?filename=',

    file_download_server_url: project.baseUrl + '/file/file/download?filename=',
    timeOut: '3000',
    // 标准版
    //  programName: '终端设备综合运营管理系统',   // 终端设备综合运营管理系统
    //  loginImage: 'url(\'/assets/images/login-background-operation-platform.gif\')',
    //  loginHome: 'home',
    //  logoFullImage: './assets/logo-full.png',
    // programId:'dev',
    // 卡管
    // programName:'制卡管理系统',
    // loginImage:' url(\'/assets/images/card-longin.png\')',
    // loginHome:'card-mange-home',
    // logoFullImage:'./assets/logo_full_nonghang_kaguan.png',

    // 厅堂管理
    programName:'信息发布系统',
    loginHome:'/template/image-message/hall%7Cpublish_screen_monitor_view',

    logoFullImage:'./assets/cashway.png',//厅堂管理logo
    showLogo:false,//是否显示登录页的logo
    loginBg:'/assets/images/loginBg.png',//吉林登录输入框背景图
    headerBg:'url(\'/assets/publish-headerbg.png\')',//吉林头部背景
    smallLogo:'/assets/hall-small-logo.png',//吉林小logo
    titleImg:'/assets/message-publish.png',//吉林title图标
    gif:'/assets/message-publish.gif',//吉林登录gif动图
    monitor_table:true,//是否显示设备监控搜索框上的table
    trade_monitor:true,//交易监控页面是否显示交易记录控件
    clickType:1,//控制所属机构单击或双击选中，0：单击，1：双击
    // logoFullImage:'./assets/luzhou-logo.png',//泸州logo
    // headerBg:'url(\'/assets/images/luzhouHeaderBg.gif\')',//泸州头
    // showLogo:true,//是否显示登录页的logo
    // loginBg:'/assets/images/luzhouLoginBg.png',//泸州登录输入框背景图
    // smallLogo:'/assets/luzhou_small_logo.png',//泸州小logo
    // titleImg:'/assets/luzhou_title_img.png',//泸州title图标
    // gif:'/assets/images/luzhouGif.gif',//泸州登录gif动图
    //monitor_table:false,//是否显示设备监控搜索框上的table，泸州不显示
    //trade_monitor:true,//交易监控页面是否显示交易记录控件
    programId:'hall',
    sessionLogin: true, //开启sessionStorage保存用户登录信息
  localhost: 'http://114.116.120.8:8090/atmc-manage'
};
