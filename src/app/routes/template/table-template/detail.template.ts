import {Component, Input, ViewChild} from '@angular/core';
import {CascaderOption, NzDrawerRef, NzTreeNode} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {CascaderWidget, SFComponent, SFSchema, SFSchemaEnumType} from '@delon/form';
import {environment} from '@env/environment';
import {catchError} from 'rxjs/operators';
@Component({
    selector: `app-table-detail-modal`,
    template: `
        <!--<div class="modal-header">-->
        <!--<div class="modal-title">{{record.__title}}</div>-->
        <!--</div>-->
        <sf #sf [schema]="detailSchema" [formData]="record" button="none" >
        </sf>`,
})
export class TableDetailDrawerComponent {
    @Input()
    record: any;
    id = '';
    initUri = '';
    detailSchema: any = {
        properties: {
            id: {
                type: 'string',
                title: 'id',
                maxLength: 32
            }
        }
    };
    @ViewChild('sf', { static: false })
    sf: SFComponent;

    constructor(private ref: NzDrawerRef, protected http: _HttpClient) {
    }

    save(value: any) {
        console.log(JSON.stringify(value));
        this.ref.close(`new time: ${+new Date()}`);
        this.close();
    }

    genForm() {

        this.http.get(environment.runtime_server_url + '/table/detail/' + this.id).subscribe((res: any) => {
            this.initUri = res.initUri;
            let url;
            if (this.initUri != null && this.initUri != '') {
                url = environment.gateway_server_url + this.initUri + '/' + this.record['id'];
            } else {
                url = environment.common_crud_url + '/' + this.id + '/' + this.record['__id'];
            }
            this.http.get(url).subscribe((res1: any) => {
                this.record = res1;
                this.getFormHandle(res);
            });
        });

    }


    getFormHandle(res: any) {
        if (res.initFunction != null && res.initFunction != '') {
            const tempRecord = this.record;
            eval(res.initFunction);
        }
        const dataSources = res['dataSource'];
        const properties = {};
        for (const object of res['editField']) {
            const data = object['config'];
            let key = object['key'];
            if (dataSources != null && dataSources[key] != null) {
                data['enum'] = dataSources[key];
            }
            if( object['display']!= null && object['display'].indexOf('detail') > 0){
                const display = JSON.parse(object['display'])
                data['ui'] == null?data['ui'] = { hidden:!display['detail'] }:data['ui']['hidden'] = !display['detail'];
            }
            data['readOnly'] = true;
            if (data['ui'] != null) {
                const ui = data['ui'];
                if (ui['widget'] == 'upload') {

                    key = data['ui']['fileName'];
                    object['relate'] =  data['ui']['fileName'];
                    data['ui'] = null;
                    // continue;
                    // data['enum'] = [{
                    //     'name': this.record[ui['fileName']],
                    //     'status': 'done',
                    //     'url': environment.file_server_url + this.record[key],
                    //     'response': {'uid': 1}
                    // }];
                }
                if (ui['asyncData'] != null && ui['mate'] != null) {
                    let uri: string = ui['asyncData'];
                    const mate = ui['mate'];
                    const param = ui['params'];
                    if (!uri.startsWith('http')) {
                        uri = environment.gateway_server_url + uri;

                        while (uri.indexOf("{{") > 0 && uri.indexOf("}}") > 0) {
                            let i = uri.indexOf("{{");
                            let j = uri.indexOf("}}");
                            if (j > i) {
                                let key = uri.substring(i + 2, j);
                                uri = uri.replace("{{" + key + "}}", this.record[key]);
                            }
                        }
                    }
                    ui['asyncData'] = () => this.http.get<SFSchemaEnumType[]>(uri, {
                        mate: JSON.stringify(mate),
                        params: param
                    });

                }

                if (ui['asyncData'] && ui['widget'] == 'cascader') {
                    const asyncDataUrl =  ui['asyncData'];
                    const url = environment.gateway_server_url + asyncDataUrl;
                    ui['asyncData'] = () => this.http.get(url);
                }

                if(data['ui'] !=null){
                    data['ui'] = ui;
                }
            }

            if (data['type'] != null && data['type'] == 'object') {
                const properties = data['properties'];
                for (const key1 in properties) {
                    if (properties[key1]['ui']['action'] != null) {
                        const url = environment.gateway_server_url + properties[key1]['ui']['action'];
                        const mate = properties[key1]['ui']['mate'];
                        const param = properties[key1]['ui']['params'];
                        this.http.get(url, {
                            mate: JSON.stringify(mate),
                            params: param
                        }).subscribe((res: any) => {
                            console.log(res);
                            properties[key1]['enum'] = res;
                            this.sf.refreshSchema();
                        });

                    }
                }

            }

            // 扩展
            if (data['items']) {
                const items = data['items'];
                console.log('items----->');
                const properties = items['properties'];
                if (properties) {
                    // 遍历key value
                    for (const key1 in properties) {
                        const label = properties[key1];
                        if (label) {
                            const ui = label['ui'];
                            if (ui['asyncData'] != null && ui['mate'] != null) {
                                let uri: string = ui['asyncData'];
                                const mate = ui['mate'];
                                const param = ui['params'];
                                if (!uri.startsWith('http')) {
                                    uri = environment.gateway_server_url + uri;
                                }
                                ui['asyncData'] = () => this.http.get<SFSchemaEnumType[]>(uri, {
                                    mate: JSON.stringify(mate),
                                    params: param
                                });
                            }
                            if (ui['displayWith'] != null) {
                                const display = ui['displayWith'];
                                ui['displayWith'] = (node: NzTreeNode) => node[display];
                            }
                            label['ui'] = ui;
                        }
                    }


                }
            }
            properties[key] = data;
        }
        let ui = {
            spanLabel: 7,
            spanControl: 17,
            width:500
        };

        console.log("edit properties: " + JSON.stringify(properties));

        for (let parseKey in properties) {
            if (properties[parseKey]["type"] != undefined && properties[parseKey]["type"] == "object") {
                for (let j in properties[parseKey]["properties"]) {
                    properties[parseKey]["properties"][j].readOnly = true;
                    let recordElement = null;
                    try{
                        recordElement = JSON.parse(this.record[parseKey]);
                    }catch (e) {

                    }
                    if (recordElement != null && recordElement != undefined && recordElement != "") {
                        properties[parseKey]["properties"][j]["default"] = recordElement[j];
                    }
                }
            }
        }
        this.detailSchema = {
            properties: properties, ui
        };
    }

    close() {
        this.ref.close();
    }

    ngOnInit() {
        this.id = this.record.__entity;
        this.genForm();
    }
}
