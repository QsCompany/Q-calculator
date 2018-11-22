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
define(["require", "exports", "../../../../lib/q/sys/Dom", "../../component", "../../../../lib/q/Core"], function (require, exports, Dom_1, component_1, Core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var cardExpandContent = (function (_super) {
        __extends(cardExpandContent, _super);
        function cardExpandContent() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.contentStyles = "";
            _this.marginTop = 0;
            _this.transitionEnabled = true;
            return _this;
        }
        cardExpandContent._builder = function (e) {
            e.node.e.Control = new cardExpandContent(e.node.Dom);
        };
        cardExpandContent.prototype.initialize = function () {
            this.applyStyle("md-card-expand-content");
            this.calculateMarginTopImmediately();
            this.resizeObserver = component_1.MdObserverElement(this._view, {
                childList: true,
                characterData: true,
                subtree: true
            }, this.calculateMarginTopImmediately.bind(this), this);
        };
        cardExpandContent.prototype.resetContentStyles = function () {
            this.contentStyles = component_1.stringifyStyle({
                'margin-top': "-" + this.marginTop + "px",
                'opacity': this.marginTop === 0 ? 1 : 0,
                'transition-property': this.transitionEnabled ? null : 'none'
            });
        };
        cardExpandContent.prototype.calculateMarginTop = function () {
            if (!this.expand) {
                this.marginTop = this._view.children[0].offsetHeight;
            }
            else {
                this.marginTop = 0;
            }
        };
        cardExpandContent.prototype.calculateMarginTopImmediately = function () {
            if (!this)
                throw "";
            if (this.expand)
                return;
            this.transitionEnabled = false;
            this.$nextTick(function () {
                this.calculateMarginTop();
                this.$nextTick(function () {
                    this.transitionEnabled = true;
                    this.resetContentStyles();
                });
            });
        };
        cardExpandContent.prototype.Dispose = function () {
            _super.prototype.Dispose.call(this);
            this.resizeObserver.disconnect();
        };
        __decorate([
            Core_1.bind.property(String),
            __metadata("design:type", String)
        ], cardExpandContent.prototype, "contentStyles", void 0);
        __decorate([
            Core_1.bind.property(Boolean, void 0, void 0, cardExpandContent.prototype.calculateMarginTop),
            __metadata("design:type", Boolean)
        ], cardExpandContent.prototype, "expand", void 0);
        __decorate([
            Dom_1.attributes.ComponentHandler("md-card-expand-content", component_1.templateWrapper({ templateName: "md-card-expand-content" })),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], cardExpandContent, "_builder", null);
        return cardExpandContent;
    }(component_1.component));
    exports.cardExpandContent = cardExpandContent;
});
//# sourceMappingURL=card-expand-content.js.map