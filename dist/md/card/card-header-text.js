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
    var cardHeaderText = (function (_super) {
        __extends(cardHeaderText, _super);
        function cardHeaderText() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        cardHeaderText._builder = function (e) {
            e.node.e.Control = new cardHeaderText(e.node.Dom).reset();
        };
        cardHeaderText.prototype.addComponent = function (e) { this.Add(e.child.Dom); };
        cardHeaderText.prototype.initialize = function () { this.applyStyle("md-card-header-text"); };
        cardHeaderText.prototype.Add = function (child) { return _super.prototype.Add.call(this, child instanceof Node ? new Core_1.UI.Dom(child) : child); };
        cardHeaderText.prototype.OnParentChanged = function (_old, _new) {
            if (_old && this.parentClasses) {
                this.parentClasses.remove('md-card-header-flex');
            }
            if (_new) {
                this.parentClasses = _new.View.classList;
                if (this.parentClasses.contains('md-card-header')) {
                    this.parentClasses.add('md-card-header-flex');
                }
            }
        };
        __decorate([
            Dom_1.attributes.ContentHandler(true),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], cardHeaderText.prototype, "addComponent", null);
        __decorate([
            Dom_1.attributes.ComponentHandler("card-header-text"),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], cardHeaderText, "_builder", null);
        return cardHeaderText;
    }(component_1.component));
    exports.cardHeaderText = cardHeaderText;
});
//# sourceMappingURL=card-header-text.js.map