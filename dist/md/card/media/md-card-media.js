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
    var cardMedia = (function (_super) {
        __extends(cardMedia, _super);
        function cardMedia() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        cardMedia._builder = function (e) {
            e.node.e.Control = new cardMedia(e.node.Dom);
        };
        cardMedia.prototype._resetMediaClasses = function () {
            var classes = {};
            if (this.mdRatio) {
                var ratio = this.getAspectRatio();
                if (ratio) {
                    var horiz = ratio[0], vert = ratio[1];
                    classes["md-ratio-" + horiz + "-" + vert] = true;
                }
            }
            if (this.mdMedium || this.mdBig) {
                classes = {
                    'md-medium': this.mdMedium,
                    'md-big': this.mdBig
                };
            }
            return this.mediaClasses = component_1.stringifyClass(classes);
        };
        cardMedia.prototype.getAspectRatio = function () {
            var ratio = [];
            if (this.mdRatio.indexOf(':') !== -1) {
                ratio = this.mdRatio.split(':');
            }
            else if (this.mdRatio.indexOf('/') !== -1) {
                ratio = this.mdRatio.split('/');
            }
            else if (this.mdRatio.indexOf('-') !== -1) {
                ratio = this.mdRatio.split('-');
            }
            return ratio.length === 2 ? ratio : null;
        };
        cardMedia.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this._resetMediaClasses();
        };
        __decorate([
            Core_1.bind.property(String, void 0, void 0, cardMedia.prototype._resetMediaClasses),
            __metadata("design:type", String)
        ], cardMedia.prototype, "mdRatio", void 0);
        __decorate([
            Core_1.bind.property(Boolean, void 0, void 0, cardMedia.prototype._resetMediaClasses),
            __metadata("design:type", Boolean)
        ], cardMedia.prototype, "mdMedium", void 0);
        __decorate([
            Core_1.bind.property(Boolean, void 0, void 0, cardMedia.prototype._resetMediaClasses),
            __metadata("design:type", Boolean)
        ], cardMedia.prototype, "mdBig", void 0);
        __decorate([
            Dom_1.attributes.ComponentHandler("md-card-media", component_1.templateWrapper({ templateName: "md-card-media" })),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], cardMedia, "_builder", null);
        return cardMedia;
    }(component_1.component));
    exports.cardMedia = cardMedia;
});
//# sourceMappingURL=md-card-media.js.map