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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _a;
    var badge = (function (_super) {
        __extends(badge, _super);
        function badge(dom) {
            var _this = _super.call(this, dom) || this;
            _this._badgeClasses();
            _this._styles();
            return _this;
        }
        badge_1 = badge;
        badge._builder = function (e) {
            e.node.e.Control = new badge_1(e.node.Dom);
        };
        badge.prototype._badgeClasses = function () {
            var _a;
            var staticClass = this.getStaticClass();
            return this.badgeClasses = component_1.stringifyClass(__assign((_a = {}, _a['md-position-' + this.mdPosition || 'top'] = true, _a['md-dense'] = this.mdDense, _a), staticClass));
        };
        badge.prototype._styles = function () {
            if (!this.$vnode)
                return this._view.getAttribute('style');
            return this.styles = this.$vnode.dom.getAttribute('style');
        };
        badge.prototype.getStaticClass = function () {
            var staticClass = this.$vnode ? this.$vnode.dom.className : this._view.className;
            function filterClasses() {
                return staticClass.split(' ').filter(function (val) { return val; }).reduce(function (result, key) {
                    result[key] = true;
                    return result;
                }, {});
            }
            return staticClass ? filterClasses() : {};
        };
        badge.prototype.Add = function (child) {
            this.set(badge_1.DPhasDefaultSlot, true);
            return _super.prototype.Add.call(this, child);
        };
        badge.prototype.initialize = function () {
        };
        badge.prototype.OnTemplateCompiled = function (node) {
            _super.prototype.OnTemplateCompiled.call(this, node);
        };
        var badge_1;
        __decorate([
            Core_1.bind.property1(String),
            __metadata("design:type", Object)
        ], badge.prototype, "mdContent", void 0);
        __decorate([
            Core_1.bind.property1(String, { defaultValue: 'top', changed: badge_1.prototype._badgeClasses }),
            __metadata("design:type", String)
        ], badge.prototype, "mdPosition", void 0);
        __decorate([
            Core_1.bind.property1(Boolean, { changed: badge_1.prototype._badgeClasses }),
            __metadata("design:type", Boolean)
        ], badge.prototype, "mdDense", void 0);
        __decorate([
            Core_1.bind.property(Boolean),
            __metadata("design:type", Boolean)
        ], badge.prototype, "hasDefaultSlot", void 0);
        __decorate([
            Core_1.bind.property1(String, {
                defaultValue: component_1.stringifyClass((_a = {},
                    _a['md-position-top'] = true,
                    _a['md-dense'] = true,
                    _a))
            }),
            __metadata("design:type", String)
        ], badge.prototype, "badgeClasses", void 0);
        __decorate([
            Core_1.bind.property(String),
            __metadata("design:type", String)
        ], badge.prototype, "styles", void 0);
        __decorate([
            Dom_1.attributes.ComponentHandler("md-badge", component_1.templateWrapper({ templateName: "md-badge" })),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], badge, "_builder", null);
        badge = badge_1 = __decorate([
            Dom_1.attributes.Event({ name: 'click' }),
            __metadata("design:paramtypes", [Object])
        ], badge);
        return badge;
    }(component_1.component));
    exports.badge = badge;
});
//# sourceMappingURL=md-badge.js.map