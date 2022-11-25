import { EventManager } from '@angular/platform-browser';
/**
 * Credit to Michael Strobel from:
 * https://github.com/kryops/ng2-events
 */
export declare class UndetectedEventPlugin {
    manager: EventManager;
    supports(eventName: string): boolean;
    addEventListener(element: HTMLElement, eventName: string, handler: Function): Function;
}
