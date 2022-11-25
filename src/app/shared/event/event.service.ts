import {Injectable, Injector, Inject, EventEmitter, ModuleWithProviders} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {Subscription, zip} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
    MenuService,
    SettingsService,
    TitleService,
    ALAIN_I18N_TOKEN,
} from '@delon/theme';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import {environment} from '@env/environment';
/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class EventService {
    loading = false;
    static formValueSetType = 'formValueSet';

    eventEmitter: EventEmitter<any> = new EventEmitter();

    subscribe(callback: Function, component: any) {
        let result:Subscription = this.eventEmitter.subscribe(
            _event => {
                callback.call(this, _event, component);
            }
        );
        return result;
    }

    emitByType(eventType, value) {
        this.eventEmitter.emit({eventType: eventType, value: value});
    }

    emit(value) {
        this.eventEmitter.emit(value);
    }

    unsubscribe(obj){
        console.log(23232);
        // this.eventEmitter.observers = this.eventEmitter.observers.filter(function(item) {
        //     return item != obj
        // });
        console.log(this.eventEmitter.observers);
        for(let i=0;i<this.eventEmitter.observers.length;i++){
            let eventEmitterObj = this.eventEmitter.observers[i];
            if(obj === eventEmitterObj){
                this.eventEmitter.observers.splice(i,1)
                console.log("939434838");
            }
        }
    }
}
