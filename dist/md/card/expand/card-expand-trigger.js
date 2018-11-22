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
define(["require", "exports", "../../../../lib/q/sys/Dom", "../../component", "../card"], function (require, exports, Dom_1, component_1, card_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var cardExpandTrigger = (function (_super) {
        __extends(cardExpandTrigger, _super);
        function cardExpandTrigger() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        cardExpandTrigger._builder = function (e) {
            e.node.e.Control = new cardExpandTrigger(e.node.Dom);
        };
        cardExpandTrigger.prototype.initialize = function () {
            this.addEventListener('click', this.onClick, void 0, this);
        };
        cardExpandTrigger.prototype.onClick = function () {
            var p = this.Parent;
            while (p)
                if (p instanceof card_1.card) {
                    p.expand = !p.expand;
                    return;
                }
                else
                    p = p.Parent;
        };
        __decorate([
            Dom_1.attributes.ComponentHandler("md-card-expand-trigger", component_1.templateWrapper({ templateName: "md-card-expand-trigger" })),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], cardExpandTrigger, "_builder", null);
        return cardExpandTrigger;
    }(component_1.component));
    exports.cardExpandTrigger = cardExpandTrigger;
});
//# sourceMappingURL=card-expand-trigger.js.map