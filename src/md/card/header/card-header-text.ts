import { component, templateWrapper } from "../../component";
import { UI } from "../../../../lib/q/Core";
import { attributes } from "../../../../lib/q/sys/Dom";
export class cardHeaderText extends component {
    @attributes.ComponentHandler("md-card-header-text", templateWrapper({ templateName: "md-card-header-text" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new cardHeaderText(e.node.Dom as HTMLElement);
    }
    private parentClasses: DOMTokenList;
    OnParentChanged(_old: UI.JControl, _new: UI.JControl) {
        if (_old && this.parentClasses) {
            this.parentClasses.remove('md-card-header-flex')
        }
        if (_new) {
            this.parentClasses = _new.View.classList
            if (this.parentClasses.contains('md-card-header')) {
                this.parentClasses.add('md-card-header-flex')
            }
        }
    }
}