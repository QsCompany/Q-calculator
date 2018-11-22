import { attributes } from "../../../lib/q/sys/Dom";
import { component, createDom, templateWrapper } from "../component";
import { ripple } from "../ripple/ripple";
import { UI } from "../../../lib/q/Core";

@attributes.Event({ name: 'click' })
export class button extends component {

    @attributes.ComponentHandler("md-button", templateWrapper({ templateName: "md-button" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new button(e.node.Dom as HTMLElement).reset();
    }
    private attrs = {
        test: true, bind: false,
        is: "where"
    }
    reset() {
        super.reset();
        var d = this._view;
        if (d.hasAttribute("float"))
            this.applyStyle("md-fab");
        if (d.hasAttribute("round"))
            this.applyStyle('md-icon-button');
        if (d.hasAttribute("dense"))
            this.applyStyle('md-dense');
        if (d.hasAttribute("raised"))
            this.applyStyle('md-raised');

        return this;
    }
}