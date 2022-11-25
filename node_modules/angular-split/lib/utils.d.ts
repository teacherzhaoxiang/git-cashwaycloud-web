import { ElementRef } from '@angular/core';
import { IPoint } from './interface/IPoint';
export declare function getPointFromEvent(event: MouseEvent | TouchEvent): IPoint;
export declare function getPixelSize(elRef: ElementRef, direction: 'horizontal' | 'vertical'): number;
export declare function getInputBoolean(v: any): boolean;
export declare function isValidTotalSize(total: number): boolean;
