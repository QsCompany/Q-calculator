import { UI, bind, PaintThread, Dom, bom, base, injecter, helper } from "../../lib/q/Core";
import { template } from "template|../../src/md/templates.html";
import { Processor, attributes } from "../../lib/q/sys/Dom";
export { template as cTemplates } from "template|../../src/md/templates.html";
import { style as a } from "style|../../src/md/style/md.css";
import { style as b } from "style|../../src/md/style/md-c.css";
var ac = bind.NamedScop.Create('mdActiveTheme', "md-theme-demo-light" || "md-theme-default");
ac.OnPropertyChanged(bind.Scop.DPValue, (b, e) => { debugger; });

@attributes.Content({ handler: 'addComponent', type: attributes.ContentType.multiple, keepInTree: false })

export abstract class component extends UI.JControl {
    addComponent(e: attributes.ContentEventArgs) { this.Add(e.child.Dom, e.slot); }
    protected $slots_def: SlotsMap;
    public static get theme(): string {
        var c = bind.NamedScop.Get('mdActiveTheme');
        return (c && c.Value) || "md-theme-demo-light" || "md-theme-default";
    }
    constructor(dom: HTMLElement | string) {
        super(dom = (typeof dom === 'string' || !dom ? dom = document.createElement(dom as any || 'div') : dom) as HTMLElement);
        this.$slots_def = getSlots(dom);
        this.Value = this;
        this.reset();
    }

    //slot: ISlot;
    get View() { return this._view; }
    set View(v: HTMLElement) {
        if (v == this._view) return;
        if (this.$vnode)
            if (this._view) {
                this.$vnode.slot.nextSible = this._view.nextSibling;
                this.$vnode.slot.parent = this._view.parentNode;
                var ret = helper.detach(this._view);
                v && ret(v);
                this._view = v;
            } else {
                if (!this.$vnode.slot.parent) this.$vnode.slot.parent = this.Parent && this.Parent.View;
                AddElement(this.Parent && this.Parent.View, v, this.$vnode.slot);
            }
        else this._view = v;
    }

    protected $vnode: { slot: ISlot, dom: Element, ifelse: ifElse };
    OnTemplateCompiled(node: Processor.Tree) {
        var arr = vmNodes.get(this._view);
        if (arr && arr.If) {
            vmNodes.delete(this._view);
            this.$vnode = {
                dom: this._view, ifelse: arr, slot: { parent: this._view.parentNode, nextSible: this._view.nextSibling }
            };
            arr.If.scop.OnPropertyChanged(bind.Scop.DPValue, (s, e) => {
                this.View = e._new
                    ? arr.If.node as any
                    : arr.Else && arr.Else.node as any;
            });
            this.View = arr.If.scop.Value
                ? arr.If.node as any
                : arr.Else && arr.Else.node as any;
        }
    }
    static ctor() {
        if (!bind.NamedScop.Get('mdActiveTheme'))
            bind.NamedScop.Create('mdActiveTheme', "md-theme-demo-light" || "md-theme-default");
    }
    initialize() {

    }
    public get disable(): boolean {
        return this._view.classList.contains('md-disabled');
    }
    public set disable(v: boolean) {
        this._view.classList[v ? 'add' : 'remove']('md-disabled');
    }
    reset(): this {
        var d = this._view;
        var a = parseInt(d.getAttribute('elevate'));
        a = Math.min(0, Math.max(24, a));
        if (a)
            d.classList.add(`md-elevation-${a}`)
        return this;
    }
    //Add(child) { return super.Add(child instanceof Node ? new UI.Dom(<any>child) : child); }
    $nextTick(callback: Function, args?: any[]) {
        PaintThread.OnPaint({
            args: args, owner: this, method: callback
        });
    }
    $emit(name: string, Data?) {
        this.notify(name, { name: name, sender: this, Data });
    }
    Add(child: Node | UI.JControl, slot: string = 'default') {
        if (child instanceof Node) return this.AddElement(child, slot);
        if (child.Parent != null) {
            if (child.Parent === this)
                return;
            child.Parent.Remove(child, false);
        }
        child = this.getTemplate(child);
        child.Parent = this;
        this.AddElement(child.View, slot);
        return this;
    }
    AddElement(child: Node, slotName: string): any {
        var slot = this.$slots_def[slotName];
        if (child.parentNode) child.parentNode.removeChild(child);
        if (!slot)
            this._view.appendChild(child);
        else if (slot && slot.parent)
            slot.parent.insertBefore(child, slot.nextSible);
        else if (slot.nextSible && slot.nextSible.parentNode)
            slot.nextSible.parentNode.insertBefore(child, slot.nextSible);
        else this._view.appendChild(child);
    }
    Remove(child: UI.JControl | Node) {
        if (child instanceof UI.JControl) {
            var cjc = child;
            child = child.View;
        }
        var p = child.parentNode;
        if (!p) return true;
        if (!this._view.contains(child)) return true;
        p.removeChild(child);
        if (cjc) cjc.Parent = void 0;
        return true;
    }
}


for (const t in template) {
    var x = template.get(t);
    if (x instanceof HTMLTemplateElement)
        x.content.normalize();
}
ValidateImport(a, b);
var $add = DOMTokenList.prototype.add;
export function createDom(tag: string, clss: string[]) {
    var t = document.createElement(tag);
    $add.apply(t.classList, clss);
    return t;
}
export function stringifyStyle(obj: Object, s?: string) {
    s = s || ""
    for (const k in obj) {
        const v = obj[k];
        if (v)
            s += (s.length ? ";" : "") + k + ":" + v;
    }
    return s;
}
export function stringifyClass(obj: Object, s?: string) {
    s = s || ""
    for (const k in obj) {
        const v = obj[k];
        if (typeof v === 'boolean')
            if (v)
                s += " " + k;
            else continue;
        else if (v) s += " " + v;
    }
    return s;
}

