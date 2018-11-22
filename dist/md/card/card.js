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
define(["require", "exports", "../../../lib/q/Core", "../../../lib/q/sys/Dom", "../component"], function (require, exports, Core_1, Dom_1, component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var card = (function (_super) {
        __extends(card, _super);
        function card() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(card.prototype, "cardClasses", {
            get: function () {
                return this.get(Core_1.bind.DObject.GetProperty(card, "cardClasses"));
            },
            set: function (v) {
                this.set(Core_1.bind.DObject.GetProperty(card, "cardClasses"), v);
            },
            enumerable: true,
            configurable: true
        });
        card.prototype.resetCardClasses = function () {
            this.cardClasses = component_1.stringifyClass({
                'md-with-hover': this.mdWithHover,
                'md-expand-active': this.expand
            });
        };
        card._builder = function (e) {
            e.node.e.Control = new card(e.node.Dom);
        };
        card.prototype.reset = function () {
            _super.prototype.reset.call(this);
            if (this._view.hasAttribute("md-with-hover"))
                this.mdWithHover = true;
            return this;
        };
        __decorate([
            Core_1.bind.property(Boolean, false, void 0, card.prototype.resetCardClasses),
            __metadata("design:type", Boolean)
        ], card.prototype, "mdWithHover", void 0);
        __decorate([
            Core_1.bind.property(Boolean, void 0, void 0, card.prototype.resetCardClasses),
            __metadata("design:type", Boolean)
        ], card.prototype, "expand", void 0);
        __decorate([
            Core_1.bind.property(String),
            __metadata("design:type", String),
            __metadata("design:paramtypes", [String])
        ], card.prototype, "cardClasses", null);
        __decorate([
            Dom_1.attributes.ComponentHandler("md-card", component_1.templateWrapper({ templateName: "md-card" })),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], card, "_builder", null);
        return card;
    }(component_1.component));
    exports.card = card;
});
//# sourceMappingURL=card.js.map