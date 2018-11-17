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
define(["require", "exports", "../lib/q/Core"], function (require, exports, Core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            else if (c == 'c' || c == "Escape")
                return this.clear();
            else if (c == "Backspace") {
                if (this.Num == 0)
                    return;
                var x = this.Num.toString();
                x = x.substr(0, x.length - 1);
                var v = parseFloat(x);
                ;
                this.Num = isNaN(v) ? 0 : v;
                this.Stream = this.Stream.substr(0, this.Stream.length - 1);
                return;
            }
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
                if (c == '=' || c == 'Enter') {
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
            '=': function (a, b) { return b; },
            'Enter': function (a, b) { return b; },
            '+': function (a, b) { return a + b; },
            '-': function (a, b) { return a - b; },
            '*': function (a, b) { return a * b; },
            '/': function (a, b) { return a / b; }
        };
        __decorate([
            Core_1.bind.property1(Number, { StaticName: "DPResult" }),
            __metadata("design:type", Number)
        ], CalcData.prototype, "Result", void 0);
        __decorate([
            Core_1.bind.property(String, ''),
            __metadata("design:type", String)
        ], CalcData.prototype, "Oper", void 0);
        __decorate([
            Core_1.bind.property(Number, 0),
            __metadata("design:type", Number)
        ], CalcData.prototype, "Num", void 0);
        __decorate([
            Core_1.bind.property(String, ''),
            __metadata("design:type", String)
        ], CalcData.prototype, "Stream", void 0);
        return CalcData;
    }(Core_1.bind.DObject));
    exports.CalcData = CalcData;
});
//# sourceMappingURL=calc-logic.js.map