import { attributes } from "../../../lib/q/sys/Dom";
import { component, templateWrapper } from "../component";

export class cardContent extends component {
    @attributes.ComponentHandler("md-card-content", templateWrapper({ templateName: "md-card-content" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new cardContent(e.node.Dom as HTMLElement);
    }
}