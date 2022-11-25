import { ChangeDetectorRef, Renderer2, AfterViewInit, OnDestroy, ElementRef, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { IArea } from '../interface/IArea';
import { SplitAreaDirective } from '../directive/splitArea.directive';
/**
 * angular-split
 *
 * Areas size are set in percentage of the split container.
 * Gutters size are set in pixels.
 *
 * So we set css 'flex-basis' property like this (where 0 <= area.size <= 1):
 *  calc( { area.size * 100 }% - { area.size * nbGutter * gutterSize }px );
 *
 * Examples with 3 visible areas and 2 gutters:
 *
 * |                     10px                   10px                                  |
 * |---------------------[]---------------------[]------------------------------------|
 * |  calc(20% - 4px)          calc(20% - 4px)              calc(60% - 12px)          |
 *
 *
 * |                          10px                        10px                        |
 * |--------------------------[]--------------------------[]--------------------------|
 * |  calc(33.33% - 6.667px)      calc(33.33% - 6.667px)      calc(33.33% - 6.667px)  |
 *
 *
 * |10px                                                  10px                        |
 * |[]----------------------------------------------------[]--------------------------|
 * |0                 calc(66.66% - 13.333px)                  calc(33%% - 6.667px)   |
 *
 *
 *  10px 10px                                                                         |
 * |[][]------------------------------------------------------------------------------|
 * |0 0                               calc(100% - 20px)                               |
 *
 */
export declare class SplitComponent implements AfterViewInit, OnDestroy {
    private ngZone;
    private elRef;
    private cdRef;
    private renderer;
    private _direction;
    direction: 'horizontal' | 'vertical';
    private _gutterSize;
    gutterSize: number;
    private _useTransition;
    useTransition: boolean;
    private _disabled;
    disabled: boolean;
    private _dir;
    dir: 'ltr' | 'rtl';
    private dragStartSubscriber;
    readonly dragStart: Observable<{
        gutterNum: number;
        sizes: Array<number>;
    }>;
    private dragEndSubscriber;
    readonly dragEnd: Observable<{
        gutterNum: number;
        sizes: Array<number>;
    }>;
    private gutterClickSubscriber;
    readonly gutterClick: Observable<{
        gutterNum: number;
        sizes: Array<number>;
    }>;
    private transitionEndSubscriber;
    readonly transitionEnd: Observable<Array<number>>;
    private dragProgressSubject;
    dragProgress$: Observable<{
        gutterNum: number;
        sizes: Array<number>;
    }>;
    private isDragging;
    private currentGutterNum;
    private startPoint;
    private endPoint;
    readonly displayedAreas: Array<IArea>;
    private readonly hidedAreas;
    private readonly dragListeners;
    private readonly dragStartValues;
    private gutterEls;
    constructor(ngZone: NgZone, elRef: ElementRef, cdRef: ChangeDetectorRef, renderer: Renderer2);
    ngAfterViewInit(): void;
    private getNbGutters;
    addArea(component: SplitAreaDirective): void;
    removeArea(component: SplitAreaDirective): void;
    updateArea(component: SplitAreaDirective, resetOrders: boolean, resetSizes: boolean): void;
    showArea(component: SplitAreaDirective): void;
    hideArea(comp: SplitAreaDirective): void;
    getVisibleAreaSizes(): Array<number>;
    setVisibleAreaSizes(sizes: Array<number>): boolean;
    private build;
    private refreshStyleSizes;
    clickGutter(event: MouseEvent, gutterNum: number): void;
    startDragging(event: MouseEvent | TouchEvent, gutterOrder: number, gutterNum: number): void;
    private dragEvent;
    private stopDragging;
    notify(type: 'start' | 'progress' | 'end' | 'click' | 'transitionEnd'): void;
    ngOnDestroy(): void;
}
