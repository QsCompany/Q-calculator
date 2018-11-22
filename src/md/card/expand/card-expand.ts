import { attributes } from "../../../../lib/q/sys/Dom";
import { component, templateWrapper } from "../../component";

export class cardExpand extends component {

    @attributes.ComponentHandler("md-card-expand", templateWrapper({ templateName: "md-card-expand" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new cardExpand(e.node.Dom as HTMLElement);
    }
}
