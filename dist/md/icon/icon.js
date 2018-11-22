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
    var icon = (function (_super) {
        __extends(icon, _super);
        function icon() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        icon_1 = icon;
        icon._builder = function (e) {
            e.node.e.Control = new icon_1(e.node.Dom);
        };
        icon.prototype.reset = function () {
            _super.prototype.reset.call(this);
            var d = this._view;
            var s = parseInt(d.getAttribute('size'));
            if (!isNaN(s))
                this.Size = s;
            var n = d.getAttribute('name');
            if (n)
                this.Name = n;
            if ((n = d.getAttribute('src')))
                this.Src = n;
            return this;
        };
        icon.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.applyStyle("md-icon", 'md-icon-font');
        };
        icon.prototype.Add = function (child) {
            if (child instanceof Text)
                this.Name = child.textContent.trim();
            return this;
        };
        icon.prototype._onNameChanged = function (e) {
            this.applyStyle('md-icon-font').disapplyStyle('md-svg-loader', 'md-icon-image');
        };
        icon.prototype._onSrcChanged = function (e) {
            this.disapplyStyle('md-icon-font').applyStyle('md-svg-loader', 'md-icon-image');
        };
        icon.prototype._onSizeChanged = function (e) {
            this.View.classList.remove.apply(this.View.classList, icon_1.__sizes__);
            this.applyStyle(icon_1.__sizes__[e._new] || "md-size-2x");
        };
        var icon_1;
        icon.__sizes__ = ["md-size-2x", "md-size-3x", "md-size-4x", "md-size-5x"];
        __decorate([
            Core_1.bind.property(String, void 0, void 0, icon_1.prototype._onNameChanged),
            __metadata("design:type", String)
        ], icon.prototype, "Name", void 0);
        __decorate([
            Core_1.bind.property(String, void 0, void 0, icon_1.prototype._onSrcChanged),
            __metadata("design:type", String)
        ], icon.prototype, "Src", void 0);
        __decorate([
            Core_1.bind.property(Number, void 0, void 0, icon_1.prototype._onSizeChanged),
            __metadata("design:type", Number)
        ], icon.prototype, "Size", void 0);
        __decorate([
            Dom_1.attributes.ComponentHandler("md-icon", component_1.templateWrapper({ templateName: "md-icon" })),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], icon, "_builder", null);
        icon = icon_1 = __decorate([
            Dom_1.attributes.Event({ name: 'click' })
        ], icon);
        return icon;
    }(component_1.component));
    exports.icon = icon;
});
//# sourceMappingURL=icon.js.map