import {Injectable, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpErrorResponse,
    HttpSentEvent,
    HttpHeaderResponse,
    HttpProgressEvent,
    HttpResponse,
    HttpUserEvent, HttpParams, HttpHeaders,
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {mergeMap, catchError} from 'rxjs/operators';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {environment} from '@env/environment';
import {Md5} from 'ts-md5';
import {UserService} from '../../routes/service/user.service';
import {UserAddModalComponent} from '../../routes/system/user/user.add';
import {AuditModalComponent} from '@core/net/audit';
import {RoleMenu} from '../../routes/entity/role-menu';
import {EventService} from "@shared/event/event.service";

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    errorTime = 0;

    constructor(private injector: Injector, private message: NzMessageService, private userService: UserService, private modalSrv: NzModalService, private eventService: EventService, protected http: _HttpClient) {
    }

    get msg(): NzMessageService {
        return this.injector.get(NzMessageService);
    }

    private goTo(url: string) {
        setTimeout(() => this.injector.get(Router).navigateByUrl(url));
    }

    private handleData(
        event: HttpResponse<any> | HttpErrorResponse,
    ): Observable<any> {
        // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
        this.injector.get(_HttpClient).end();
        // 业务处理：一些通用操作
        switch (event.status) {
            case 200:
                if (event instanceof HttpResponse) {
                    const body: any = event.body;
                    if (body && body.code == 500) {
                        this.msg.error(body.msg);
                    }
                }
                // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
                // 例如响应内容：
                //  错误内容：{ status: 1, msg: '非法参数' }
                //  正确内容：{ status: 0, response: {  } }
                // 则以下代码片断可直接适用
                // if (event instanceof HttpResponse) {
                //     const body: any = event.body;
                //     if (body && body.status !== 0) {
                //         this.msg.error(body.msg);
                //         // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
                //         // this.http.get('/').subscribe() 并不会触发
                //         return throwError({});
                //     } else {
                //         // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
                //         return of(new HttpResponse(Object.assign(event, { body: body.response })));
                //         // 或者依然保持完整的格式
                //         return of(event);
                //     }
                // }
                break;
            case 400: {
                // 令牌为空
                this.showErrorMessage('令牌为空');
                this.goTo('/passport/login');
                break;
            }
            case 401:
                // 令牌失效
                this.showErrorMessage('令牌失效');
                this.goTo('/passport/login');
                break;
            case 402:
                // 令牌失效
                // this.showErrorMessage("账户或密码错误, 请检查");
                if (event instanceof HttpErrorResponse) {
                    this.msg.error(event.error['msg']);
                }
                // this.goTo('/passport/login');
                break;
            case 403:
            case 404:
            case 500:
                if (event instanceof HttpErrorResponse) {
                    console.warn(
                        '未可知错误，大部分是由于后端不支持CORS或无效配置引起',
                        event,
                    );
                    const message = event.error;
                    try {
                        this.msg.error(event.error['msg'] || event.error['message'] || "未知错误，请联系管理员");
                    } catch (e) {
                        this.msg.error("未知错误，请联系管理员");
                    }
                }
                break;
            default:
                if (event instanceof HttpErrorResponse) {
                    console.warn(
                        '未可知错误，大部分是由于后端不支持CORS或无效配置引起',
                        event,
                    );
                    this.msg.error(event.message);
                }
                break;
        }
        return of(event);
    }

    showErrorMessage(message: string) {
        const now = new Date().valueOf();
        // 防止多次提示
        if (now - this.errorTime > 2 * 1000) {
            this.errorTime = now;
            this.msg.error(message);
        }
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<| HttpSentEvent
        | HttpHeaderResponse
        | HttpProgressEvent
        | HttpResponse<any>
        | HttpUserEvent<any>> {
        // 统一加上服务端前缀
        let url = req.url;
        if (!url.startsWith('https://') && !url.startsWith('http://')) {
            url = environment.SERVER_URL + url;
        }
        //判断浏览器
        let isFireFox = navigator.userAgent.indexOf("Firefox") > -1;
        ;
        //请求url是否已替换
        if (isFireFox && url.indexOf('localhost') != -1) {
            const data = require('assets/localConfig-' + environment.programId + '.json')
            const baseUrl = data['__url']
            environment['__url'] = baseUrl
            url = url.replace('https://localhost:8090', baseUrl)
            console.log('替换完localhost的url', url)
        }
        //替换请求中无法识别的竖线
        isFireFox ? url = url.replace(/\|/g, '%7C') : ''
        //// url 参数加密开始
        let params: HttpParams = req.params;
        params = params.set('_timestamp', new Date().getTime().toString());
        let paramStr = '';

        if (url.indexOf('?') >= 0) {
            const urlParamStr = url.substring(url.indexOf('?') + 1);
            const urlParams: string[] = urlParamStr.split('&');
            urlParams.forEach((urlParam) => {
                const strs: string[] = urlParam.split('=');
                // params = params.set(strs[0], strs[1]);
                const key = strs.shift()
                const value = strs.join('')
                params = params.set(key, value);
            });
            url = url.substring(0, url.indexOf('?'));
        }
        const keyList = params.keys();
        keyList.sort();
        keyList.forEach((value, index, array) => {
            paramStr = paramStr + value + '=' + params.get(value) + '&';
        });
        if (paramStr.length > 0) {
            paramStr = paramStr.substr(0, paramStr.length - 1);
        }
        const encrypted = Md5.hashStr(this.userService.encryptedDES(paramStr));

        params = params.set('_signature', encrypted + '');

        //// url 参数加密end


        // 授权弹框
        // 0不用审核  1同步审核  2异步审核
        const roleMenuList: RoleMenu[] = this.userService.getRoleMenuList();
        let tempUrl = url;
        if (tempUrl.startsWith('https://')) {
            tempUrl = tempUrl.substring(8, tempUrl.length);
        } else if (tempUrl.startsWith('http://')) {
            tempUrl = tempUrl.substring(7, tempUrl.length);
        }
        const postion = tempUrl.indexOf('/');
        tempUrl = tempUrl.substring(postion, tempUrl.length);
        if (roleMenuList != null && roleMenuList != undefined) {
            for (let i = 0; i < roleMenuList.length; i++) {
                const roleMenu = roleMenuList[i];
                if (roleMenu.url == null || roleMenu.url == undefined) {
                    continue;
                }
                // 地址相同
                if (req.method == roleMenu.method && (tempUrl == roleMenu.url || (roleMenu.url.indexOf('{id}') > 0 && tempUrl.substring(0, tempUrl.lastIndexOf('/')) + '/{id}' == roleMenu.url))) {
                    // 并且有需要审核的功能  1同步审核
                    if (roleMenu.approveFlag == 1) {
                        // 寻找对应的审批
                        for (let z = 0; z < roleMenuList.length; z++) {
                            let roleMenu1 = roleMenuList[z];
                            if (roleMenu1.perms != null && roleMenu1.perms.endsWith(roleMenu.perms) && z != i) {
                                const modal = this.modalSrv.create({
                                    nzTitle: '请选择审核人',
                                    nzContent: AuditModalComponent,
                                    nzComponentParams: {
                                        'req': req,
                                        'perms': roleMenu.perms,
                                        'approveFlag': 1
                                    },
                                    nzFooter: null
                                });
                                return new Observable();
                            }
                        }

                    } else if (roleMenu.approveFlag == 2) {
                        //异步审核
                        this.asynchronousAudit(req, roleMenu.perms, 2);
                        return new Observable();
                    }
                }
            }
        }


        const newReq = req.clone({
            url: url,
            params: params,
        });

        return next.handle(newReq).pipe(
            mergeMap((event: any) => {
                // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
                if (event instanceof HttpResponse && event.status === 200)
                    return this.handleData(event);
                // 若一切都正常，则后续操作
                return of(event);
            }),
            catchError((err: HttpErrorResponse) => this.handleData(err)),
        );
    }


    asynchronousAudit(req: HttpRequest<any>, perms: string, approveFlag: number) {
        let url = environment.manage_server_url + '/rest/approve/';


        //// url 参数加密开始
        let params: HttpParams = req.params;
        // params = params.set("_timestamp",new Date().getTime().toString())
        let paramStr = '';
        let uri: string = req.url;

        if (req.url.indexOf('?') >= 0) {
            const urlParamStr = req.url.substring(req.url.indexOf('?') + 1);
            const urlParams: string[] = urlParamStr.split('&');
            urlParams.forEach((urlParam) => {
                const strs: string[] = urlParam.split('=');
                params = params.set(strs[0], strs[1]);
            });
            uri = req.url.substring(0, req.url.indexOf('?'));
        }
        const keyList = params.keys();
        keyList.sort();
        keyList.forEach((value, index, array) => {
            paramStr = paramStr + value + '=' + params.get(value) + '&';
        });
        if (paramStr.length > 0) {
            paramStr = paramStr.substr(0, paramStr.length - 1);
        }
        // let encrypted = Md5.hashStr(this.userService.encryptedDES(paramStr));

        // params = params.set("_signature",encrypted+"");

        //// url 参数加密end


        const method: string = req.method;
        let objectIds = '';
        if ('PUT' == method || "DELETE" == method) {
            if (req.url.indexOf('?') > 0) {
                objectIds = req.url.substring(req.url.lastIndexOf('/') + 1, req.url.indexOf('?'));
            } else {
                objectIds = req.url.substring(req.url.lastIndexOf('/') + 1, req.url.length);
            }

        }

        const keys: string[] = params.keys();
        let tempParams = '';
        for (let i = 0; i < keys.length; i++) {
            tempParams = tempParams + keys[i] + '=' + params.get(keys[i]) + '&';
            if (keys[i] == "id") {
                objectIds = params.get(keys[i]);
            }
            if ('DELETE' == method && keys[i] == 'ids') {
                objectIds += 'ids=' + params.get(keys[i]) + '&';
            }
        }
        if (tempParams.length > 0) {
            tempParams = tempParams.substring(0, tempParams.length - 1);
            //objectIds = objectIds.substring(0, objectIds.length - 1);
        }

        url = url + '?objectIds=' + objectIds;
        url = url + '&perms=' + perms;
        url = url + '&method=' + req.method;
        url = url + '&approveType=' + approveFlag;
        url = url + '&uri=' + uri;
        paramStr = paramStr.replace(/=/g, ",");
        paramStr = paramStr.replace(/&/g, ";");
        url = url + '&params=' + paramStr;
        // url = url + '&approveUserId=' + value.auditUser;
        //  url = url + '&authParam=' + Md5.hashStr(this.userService.encryptedDES(value.password));

        // console.log(thnotify.show-st.modal.ts.NotifyShowTableModalComponent.htmlis.req)
        // value.perms = this.perms;

        // value.objectIds = objectIds
        this.http.post(url, req.body).subscribe((res: any) => {
            if (res != null && res.code == 0) {
                this.message.success("提交成功")
                this.eventService.emit('auditSubmitOk');
            } else {
                this.msg.error(res.msg)
            }
        }, (res: any) => {
        });

    }

}
