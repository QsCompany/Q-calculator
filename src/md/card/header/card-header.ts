import { attributes } from "../../../../lib/q/sys/Dom";
import { component, templateWrapper } from "../../component";
import { UI, bind } from "../../../../lib/q/Core";

export class cardHeader extends component {
    @attributes.ComponentHandler("md-card-header", templateWrapper({ templateName: "md-card-header" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new cardHeader(e.node.Dom as HTMLElement);
    }


}