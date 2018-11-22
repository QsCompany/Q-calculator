import { attributes } from "../../../lib/q/sys/Dom";
import { cTemplates, component, templateWrapper, wrapTemplate, stringifyClass } from "../component";
import { bind } from "../../../lib/q/Core";


export class ripple extends component {
    @attributes.ComponentHandler("md-ripple", templateWrapper({ templateName: "md-ripple" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new ripple(e.node.Dom as HTMLElement);
        window['ripple'] = e.node.e.Control;
    }
    constructor(dom?: HTMLElement) {
        super(dom || wrapTemplate(cTemplates.get("md-ripple")));
    }
    reset() {
        super.reset();
        return this;
    }

    @bind.property1(Boolean, { changed: ripple.prototype._rippleClasses })
    mdDisabled: boolean;
    @bind.property1(Boolean, { changed: ripple.prototype._waveClasses })
    mdCentered: boolean;
    @bind.property1(Boolean, { defaultValue: true })
    mdEventTrigger;
    @bind.property(String)
    rippleClasses;
    @bind.property(String)
    waveClasses;
    _rippleClasses() {
        return this.rippleClasses = stringifyClass({
            'md-disabled': this.mdDisabled
        });
    }
    _waveClasses() {
        return this.waveClasses = stringifyClass({
            'md-centered': this.mdCentered
        });
    }
}