export function wrapTemplate(template: HTMLTemplateElement, toDom?: HTMLElement) {
    var templCnt = template.content;
    if (templCnt.childElementCount > 1) {
        toDom.appendChild(templCnt.cloneNode(true));
        return toDom;
    }
    var tempRoot = templCnt.firstElementChild.cloneNode(true) as HTMLElement;
    if (!toDom) return toDom;
    var children = tempRoot.childNodes;

    (toDom as any).append.apply(toDom, children);
    for (let i = 0; i < tempRoot.attributes.length; i++) {
        const attr = tempRoot.attributes[i];
        const tkey = attr.name;
        const tval = attr.value;

        var dval = toDom.getAttribute(tkey);
        if (dval) {
            if (tkey == 'class' || tkey == 'db-class') {
                dval = tval + " " + dval;
            }
            else if (tkey == 'style' || tkey == 'db-style') {
                dval = tval + ";" + dval;
            } else dval = tval;
        } else dval = tval;
        if (dval) toDom.setAttribute(tkey, dval);
    }
    return toDom;
}
export function createFromTemplate(template: HTMLTemplateElement) {
    return template.content.firstElementChild.cloneNode(true) as HTMLElement;
}
export interface ISlot {
    nextSible: Node;
    parent: Node;
}
interface SlotsMap {
    [s: string]: ISlot;
}
export interface IOptions {
    template?: HTMLTemplateElement,
    templateName?: string;
    hasNotSlot?: boolean;
}
interface Ref<T> {
    value?: T
}
export function createDomTemplateFromOptions(ins: Processor.Instance, dom: HTMLElement | string, op: IOptions): HTMLElement {
    if (!op) op = {};
    if (op && op.templateName && !op.template) op.template = template.get(op.templateName);
    if (!dom && op.template)
        dom = createFromTemplate(op.template);
    else {
        dom = (typeof dom === 'string' || !dom ? dom = document.createElement(dom as any || 'div') : dom) as HTMLElement;
        if (op.template)
            dom = wrapTemplate(op.template, dom);
    }
    return dom;
}
export function getSlots(dom: HTMLElement) {
    var sdef: SlotsMap = {};
    var slots = dom.querySelectorAll('slot');
    for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        sdef[slot.name || 'default'] = { nextSible: slot.nextSibling, parent: slot.parentNode };
        slot.remove();
    }
    return sdef;
}
export function templateWrapper(op: IOptions) {
    return function (ins: Processor.Instance, dom: HTMLElement): void {
        createDomTemplateFromOptions(ins, dom, op);
    };
}
var vmNodes = new Map<Node, ifElse>();
Processor.Register({
    name: 'if', attribute: 'if', execute(x, p) {
        var s = bind.Scop.GenerateScop(p.value, x.creteScopBuilderEventArgs(3));
        var c = x.parent && x.parent.Dom;
        if (c) {
            var v = vmNodes.get(c);
            if (!v) vmNodes.set(c, v = {});
            v.If = new VMNode('if', x.Dom, s, c);
        }
        return x;
    }, isFinalizer: true, priority: Number.MAX_VALUE + 1

});
Processor.Register({
    name: 'else', attribute: 'else', execute(x, p) {
        var c = x.parent && x.parent.Dom;
        if (c) {
            var v = vmNodes.get(c);
            if (!v) vmNodes.set(c, v = {});
            v.Else = new VMNode('else', x.Dom, void 0, c);
        }
        return x;
    }, isFinalizer: true, priority: Number.MAX_VALUE + 2
});

class VMNode {
    constructor(public tag: 'if' | 'else-if' | 'else', public node: Node, public scop: bind.Scop, public parent: Node) {
    }
}
interface ifElse {
    If?: VMNode;
    Else?: VMNode;
}


function AddElement(parent: Node, child: Node, slot: ISlot): any {
    if (child.parentNode) child.parentNode.removeChild(child);
    if (!slot)
        parent && parent.appendChild(child);
    else if (slot && slot.parent)
        slot.parent.insertBefore(child, slot.nextSible);
    else if (slot.nextSible && slot.nextSible.parentNode)
        slot.nextSible.parentNode.insertBefore(child, slot.nextSible);
    else parent && parent.appendChild(child);
}

export function MdObserverElement(el: Element, config: MutationObserverInit, cb: MutationCallback, owner?) {
    if (owner == null) throw "";
    if ('MutationObserver' in window) {
        const observer = new MutationObserver(!owner ? cb : (a, b) => { cb.call(owner, a, b) });
        observer.observe(el, config)
        return observer;
    }
}

function allChildren(node: Node) {
    var treeWalker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_ALL,
        { acceptNode: function (node) { return NodeFilter.FILTER_ACCEPT; } },
        false
    );

    var nodeList = [];

    while (treeWalker.nextNode()) nodeList.push(treeWalker.currentNode);
    return nodeList;
}

function grab() {
    var map = new Map<string, string[]>();
    var treeWalker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT,
        { acceptNode: function (node) { return NodeFilter.FILTER_ACCEPT; } },
        false
    );
    var all = document.all;
    for (let i = 0; i < all.length; i++) {
        const n = all.length[i] as HTMLElement;
        for (let j = 0; j < n.attributes.length; j++) {
            const attr = n.attributes[j];
            if (attr.name.indexOf('data-v-') == 0) {
                let arr = map.get(attr.name);
                if (!arr) map.set(attr.name, arr = []);
                arr.push(n.className);
                break;
            }
        }
    }
    return map;
}