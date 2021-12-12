import {BeDecoratedProps} from 'be-decorated/types';

export interface BeVerboseVirtualProps{
    log: boolean,
    on: {[key: string]: Action},
}

export interface Action{
    dispatch: string,
    bubbles: boolean,
    cancelable: boolean,
    detail: any,
    composed: boolean,
}

export interface BeVerboseProps extends BeVerboseVirtualProps{
    proxy: Element & BeVerboseVirtualProps,

}

export interface BeVerboseActions {
    intro(proxy: Element & BeVerboseVirtualProps, target: Element, beDecorProps: BeDecoratedProps): void;
    onLog(self: this): void;
    onOn(self: this): void;
    finale(proxy: Element & BeVerboseVirtualProps, target: Element, beDecorProps: BeDecoratedProps): void;
}