import { attributes } from "../../../lib/q/sys/Dom";
import { component, createDom, templateWrapper } from "../component";
import { ripple } from "../ripple/ripple";
import { UI, bind } from "../../../lib/q/Core";

export class content extends component {

    @attributes.ComponentHandler("md-content", templateWrapper({ templateName: "md-content" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new content(<any>e.node.Dom);
    }
}