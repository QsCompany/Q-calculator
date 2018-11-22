import { attributes, Processor } from "../../../lib/q/sys/Dom";
import { component, templateWrapper } from "../component";
import { UI, bind } from "../../../lib/q/Core";

export class cardActions extends component {
    @attributes.ComponentHandler("md-card-actions", templateWrapper({ templateName: "md-card-actions" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new cardActions(e.node.Dom as HTMLElement);
    }

    @bind.property(String)
    mdAlignment: 'left' | 'right' | 'space-between' = 'right';
}