var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../../lib/q/Core", "template|../../src/md/templates.html", "../../lib/q/sys/Dom", "template|../../src/md/templates.html", "style|../../src/md/style/md.css", "style|../../src/md/style/md-c.css"], function (require, exports, Core_1, templates_html_1, Dom_1, templates_html_2, md_css_1, md_c_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cTemplates = templates_html_2.template;
    var ac = Core_1.bind.NamedScop.Create('mdActiveTheme', "md-theme-demo-light" || "md-theme-default");
    ac.OnPropertyChanged(Core_1.bind.Scop.DPValue, function (b, e) { debugger; });
    var component = (function (_super) {
        __extends(component, _super);
        function component(dom) {
            var _this = _super.call(this, dom = (typeof dom === 'string' || !dom ? dom = document.createElement(dom || 'div') : dom)) || this;
            _this.$slots_def = getSlots(dom);
            _this.Value = _this;
            _this.reset();
            return _this;
        }
        component.prototype.addComponent = function (e) { this.Add(e.child.Dom, e.slot); };
        Object.defineProperty(component, "theme", {
            get: function () {
                var c = Core_1.bind.NamedScop.Get('mdActiveTheme');
                return (c && c.Value) || "md-theme-demo-light" || "md-theme-default";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(component.prototype, "View", {
            get: function () { return this._view; },
            set: function (v) {
                if (v == this._view)
                    return;
                if (this.$vnode)
                    if (this._view) {
                        this.$vnode.slot.nextSible = this._view.nextSibling;
                        this.$vnode.slot.parent = this._view.parentNode;
                        var ret = Core_1.helper.detach(this._view);
                        v && ret(v);
                        this._view = v;
                    }
                    else {
                        if (!this.$vnode.slot.parent)
                            this.$vnode.slot.parent = this.Parent && this.Parent.View;
                        AddElement(this.Parent && this.Parent.View, v, this.$vnode.slot);
                    }
                else
                    this._view = v;
            },
            enumerable: true,
            configurable: true
        });
        component.prototype.OnTemplateCompiled = function (node) {
            var _this = this;
            var arr = vmNodes.get(this._view);
            if (arr && arr.If) {
                vmNodes.delete(this._view);
                this.$vnode = {
                    dom: this._view, ifelse: arr, slot: { parent: this._view.parentNode, nextSible: this._view.nextSibling }
                };
                arr.If.scop.OnPropertyChanged(Core_1.bind.Scop.DPValue, function (s, e) {
                    _this.View = e._new
                        ? arr.If.node
                        : arr.Else && arr.Else.node;
                });
                this.View = arr.If.scop.Value
                    ? arr.If.node
                    : arr.Else && arr.Else.node;
            }
        };
        component.ctor = function () {
            if (!Core_1.bind.NamedScop.Get('mdActiveTheme'))
                Core_1.bind.NamedScop.Create('mdActiveTheme', "md-theme-demo-light" || "md-theme-default");
        };
        component.prototype.initialize = function () {
        };
        Object.defineProperty(component.prototype, "disable", {
            get: function () {
                return this._view.classList.contains('md-disabled');
            },
            set: function (v) {
                this._view.classList[v ? 'add' : 'remove']('md-disabled');
            },
            enumerable: true,
            configurable: true
        });
        component.prototype.reset = function () {
            var d = this._view;
            var a = parseInt(d.getAttribute('elevate'));
            a = Math.min(0, Math.max(24, a));
            if (a)
                d.classList.add("md-elevation-" + a);
            return this;
        };
        component.prototype.$nextTick = function (callback, args) {
            Core_1.PaintThread.OnPaint({
                args: args, owner: this, method: callback
            });
        };
        component.prototype.$emit = function (name, Data) {
            this.notify(name, { name: name, sender: this, Data: Data });
        };
        component.prototype.Add = function (child, slot) {
            if (slot === void 0) { slot = 'default'; }
            if (child instanceof Node)
                return this.AddElement(child, slot);
            if (child.Parent != null) {
                if (child.Parent === this)
                    return;
                child.Parent.Remove(child, false);
            }
            child = this.getTemplate(child);
            child.Parent = this;
            this.AddElement(child.View, slot);
            return this;
        };
        component.prototype.AddElement = function (child, slotName) {
            var slot = this.$slots_def[slotName];
            if (child.parentNode)
                child.parentNode.removeChild(child);
            if (!slot)
                this._view.appendChild(child);
            else if (slot && slot.parent)
                slot.parent.insertBefore(child, slot.nextSible);
            else if (slot.nextSible && slot.nextSible.parentNode)
                slot.nextSible.parentNode.insertBefore(child, slot.nextSible);
            else
                this._view.appendChild(child);
        };
        component.prototype.Remove = function (child) {
            if (child instanceof Core_1.UI.JControl) {
                var cjc = child;
                child = child.View;
            }
            var p = child.parentNode;
            if (!p)
                return true;
            if (!this._view.contains(child))
                return true;
            p.removeChild(child);
            if (cjc)
                cjc.Parent = void 0;
            return true;
        };
        component = __decorate([
            Dom_1.attributes.Content({ handler: 'addComponent', type: Dom_1.attributes.ContentType.multiple, keepInTree: false }),
            __metadata("design:paramtypes", [Object])
        ], component);
        return component;
    }(Core_1.UI.JControl));
    exports.component = component;
    for (var t in templates_html_1.template) {
        var x = templates_html_1.template.get(t);
        if (x instanceof HTMLTemplateElement)
            x.content.normalize();
    }
    ValidateImport(md_css_1.style, md_c_css_1.style);
    var $add = DOMTokenList.prototype.add;
    function createDom(tag, clss) {
        var t = document.createElement(tag);
        $add.apply(t.classList, clss);
        return t;
    }
    exports.createDom = createDom;
    function stringifyStyle(obj, s) {
        s = s || "";
        for (var k in obj) {
            var v = obj[k];
            if (v)
                s += (s.length ? ";" : "") + k + ":" + v;
        }
        return s;
    }
    exports.stringifyStyle = stringifyStyle;
    function stringifyClass(obj, s) {
        s = s || "";
        for (var k in obj) {
            var v = obj[k];
            if (typeof v === 'boolean')
                if (v)
                    s += " " + k;
                else
                    continue;
            else if (v)
                s += " " + v;
        }
        return s;
    }
    exports.stringifyClass = stringifyClass;
    function wrapTemplate(template, toDom) {
        var templCnt = template.content;
        if (templCnt.childElementCount > 1) {
            toDom.appendChild(templCnt.cloneNode(true));
            return toDom;
        }
        var tempRoot = templCnt.firstElementChild.cloneNode(true);
        if (!toDom)
            return toDom;
        var children = tempRoot.childNodes;
        toDom.append.apply(toDom, children);
        for (var i = 0; i < tempRoot.attributes.length; i++) {
            var attr = tempRoot.attributes[i];
            var tkey = attr.name;
            var tval = attr.value;
            var dval = toDom.getAttribute(tkey);
            if (dval) {
                if (tkey == 'class' || tkey == 'db-class') {
                    dval = tval + " " + dval;
                }
                else if (tkey == 'style' || tkey == 'db-style') {
                    dval = tval + ";" + dval;
                }
                else
                    dval = tval;
            }
            else
                dval = tval;
            if (dval)
                toDom.setAttribute(tkey, dval);
        }
        return toDom;
    }
    exports.wrapTemplate = wrapTemplate;
    function createFromTemplate(template) {
        return template.content.firstElementChild.cloneNode(true);
    }
    exports.createFromTemplate = createFromTemplate;
    function createDomTemplateFromOptions(ins, dom, op) {
        if (!op)
            op = {};
        if (op && op.templateName && !op.template)
            op.template = templates_html_1.template.get(op.templateName);
        if (!dom && op.template)
            dom = createFromTemplate(op.template);
        else {
            dom = (typeof dom === 'string' || !dom ? dom = document.createElement(dom || 'div') : dom);
            if (op.template)
                dom = wrapTemplate(op.template, dom);
        }
        return dom;
    }
    exports.createDomTemplateFromOptions = createDomTemplateFromOptions;
    function getSlots(dom) {
        var sdef = {};
        var slots = dom.querySelectorAll('slot');
        for (var i = 0; i < slots.length; i++) {
            var slot = slots[i];
            sdef[slot.name || 'default'] = { nextSible: slot.nextSibling, parent: slot.parentNode };
            slot.remove();
        }
        return sdef;
    }
    exports.getSlots = getSlots;
    function templateWrapper(op) {
        return function (ins, dom) {
            createDomTemplateFromOptions(ins, dom, op);
        };
    }
    exports.templateWrapper = templateWrapper;
    var vmNodes = new Map();
    Dom_1.Processor.Register({
        name: 'if', attribute: 'if', execute: function (x, p) {
            var s = Core_1.bind.Scop.GenerateScop(p.value, x.creteScopBuilderEventArgs(3));
            var c = x.parent && x.parent.Dom;
            if (c) {
                var v = vmNodes.get(c);
                if (!v)
                    vmNodes.set(c, v = {});
                v.If = new VMNode('if', x.Dom, s, c);
            }
            return x;
        }, isFinalizer: true, priority: Number.MAX_VALUE + 1
    });
    Dom_1.Processor.Register({
        name: 'else', attribute: 'else', execute: function (x, p) {
            var c = x.parent && x.parent.Dom;
            if (c) {
                var v = vmNodes.get(c);
                if (!v)
                    vmNodes.set(c, v = {});
                v.Else = new VMNode('else', x.Dom, void 0, c);
            }
            return x;
        }, isFinalizer: true, priority: Number.MAX_VALUE + 2
    });
    var VMNode = (function () {
        function VMNode(tag, node, scop, parent) {
            this.tag = tag;
            this.node = node;
            this.scop = scop;
            this.parent = parent;
        }
        return VMNode;
    }());
    function AddElement(parent, child, slot) {
        if (child.parentNode)
            child.parentNode.removeChild(child);
        if (!slot)
            parent && parent.appendChild(child);
        else if (slot && slot.parent)
            slot.parent.insertBefore(child, slot.nextSible);
        else if (slot.nextSible && slot.nextSible.parentNode)
            slot.nextSible.parentNode.insertBefore(child, slot.nextSible);
        else
            parent && parent.appendChild(child);
    }
    function MdObserverElement(el, config, cb, owner) {
        if (owner == null)
            throw "";
        if ('MutationObserver' in window) {
            var observer = new MutationObserver(!owner ? cb : function (a, b) { cb.call(owner, a, b); });
            observer.observe(el, config);
            return observer;
        }
    }
    exports.MdObserverElement = MdObserverElement;
    function allChildren(node) {
        var treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_ALL, { acceptNode: function (node) { return NodeFilter.FILTER_ACCEPT; } }, false);
        var nodeList = [];
        while (treeWalker.nextNode())
            nodeList.push(treeWalker.currentNode);
        return nodeList;
    }
    function grab() {
        var map = new Map();
        var treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, { acceptNode: function (node) { return NodeFilter.FILTER_ACCEPT; } }, false);
        var all = document.all;
        for (var i = 0; i < all.length; i++) {
            var n = all.length[i];
            for (var j = 0; j < n.attributes.length; j++) {
                var attr = n.attributes[j];
                if (attr.name.indexOf('data-v-') == 0) {
                    var arr = map.get(attr.name);
                    if (!arr)
                        map.set(attr.name, arr = []);
                    arr.push(n.className);
                    break;
                }
            }
        }
        return map;
    }
});
//# sourceMappingURL=component.js.map