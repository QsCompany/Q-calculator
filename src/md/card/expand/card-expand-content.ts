import { attributes, Processor } from "../../../../lib/q/sys/Dom";
import { component, stringifyStyle, MdObserverElement, templateWrapper } from "../../component";
import { UI, bind, PaintThread } from "../../../../lib/q/Core";



export class cardExpandContent extends component {

    @attributes.ComponentHandler("md-card-expand-content", templateWrapper({ templateName: "md-card-expand-content" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new cardExpandContent(e.node.Dom as HTMLElement);
    }

    @bind.property(String)
    contentStyles: string = "";
    marginTop = 0;
    resizeObserver: MutationObserver;
    transitionEnabled = true;

    initialize() {
        this.applyStyle("md-card-expand-content");
        this.calculateMarginTopImmediately()
        this.resizeObserver = MdObserverElement(this._view, {
            childList: true,
            characterData: true,
            subtree: true
        }, this.calculateMarginTopImmediately.bind(this), this);
    }
    resetContentStyles() {
        this.contentStyles = stringifyStyle({
            'margin-top': `-${this.marginTop}px`,
            'opacity': this.marginTop === 0 ? 1 : 0,
            'transition-property': this.transitionEnabled ? null : 'none'
        });
    }

    @bind.property<boolean, cardExpandContent>(Boolean, void 0, void 0, cardExpandContent.prototype.calculateMarginTop)
    expand: boolean;

    calculateMarginTop() {
        if (!this.expand) {
            this.marginTop = (this._view.children[0] as HTMLElement).offsetHeight;
        } else {
            this.marginTop = 0
        }
    }
    calculateMarginTopImmediately() {
        if (!this) throw "";
        if (this.expand) return;
        this.transitionEnabled = false;
        this.$nextTick(function (this: cardExpandContent) {
            this.calculateMarginTop();
            this.$nextTick(function (this: cardExpandContent) {
                this.transitionEnabled = true;
                this.resetContentStyles();
            })
        });
    }
    Dispose() {
        super.Dispose();
        this.resizeObserver.disconnect();
    }
}
