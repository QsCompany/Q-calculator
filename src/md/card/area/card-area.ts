import { attributes, Processor } from "../../../../lib/q/sys/Dom";
import { component, stringifyClass, templateWrapper } from "../../component";
import { UI, bind } from "../../../../lib/q/Core";
export class cardArea extends component {
    @attributes.ComponentHandler("md-card-area", templateWrapper({ templateName: 'md-card-area' }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new cardArea(e.node.Dom as HTMLElement);
    }
    static InitHeader(arg0: Processor.Instance, dom: HTMLElement): any {
        dom.setAttribute('db-class', (dom.getAttribute('db-class') || '') + " {{this.areaClasses}}");
    }

    @bind.property<boolean, cardArea>(Boolean, void 0, void 0, cardArea.prototype.resetAreaClasses)
    mdInset: boolean;
    areaClasses: string;
    resetAreaClasses() {
        return this.areaClasses = stringifyClass({
            'md-inset': this.mdInset
        });
    }
}