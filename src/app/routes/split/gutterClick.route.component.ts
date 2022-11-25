import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { cloneDeep } from 'lodash';

import { AComponent } from './AComponent';


interface IConfig {
    columns: Array<{
        visible: boolean,
        size: number,
        rows: Array<{
            visible: boolean,
            size: number,
            type: string
        }>
    }>
    disabled: boolean
}


const defaultConfig: IConfig = {
    columns: [
        {
            visible: true,
            size: 20,
            rows: [
                { visible: true, size: 100, type: 'A' }
            ]
        },
        {
            visible: true,
            size: 80,
            rows: [
                { visible: true, size: 100, type: 'D' }
            ]
        }
    ],
    disabled: false
};


@Component({
    selector: 'sp-ex-workspace-localstorage',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        :host {
            display: block;
            width: 100%;
            height: 100%;
        }
        .bloc {
            height: 100%;
        }

        .explanations {
            padding: 15px;
        }

        .panel {
            font-size: 100px;
            font-weight: bold;
            color: #cccccc;

            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            overflow: hidden;
        }
        .panel > p {
            margin: 0;
        }
        button {
            margin-bottom: 10px;
        }
    `],
    template: `
        <div style="height: 100%;width: 100%;display: block">
        <as-split *ngIf="config" 
               direction="horizontal"
               [disabled]="config.disabled"
               (dragEnd)="onDragEnd(-1, $event)">
            <ng-template ngFor let-column [ngForOf]="config.columns" let-icol="index">
                <as-split-area *ngIf="column.visible"
                            [order]="icol" 
                            [size]="column.size">
                    <as-split direction="vertical"
                           [disabled]="config.disabled"
                           (dragEnd)="onDragEnd(icol, $event)">
                        <ng-template ngFor let-row [ngForOf]="column.rows" let-irow="index">
                            <as-split-area *ngIf="row.visible"
                                        [order]="irow" 
                                        [size]="row.size">
                                <div [ngSwitch]="row.type" class="bloc">
                                    <div *ngSwitchDefault class="panel">
                                        <p>{{ row.type }}</p>
                                    </div>
                                </div>
                            </as-split-area>
                        </ng-template>
                    </as-split>
                </as-split-area>
            </ng-template>
        </as-split>
        </div>`
})
export class GutterClickComponent extends AComponent implements OnInit {
    localStorageName = 'angular-split-ws'
    config: IConfig = null

    ngOnInit() {
        console.log("wewedsz")
        this.config = cloneDeep(defaultConfig);
    }

    resetConfig() {
        localStorage.removeItem(this.localStorageName);
    }

    onDragEnd(columnindex: number, e: {gutterNum: number, sizes: Array<number>}) {
        // Column dragged
        if(columnindex === -1) {
            // Set size for all visible columns
            this.config.columns.filter(c => c.visible === true).forEach((column, index) => column.size = e.sizes[index]);
        }
        // Row dragged
        else {
            // Set size for all visible rows from specified column
            this.config.columns[columnindex].rows.filter(r => r.visible === true).forEach((row, index) => row.size = e.sizes[index]);
        }

        this.saveLocalStorage();
    }

    saveLocalStorage() {
        localStorage.setItem(this.localStorageName, JSON.stringify(this.config));
    }
}