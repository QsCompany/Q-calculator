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
define(["require", "exports", "template|./calc.html", "./lib/q/Core"], function (require, exports, calc_html_1, Core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CalcData = (function (_super) {
        __extends(CalcData, _super);
        function CalcData() {
            var _this = _super.call(this) || this;
            _this.Num1 = 0;
            _this.Num2 = 0;
            _this.Oper = "+";
            return _this;
        }
        __decorate([
            Core_1.attributes.property(Number),
            __metadata("design:type", Number)
        ], CalcData.prototype, "Num1", void 0);
        __decorate([
            Core_1.attributes.property(String),
            __metadata("design:type", String)
        ], CalcData.prototype, "Oper", void 0);
        __decorate([
            Core_1.attributes.property(Number),
            __metadata("design:type", Number)
        ], CalcData.prototype, "Num2", void 0);
        return CalcData;
    }(Core_1.bind.DObject));
    exports.CalcData = CalcData;
    var Calc = (function (_super) {
        __extends(Calc, _super);
        function Calc() {
            var _this = _super.call(this, calc_html_1.template.get("calcView"), Core_1.UI.TControl.Me) || this;
            _this.Value = new CalcData();
            return _this;
        }
        return Calc;
    }(Core_1.UI.TControl));
    exports.Calc = Calc;
});
//# sourceMappingURL=calc.js.map