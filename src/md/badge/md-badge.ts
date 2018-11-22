import { attributes } from "../../../lib/q/sys/Dom";
import { component, templateWrapper, stringifyClass } from "../component";
import { bind } from "../../../lib/q/Core";

@attributes.Event({ name: 'click' })
export class badge extends component {
    constructor(dom: string | HTMLElement) {
        super(dom);
        this._badgeClasses();
        this._styles();
    }
    @attributes.ComponentHandler("md-badge", templateWrapper({ templateName: "md-badge" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new badge(e.node.Dom as HTMLElement);
    }

    @bind.property1(String)
    mdContent: string | number;

    @bind.property1(String, { defaultValue: 'top', changed: badge.prototype._badgeClasses })
    mdPosition: string;

    @bind.property1(Boolean, { changed: badge.prototype._badgeClasses })
    mdDense: boolean;


    @bind.property(Boolean)
    hasDefaultSlot: boolean;
    static DPhasDefaultSlot: bind.DProperty<boolean, badge>;
    @bind.property1(String, {
        defaultValue: stringifyClass({
            ['md-position-top']: true,
            'md-dense': true
        })
    })
    badgeClasses: string;
    _badgeClasses() {
        const staticClass = this.getStaticClass()
        return this.badgeClasses = stringifyClass({
            ['md-position-' + this.mdPosition || 'top']: true,
            'md-dense': this.mdDense,
            ...staticClass,
        });
    }
    @bind.property(String)
    styles: string;
    _styles() {
        if (!this.$vnode) return this._view.getAttribute('style');
        return this.styles = this.$vnode.dom.getAttribute('style');
    }
    getStaticClass() {
        const staticClass = this.$vnode ? this.$vnode.dom.className : this._view.className;
        function filterClasses() {
            return staticClass.split(' ').filter(val => val).reduce((result, key) => {
                result[key] = true
                return result
            }, {})
        }
        return staticClass ? filterClasses() : {}
    }
    Add(child) {
        this.set(badge.DPhasDefaultSlot, true);
        return super.Add(child);
    }
    initialize() {
    }
    OnTemplateCompiled(node) {
        super.OnTemplateCompiled(node);
    }
}