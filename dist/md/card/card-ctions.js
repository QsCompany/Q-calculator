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
    var cardContent = (function (_super) {
        __extends(cardContent, _super);
        function cardContent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        cardContent._builder = function (e) {
            var d = e.node.Dom;
            var c = new cardContent(d);
            e.node.e.Control = c;
            c.reset();
            return e.node;
        };
        cardContent.prototype.addComponent = function (e) { this.Add(e.child.Dom); };
        cardContent.prototype.initialize = function () { this.applyStyle("md-card-content"); };
        cardContent.prototype.Add = function (child) {
            if (child instanceof Node)
                child = new Core_1.UI.Dom(child);
            _super.prototype.Add.call(this, child);
            return this;
        };
        __decorate([
            Dom_1.attributes.ContentHandler(true),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], cardContent.prototype, "addComponent", null);
        __decorate([
            Dom_1.attributes.ComponentHandler("card-content"),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], cardContent, "_builder", null);
        return cardContent;
    }(component_1.component));
    exports.cardContent = cardContent;
});
//# sourceMappingURL=card-ctions.js.map