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
define(["require", "exports", "style|./lib/q/assets/style/bundle.css", "style|./calc.css", "template|./calc.html", "./lib/q/Core", "context"], function (require, exports, css1, css, calc_html_1, Core_1, context_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ValidateImport(css, css1);
    var CalcData = (function (_super) {
        __extends(CalcData, _super);
        function CalcData() {
            var _this = _super.call(this) || this;
            _this.lc = '';
            _this.hasDot = false;
            _this.ndec = 1;
            _this.Result = 0;
            _this.Num = 0;
            _this.Oper = "+";
            return _this;
        }
        CalcData.prototype.getChar = function (c) {
            if (c instanceof KeyboardEvent)
                var s = c.key;
            else if (c instanceof MouseEvent)
                s = (c.currentTarget || c.target).getAttribute('arg');
            var x = s;
            if (x >= '0' && x <= '9')
                return parseInt(x);
            return x;
        };
        CalcData.prototype.AppendChar = function (c) {
            if (typeof c == 'number')
                this.Num = !this.hasDot ? this.Num * 10 + c : this.Num + c / (this.ndec *= 10);
            else if (c == '.') {
                if (this.hasDot)
                    return;
                this.hasDot = true;
                this.ndec = 1;
            }
            else if (c == 'c')
                return this.clear();
            else {
                var cfn = CalcData.opers[c];
                if (!cfn)
                    return;
                var fn = CalcData.opers[this.Oper];
                if (this.lc) {
                    this.Stream = this.Stream.substr(0, this.Stream.length - 1) + c;
                    this.Oper = c;
                    return;
                }
                if (c == '=') {
                    if (fn)
                        var r = fn(this.Result, this.Num);
                    return this.clear(r, c);
                }
                else if (fn) {
                    var r = fn(this.Result, this.Num);
                    this.lc = c;
                    this.clear(r, c, true);
                    this.Stream += c;
                    return;
                }
                else
                    return;
            }
            this.lc = void 0;
            this.Stream += c;
        };
        CalcData.prototype.append = function (c) {
            this.AppendChar(this.getChar(c));
        };
        CalcData.prototype.clear = function (result, oper, keepStrm) {
            this.Result = typeof result === 'number' ? result : 0;
            this.Oper = typeof oper === 'string' ? oper : '';
            this.hasDot = false;
            this.ndec = 1;
            this.Num = 0;
            if (keepStrm)
                return;
            this.Stream = "";
            this.lc = void 0;
        };
        CalcData.opers = {
            '': function (a, b) { return b; },
            '=': function (a, b) { return a; },
            '+': function (a, b) { return a + b; },
            '-': function (a, b) { return a - b; },
            '*': function (a, b) { return a * b; },
            '/': function (a, b) { return a / b; }
        };
        __decorate([
            Core_1.attributes.property1(Number, { StaticName: "DPResult" }),
            __metadata("design:type", Number)
        ], CalcData.prototype, "Result", void 0);
        __decorate([
            Core_1.attributes.property(String, ''),
            __metadata("design:type", String)
        ], CalcData.prototype, "Oper", void 0);
        __decorate([
            Core_1.attributes.property(Number, 0),
            __metadata("design:type", Number)
        ], CalcData.prototype, "Num", void 0);
        __decorate([
            Core_1.attributes.property(String, ''),
            __metadata("design:type", String)
        ], CalcData.prototype, "Stream", void 0);
        return CalcData;
    }(Core_1.bind.DObject));
    exports.CalcData = CalcData;
    var Calc = (function (_super) {
        __extends(Calc, _super);
        function Calc() {
            var _this = _super.call(this, calc_html_1.template.get("calcView"), Core_1.UI.TControl.Me) || this;
            _this.Value = new CalcData();
            _this.Value.OnPropertyChanged(CalcData.DPResult, function (s, e) {
                _this.rslt.style.fontSize = (50 - (((e._new || 0)).toString().length * 1.25)) + 'px';
            });
            return _this;
        }
        Calc.prototype.OnKeyDown = function (e) {
            this.Value.append(e);
        };
        Calc.prototype.setName = function (e, d) {
            if (e === 'rslt')
                this.rslt = d;
        };
        __decorate([
            Core_1.attributes.property(Number),
            __metadata("design:type", Number)
        ], Calc.prototype, "fontSize", void 0);
        return Calc;
    }(Core_1.UI.TControl));
    exports.Calc = Calc;
    var App = (function (_super) {
        __extends(App, _super);
        function App() {
            var _this = _super.call(this, document.createElement('div')) || this;
            _this.modal = new Core_1.UI.Modal();
            _this.calculator = new Calc();
            require('style|./lib/q/assets/style/bundle.css', void 0, void 0, context_1.context);
            _this.addEventListener('click', function (s, e, p) {
                if (_this.modal.IsOpen)
                    return;
                _this.modal.Open();
            }, _this);
            return _this;
        }
        App.prototype.Check = function () {
        };
        App.prototype.showPage = function () {
            Core_1.UI.Desktop.Current.Add(this);
            Core_1.UI.Desktop.Current.CurrentApp = this;
        };
        App.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            this.modal.OnInitialized = function (m) {
                _this.modal.Content = _this.calculator;
                m.OkTitle("Close");
                m.Canceltitle(null);
            };
        };
        App.prototype.ShowApp = function () {
            Core_1.UI.Desktop.Current.Add(this);
            Core_1.UI.Desktop.Current.CurrentApp = this;
            this.modal.Open();
            Core_1.UI.Spinner.Default.Pause();
        };
        return App;
    }(Core_1.UI.Layout));
    (new App()).ShowApp();
});
//# sourceMappingURL=calc.js.map