import { attributes } from "../../../lib/q/sys/Dom";
import { component, createDom, templateWrapper } from "../component";
import { ripple } from "../ripple/ripple";
import { UI, bind } from "../../../lib/q/Core";

@attributes.Event({ name: 'click' })
export class icon extends component {

    @attributes.ComponentHandler("md-icon", templateWrapper({ templateName: "md-icon" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new icon(e.node.Dom as HTMLElement);
    }
    reset() {
        super.reset();
        var d = this._view;
        var s = parseInt(d.getAttribute('size'));
        if (!isNaN(s)) this.Size = s;
        var n = d.getAttribute('name');
        if (n) this.Name = n;
        if ((n = d.getAttribute('src'))) this.Src = n;
        return this;
    }
    initialize() {
        super.initialize();
        this.applyStyle("md-icon", 'md-icon-font');
    }
    Add(child) {
        if (child instanceof Text)
            this.Name = child.textContent.trim();
        return this;
    }

    @bind.property<string, icon>(String, void 0, void 0, icon.prototype._onNameChanged)
    Name: string;
    _onNameChanged(e?: bind.EventArgs<string, icon>) {
        this.applyStyle('md-icon-font').disapplyStyle('md-svg-loader', 'md-icon-image');
    }

    @bind.property<string, icon>(String, void 0, void 0, icon.prototype._onSrcChanged)
    Src: string;
    _onSrcChanged(e: bind.EventArgs<string, icon>) {
        this.disapplyStyle('md-icon-font').applyStyle('md-svg-loader', 'md-icon-image');
    }


    @bind.property<number, icon>(Number, void 0, void 0, icon.prototype._onSizeChanged)
    Size: number;
    _onSizeChanged(e: bind.EventArgs<number, icon>) {
        this.View.classList.remove.apply(this.View.classList, icon.__sizes__);
        this.applyStyle(icon.__sizes__[e._new] || "md-size-2x");
    }
    static __sizes__ = ["md-size-2x", "md-size-3x", "md-size-4x", "md-size-5x"];

}