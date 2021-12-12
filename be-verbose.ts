import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {register} from 'be-hive/register.js';
import {BeVerboseVirtualProps, BeVerboseActions, BeVerboseProps} from './types';

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
            }
        }
    },
    complexPropDefaults:{
        controller: BeVerboseController,
    }
});

register(ifWantsToBe, upgrade, tagName);