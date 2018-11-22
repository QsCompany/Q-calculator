import { attributes } from "../../../../lib/q/sys/Dom";
import { component, templateWrapper } from "../../component";

export class cardMediaActions extends component {

    @attributes.ComponentHandler("md-card-media-actions", templateWrapper({ templateName: "md-card-media-actions" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new cardMediaActions(e.node.Dom as HTMLElement);
    }
}