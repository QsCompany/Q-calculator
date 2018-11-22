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
define(["require", "exports", "../../../../lib/q/sys/Dom", "../../component"], function (require, exports, Dom_1, component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var cardMediaActions = (function (_super) {
        __extends(cardMediaActions, _super);
        function cardMediaActions() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        cardMediaActions._builder = function (e) {
            e.node.e.Control = new cardMediaActions(e.node.Dom);
        };
        __decorate([
            Dom_1.attributes.ComponentHandler("md-card-media-actions", component_1.templateWrapper({ templateName: "md-card-media-actions" })),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], cardMediaActions, "_builder", null);
        return cardMediaActions;
    }(component_1.component));
    exports.cardMediaActions = cardMediaActions;
});
//# sourceMappingURL=md-card-media-actions.js.map