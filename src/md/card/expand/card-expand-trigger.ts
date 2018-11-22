import { attributes } from "../../../../lib/q/sys/Dom";
import { component, templateWrapper } from "../../component";
import { card } from "../card";

export class cardExpandTrigger extends component {
    @attributes.ComponentHandler("md-card-expand-trigger", templateWrapper({ templateName: "md-card-expand-trigger" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new cardExpandTrigger(e.node.Dom as HTMLElement);
    }
    initialize() {
        this.addEventListener('click', this.onClick as any, void 0, this);
    }
    onClick(): any {
        var p = this.Parent;
        while (p)
            if (p instanceof card) {
                p.expand = !p.expand;
                return;
            } else p = p.Parent;
    }
}