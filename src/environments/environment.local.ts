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
//     file_server_url: 'http://192.168.0.115:8098/file'
//
//     // runtime_server_url:'http://192.168.0.115:8220/view-engine/runtime',
//     // busi_server_url:'http://192.168.0.115:8082/sys',
//     // gatway_server_url:'http://192.168.0.115:8082',
//     // manage_server_url:'http://192.168.0.115:8082/'
// };

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const environment = {
  SERVER_URL: `./`,
  production: true,
  useHash: true,
  hmr: false,
  //runtime_server_url: 'http://192.168.10.101:8220/view-engine/runtime',
  // common_crud_url: 'http://192.168.1.101:8220/rest/common',
  // common_crud_url: 'http://192.168.0.115:8090/engine/rest/common',
  common_crud_url: 'http://127.0.0.1:8090/engine/rest/common',
  // runtime_server_url:'http://192.168.1.101:8220/view-engine/runtime',
  // runtime_server_url:'http://192.168.0.115:8090/engine/view-engine/runtime',
  runtime_server_url:'http://127.0.0.1:8090/engine/view-engine/runtime',
//    busi_server_url:'http://192.168.10.188:8203/manage/sys',
//     gateway_server_url: 'http://192.168.1.105:8090',
//     gateway_server_url: 'http://192.168.0.115:8090',
  gateway_server_url: 'http://127.0.0.1:8090',
  // manage_server_url: 'http://192.168.1.105:8090/manage',
  // manage_server_url: 'http://192.168.0.115:8090/manage',
  manage_server_url: 'http://127.0.0.1:8090/manage',
  //  trade_server_url: 'http://192.168.10.188:8080/busi/logrt',

  // cis_server_url: 'http://192.168.1.111:8204/busi',
  // cis_server_url: 'http://192.168.0.115:8204/busi',
  cis_server_url: 'http://127.0.0.1:15672/busi',

  // hall_manager_server_url: 'http://192.168.10.111:8203/busi',
  hall_manager_server_url: 'http://127.0.0.1:8203/busi',

  // hall_server_url:'http://192.168.1.111:8203/busi',
  hall_server_url:'http://127.0.0.1:8203/busi',

  // file_server_url: 'http://192.168.10.188:8098/file'
  // file_server_url:'http://192.168.1.105:8090/file/file'
  file_server_url:'http://127.0.0.1:8090/zuul/file/file',

  file_download_server_url:'http://127.0.0.1:8090/file/file/download?filename='
  // runtime_server_url:'http://192.168.0.115:8220/view-engine/runtime',
  // busi_server_url:'http://192.168.0.115:8082/sys',
  // gatway_server_url:'http://192.168.0.115:8082',
  // manage_server_url:'http://192.168.0.115:8082/'
};