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
define(["require", "exports", "template|../src/calc.html", "../lib/q/Core", "context", "./calc-logic", "../lib/q/sys/Dom", "../lib/q/sys/runtime"], function (require, exports, calc_html_1, Core_1, context_1, calc_logic_1, Dom_1, runtime_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Object.defineProperty(Object.prototype, 'string', { get: function () { return this.toString(); }, configurable: false, enumerable: false });
    var CalcButton = (function (_super) {
        __extends(CalcButton, _super);
        function CalcButton(view, label) {
            var _this = _super.call(this, view) || this;
            _this.applyStyle('btn');
            var l = document.createElement('div');
            l.classList.add('number');
            l.innerText = label;
            _this._view.appendChild(l);
            return _this;
        }
        CalcButton_1 = CalcButton;
        CalcButton.creator = function (e) {
            var c = e.node;
            var cnt = new CalcButton_1(c.Dom, c.Dom.getAttribute("label"));
            c.e.Control = cnt;
            return c;
        };
        CalcButton.prototype.initialize = function () { };
        var CalcButton_1;
        CalcButton = CalcButton_1 = __decorate([
            Dom_1.attributes.Component({ name: "calc-button", handler: CalcButton_1.creator }),
            __metadata("design:paramtypes", [HTMLElement, String])
        ], CalcButton);
        return CalcButton;
    }(Core_1.UI.JControl));
    exports.CalcButton = CalcButton;
    var Calc = (function (_super) {
        __extends(Calc, _super);
        function Calc(e) {
            var _this = _super.call(this, Calc_1.get(e), e.node.Scop || Core_1.UI.TControl.Me) || this;
            if (e) {
                var s = e.node.Scop;
                var v = s instanceof calc_logic_1.CalcData ? s : s.Value instanceof calc_logic_1.CalcData ? s.Value : null;
            }
            _this.Value = v || new calc_logic_1.CalcData();
            _this.Value.OnPropertyChanged(calc_logic_1.CalcData.DPResult, function (s, e) {
                _this.notify("result", { name: "result", Data: e._new, sender: _this });
            });
            return _this;
        }
        Calc_1 = Calc;
        Calc.creator = function (e) {
            e.node.e.Control = new Calc_1(e);
            return e.node;
        };
        Calc.prototype.OnKeyDown = function (e) {
            if (!this._view.contains(document.activeElement))
                return;
            this.Value.append(e);
            e.preventDefault();
            e.stopPropagation();
            return true;
        };
        Calc.get = function (e) {
            var t = calc_html_1.template.get("calcView").content.firstElementChild.cloneNode(true);
            e.node.e.dom.appendChild(t);
            return new Core_1.UI.HtmlTemplate(e.node.e.dom, false);
        };
        Calc.prototype.setName = function (n, dom) { this[n] = dom; };
        var Calc_1;
        __decorate([
            Core_1.bind.property(Number),
            __metadata("design:type", Number)
        ], Calc.prototype, "fontSize", void 0);
        Calc = Calc_1 = __decorate([
            Dom_1.attributes.Content({
                handler: function () {
                }, type: Dom_1.attributes.ContentType.multiple
            }),
            Dom_1.attributes.Component({
                name: 'q-calc',
                handler: Calc_1.creator
            }),
            Dom_1.attributes.Event({ name: "result" }),
            __metadata("design:paramtypes", [Object])
        ], Calc);
        return Calc;
    }(Core_1.UI.TControl));
    exports.Calc = Calc;
    function loadResources() {
        var t = ['../lib/q/assets/style/bundle.css', '../src/calc.css'];
        for (var _i = 0, t_1 = t; _i < t_1.length; _i++) {
            var s = t_1[_i];
            require('style|' + s, void 0, void 0, context_1.context);
        }
    }
    Dom_1.Controller.Attach(Core_1.UI.Desktop.Current, new calc_logic_1.CalcData());
    runtime_1.thread.Dispatcher.OnIdle(Core_1.UI.Spinner.Default, Core_1.UI.Spinner.Default.Pause, true);
    loadResources();
    function wrap(child, into) {
        Core_1.html.replace(child, into).appendChild(child);
        return into;
    }
    exports.wrap = wrap;
});
//# sourceMappingURL=calc.js.map