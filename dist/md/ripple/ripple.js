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
define(["require", "exports", "../../../lib/q/sys/Dom", "../component", "../../../lib/q/Core"], function (require, exports, Dom_1, component_1, Core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ripple = (function (_super) {
        __extends(ripple, _super);
        function ripple(dom) {
            return _super.call(this, dom || component_1.wrapTemplate(component_1.cTemplates.get("md-ripple"))) || this;
        }
        ripple._builder = function (e) {
            e.node.e.Control = new ripple(e.node.Dom);
            window['ripple'] = e.node.e.Control;
        };
        ripple.prototype.reset = function () {
            _super.prototype.reset.call(this);
            return this;
        };
        ripple.prototype._rippleClasses = function () {
            return this.rippleClasses = component_1.stringifyClass({
                'md-disabled': this.mdDisabled
            });
        };
        ripple.prototype._waveClasses = function () {
            return this.waveClasses = component_1.stringifyClass({
                'md-centered': this.mdCentered
            });
        };
        __decorate([
            Core_1.bind.property1(Boolean, { changed: ripple.prototype._rippleClasses }),
            __metadata("design:type", Boolean)
        ], ripple.prototype, "mdDisabled", void 0);
        __decorate([
            Core_1.bind.property1(Boolean, { changed: ripple.prototype._waveClasses }),
            __metadata("design:type", Boolean)
        ], ripple.prototype, "mdCentered", void 0);
        __decorate([
            Core_1.bind.property1(Boolean, { defaultValue: true }),
            __metadata("design:type", Object)
        ], ripple.prototype, "mdEventTrigger", void 0);
        __decorate([
            Core_1.bind.property(String),
            __metadata("design:type", Object)
        ], ripple.prototype, "rippleClasses", void 0);
        __decorate([
            Core_1.bind.property(String),
            __metadata("design:type", Object)
        ], ripple.prototype, "waveClasses", void 0);
        __decorate([
            Dom_1.attributes.ComponentHandler("md-ripple", component_1.templateWrapper({ templateName: "md-ripple" })),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], ripple, "_builder", null);
        return ripple;
    }(component_1.component));
    exports.ripple = ripple;
});
//# sourceMappingURL=ripple.js.map