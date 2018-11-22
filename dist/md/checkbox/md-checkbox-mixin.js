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
define(["require", "exports", "../component", "../../../lib/q/Core", "../../../lib/q/sys/Dom"], function (require, exports, component_1, Core_1, Dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MdCheckboxMixin = (function (_super) {
        __extends(MdCheckboxMixin, _super);
        function MdCheckboxMixin() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        __decorate([
            Core_1.bind.property1(Object),
            __metadata("design:type", Object)
        ], MdCheckboxMixin.prototype, "model", void 0);
        __decorate([
            Core_1.bind.property1(Boolean, { defaultValue: true }),
            __metadata("design:type", Boolean)
        ], MdCheckboxMixin.prototype, "trueValue", void 0);
        __decorate([
            Core_1.bind.property1(Boolean, { defaultValue: false }),
            __metadata("design:type", Boolean)
        ], MdCheckboxMixin.prototype, "falseValue", void 0);
        MdCheckboxMixin = __decorate([
            Dom_1.attributes.Event({ name: 'change' })
        ], MdCheckboxMixin);
        return MdCheckboxMixin;
    }(component_1.component));
    exports.MdCheckboxMixin = MdCheckboxMixin;
});
//# sourceMappingURL=md-checkbox-mixin.js.map