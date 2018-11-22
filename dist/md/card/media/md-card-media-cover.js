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
    var cardMediaCover = (function (_super) {
        __extends(cardMediaCover, _super);
        function cardMediaCover() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        cardMediaCover._builder = function (e) {
            e.node.e.Control = new cardMediaCover(e.node.Dom);
        };
        cardMediaCover.prototype.setName = function (name, dom, cnt, e) {
            if (name == 'backdrop')
                this.backdrop = dom;
            return true;
        };
        cardMediaCover.prototype.initialize = function () {
            var _this = this;
            var applyBackground = function (darkness) {
                if (darkness === void 0) { darkness = 0.6; }
                if (_this.mdTextScrim) {
                    _this.applyScrimColor(darkness);
                }
                else if (_this.mdSolid) {
                    _this.applySolidColor(darkness);
                }
            };
            var image = this._view.querySelector('img');
            if (image && (this.mdTextScrim || this.mdSolid)) {
                this.getImageLightness(image, function (lightness) {
                    var limit = 256;
                    var darkness = (Math.abs(limit - lightness) * 100 / limit + 15) / 100;
                    if (darkness >= 0.7) {
                        darkness = 0.7;
                    }
                    applyBackground(darkness);
                }, applyBackground);
            }
        };
        cardMediaCover.prototype._coverClasses = function () {
            return this.coverClasses = component_1.stringifyClass({
                'md-text-scrim': this.mdTextScrim,
                'md-solid': this.mdSolid
            });
        };
        cardMediaCover.prototype._coverStyles = function () {
            return this.coverStyles = component_1.stringifyStyle({
                background: this.backdropBackground
            });
        };
        cardMediaCover.prototype.applyScrimColor = function (darkness) {
            if (this.backdrop) {
                this.backdropBackground = "linear-gradient(to bottom, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, " + darkness / 2 + ") 66%, rgba(0, 0, 0, " + darkness + ") 100%)";
            }
        };
        cardMediaCover.prototype.applySolidColor = function (darkness) {
            var area = this._view.querySelector('.md-card-area');
            if (area) {
                area.style.background = "rgba(0, 0, 0, " + darkness + ")";
            }
        };
        cardMediaCover.prototype.getImageLightness = function (image, onLoad, onError) {
            var canvas = document.createElement('canvas');
            image.crossOrigin = 'Anonymous';
            image.onload = function () {
                var colorSum = 0;
                var ctx;
                var imageData;
                var imageMetadata;
                var r;
                var g;
                var b;
                var average;
                canvas.width = this.width;
                canvas.height = this.height;
                ctx = canvas.getContext('2d');
                ctx.drawImage(this, 0, 0);
                imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                imageMetadata = imageData.data;
                for (var x = 0, len = imageMetadata.length; x < len; x += 4) {
                    r = imageMetadata[x];
                    g = imageMetadata[x + 1];
                    b = imageMetadata[x + 2];
                    average = Math.floor((r + g + b) / 3);
                    colorSum += average;
                }
                onLoad(Math.floor(colorSum / (this.width * this.height)));
            };
            image.onerror = onError;
        };
        __decorate([
            Core_1.bind.property(String),
            __metadata("design:type", String)
        ], cardMediaCover.prototype, "coverClasses", void 0);
        __decorate([
            Core_1.bind.property(String),
            __metadata("design:type", String)
        ], cardMediaCover.prototype, "coverStyles", void 0);
        __decorate([
            Core_1.bind.property(Boolean, void 0, void 0, cardMediaCover.prototype._coverClasses),
            __metadata("design:type", Boolean)
        ], cardMediaCover.prototype, "mdTextScrim", void 0);
        __decorate([
            Core_1.bind.property(Boolean, void 0, void 0, cardMediaCover.prototype._coverClasses),
            __metadata("design:type", Boolean)
        ], cardMediaCover.prototype, "mdSolid", void 0);
        __decorate([
            Core_1.bind.property(String, "", void 0, cardMediaCover.prototype._coverStyles),
            __metadata("design:type", String)
        ], cardMediaCover.prototype, "backdropBackground", void 0);
        __decorate([
            Dom_1.attributes.ComponentHandler("md-card-media-cover", component_1.templateWrapper({ templateName: "md-card-media-cover" })),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], cardMediaCover, "_builder", null);
        return cardMediaCover;
    }(component_1.component));
    exports.cardMediaCover = cardMediaCover;
});
//# sourceMappingURL=md-card-media-cover.js.map