import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {register} from 'be-hive/register.js';
import {BeVerboseVirtualProps, BeVerboseActions, BeVerboseProps, Action} from './types';

export class BeVerboseController implements BeVerboseActions{

    #target!: Element;

    intro(proxy: Element & BeVerboseVirtualProps, target: Element, decor: BeDecoratedProps){
        this.#target=target;
    }

    onLog({}: this){
        const t = this.#target;
        const de = t.dispatchEvent.bind(t);
        t.dispatchEvent = e => {
            console.log(e);
            return de(e);
        }
    }

    onOn({on}: this){
        for(const key in on){
            this.#target.addEventListener(key, this.handler);
        }
        const initAction = on[''];
        if(initAction !== undefined){
            this.broadCast(initAction);
        }
    }

    broadCast({detail, dispatch, bubbles, composed, cancelable}: Action, e?: Event){
        const eventDetail = {
            trigger: e,
            ...detail
        };
        this.#target.dispatchEvent(new CustomEvent(dispatch, {
            bubbles,
            composed,
            cancelable,
            detail: eventDetail
        }));
    }

    finale({on}:Element & BeVerboseVirtualProps, target: Element, decor: BeDecoratedProps){
        if(on === undefined) return;
        for(const key in on){
            this.#target.removeEventListener(key, this.handler);
        }
    }

    handler = (e: Event) => {
        const action = this.on[e.type];
        if(action !== undefined){
            this.broadCast(action, e);
        }
    }

}

export interface BeVerboseController extends BeVerboseProps{}

const tagName = 'be-verbose';

const ifWantsToBe = 'verbose';

const upgrade = '*';

define<BeVerboseProps & BeDecoratedProps<BeVerboseProps, BeVerboseActions>, BeVerboseActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            intro: 'intro',
            virtualProps: ['log', 'on']
        },
        actions:{
            onLog:{
                ifAllOf: ['log'],
            },
            onOn:{
                ifAllOf: ['on'],
            }
        }
    },
    complexPropDefaults:{
        controller: BeVerboseController,
    }
});

register(ifWantsToBe, upgrade, tagName);