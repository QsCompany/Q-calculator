import { bind } from "../../../lib/q/Core";
import { Processor, attributes } from "../../../lib/q/sys/Dom";
import { component, stringifyStyle, templateWrapper, stringifyClass } from "../component";

export class card extends component {

    @bind.property<boolean, card>(Boolean, false, void 0, card.prototype.resetCardClasses)
    mdWithHover: boolean;

    @bind.property<boolean, card>(Boolean, void 0, void 0, card.prototype.resetCardClasses)
    expand: boolean;

    @bind.property(String)
    get cardClasses(): string {
        return this.get(bind.DObject.GetProperty(card, "cardClasses"));
    }
    set cardClasses(v: string) {
        this.set(bind.DObject.GetProperty(card, "cardClasses"), v);
    }

    resetCardClasses() {
        this.cardClasses = stringifyClass({
            'md-with-hover': this.mdWithHover,
            'md-expand-active': this.expand
        });
    }

    @attributes.ComponentHandler("md-card", templateWrapper({ templateName: "md-card" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new card(e.node.Dom as HTMLElement);
    }

    reset() {
        super.reset();
        if (this._view.hasAttribute("md-with-hover"))
            this.mdWithHover = true;
        return this;
    }
}