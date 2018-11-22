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
define(["require", "exports", "../../../lib/q/sys/Dom", "../component"], function (require, exports, Dom_1, component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var badgeStandalone = (function (_super) {
        __extends(badgeStandalone, _super);
        function badgeStandalone() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        badgeStandalone_1 = badgeStandalone;
        badgeStandalone._builder = function (e) {
            e.node.e.Control = new badgeStandalone_1(e.node.Dom);
        };
        var badgeStandalone_1;
        __decorate([
            Dom_1.attributes.ComponentHandler("md-badge-standalone", component_1.templateWrapper({ templateName: "md-badge-standalone" })),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], badgeStandalone, "_builder", null);
        badgeStandalone = badgeStandalone_1 = __decorate([
            Dom_1.attributes.Event({ name: 'click' })
        ], badgeStandalone);
        return badgeStandalone;
    }(component_1.component));
    exports.badgeStandalone = badgeStandalone;
});
//# sourceMappingURL=md-badge-standalone.js.map