import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeVerboseController {
    #target;
    intro(proxy, target, decor) {
        this.#target = target;
    }
    onLog({}) {
        const t = this.#target;
        const de = t.dispatchEvent.bind(t);
        t.dispatchEvent = e => {
            console.log(e);
            return de(e);
        };
    }
    onOn({ on }) {
        for (const key in on) {
            this.#target.addEventListener(key, this.handler);
        }
        const initAction = on[''];
        if (initAction !== undefined) {
            this.broadCast(initAction);
        }
    }
    broadCast({ detail, dispatch, bubbles, composed, cancelable }, e) {
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
    finale({ on }, target, decor) {
        if (on === undefined)
            return;
        for (const key in on) {
            this.#target.removeEventListener(key, this.handler);
        }
    }
    handler = (e) => {
        const action = this.on[e.type];
        if (action !== undefined) {
            this.broadCast(action, e);
        }
    };
}
const tagName = 'be-verbose';
const ifWantsToBe = 'verbose';
const upgrade = '*';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            intro: 'intro',
            virtualProps: ['log', 'on']
        },
        actions: {
            onLog: {
                ifAllOf: ['log'],
            },
            onOn: {
                ifAllOf: ['on'],
            }
        }
    },
    complexPropDefaults: {
        controller: BeVerboseController,
    }
});
register(ifWantsToBe, upgrade, tagName);
