import { attributes } from "../../../lib/q/sys/Dom";
import { component, templateWrapper } from "../component";

@attributes.Event({ name: 'click' })
export class avatar extends component {

    @attributes.ComponentHandler("md-avatar", templateWrapper({ templateName: "md-avatar" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new avatar(e.node.Dom as HTMLElement);
    }
}