import { attributes } from "../../../lib/q/sys/Dom";
import { UI, bind } from "../../../lib/q/Core";


export class app extends UI.Layout<any> {

    @bind.property<boolean, app>(Boolean, void 0, void 0, app.prototype._OnMenuVisible)
    menuVisible: boolean;
    _OnMenuVisible(e: bind.EventArgs<boolean, app>) {
    }
    protected showPage(page: any) {
    }

    @attributes.ComponentHandler("md-app")
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new app(e.node.Dom as HTMLElement);
    }
    constructor(dom: HTMLElement) {
        super(dom);
    }
}