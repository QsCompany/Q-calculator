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
    var button = (function (_super) {
        __extends(button, _super);
        function button() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.attrs = {
                test: true, bind: false,
                is: "where"
            };
            return _this;
        }
        button_1 = button;
        button._builder = function (e) {
            e.node.e.Control = new button_1(e.node.Dom).reset();
        };
        button.prototype.reset = function () {
            _super.prototype.reset.call(this);
            var d = this._view;
            if (d.hasAttribute("float"))
                this.applyStyle("md-fab");
            if (d.hasAttribute("round"))
                this.applyStyle('md-icon-button');
            if (d.hasAttribute("dense"))
                this.applyStyle('md-dense');
            if (d.hasAttribute("raised"))
                this.applyStyle('md-raised');
            return this;
        };
        var button_1;
        __decorate([
            Dom_1.attributes.ComponentHandler("md-button", component_1.templateWrapper({ templateName: "md-button" })),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], button, "_builder", null);
        button = button_1 = __decorate([
            Dom_1.attributes.Event({ name: 'click' })
        ], button);
        return button;
    }(component_1.component));
    exports.button = button;
});
//# sourceMappingURL=button.js.map