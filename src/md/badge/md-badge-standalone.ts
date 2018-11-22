import { attributes } from "../../../lib/q/sys/Dom";
import { component, templateWrapper } from "../component";

@attributes.Event({ name: 'click' })
export class badgeStandalone extends component {

    @attributes.ComponentHandler("md-badge-standalone", templateWrapper({ templateName: "md-badge-standalone" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new badgeStandalone(e.node.Dom as HTMLElement);
    }
}