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
define(["require", "exports", "../../../lib/q/sys/Dom", "../component", "../../../lib/q/Core", "../../Promise"], function (require, exports, Dom_1, component_1, Core_1, Promise_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mdSVGStore = {};
    var svgLoader = (function (_super) {
        __extends(svgLoader, _super);
        function svgLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        svgLoader_1 = svgLoader;
        svgLoader._builder = function (e) {
            e.node.e.Control = new svgLoader_1(e.node.Dom);
        };
        svgLoader.prototype.isSVG = function (mimetype) {
            return mimetype.indexOf('svg') >= 0;
        };
        svgLoader.prototype.setHtml = function () {
            var _this = this;
            if (!this.mdSrc)
                this.html = "";
            else
                mdSVGStore[this.mdSrc].then(function (html) {
                    _this.html = html;
                    Core_1.PaintThread.OnPaint({ args: ['md-loaded'], method: _this.$emit, owner: _this });
                });
        };
        svgLoader.prototype.unexpectedError = function (reject) {
            this.error = "Something bad happened trying to fetch " + this.mdSrc + ".";
            reject(this.error);
        };
        svgLoader.prototype.loadSVG = function () {
            var _this = this;
            if ((!!this.mdSrc) && !mdSVGStore.hasOwnProperty(this.mdSrc)) {
                mdSVGStore[this.mdSrc] = new Promise_1.Promise(function (resolve, reject) {
                    var request = new XMLHttpRequest();
                    request.open('GET', _this.mdSrc, true);
                    request.onload = function () {
                        var mimetype = request.getResponseHeader('content-type');
                        if (request.status === 200) {
                            if (_this.isSVG(mimetype)) {
                                resolve(request.response);
                                _this.setHtml();
                            }
                            else {
                                _this.error = "The file " + _this.mdSrc + " is not a valid SVG.";
                                reject(_this.error);
                            }
                        }
                        else if (request.status >= 400 && request.status < 500) {
                            _this.error = "The file " + _this.mdSrc + " do not exists.";
                            reject(_this.error);
                        }
                        else {
                            _this.unexpectedError(reject);
                        }
                    };
                    request.onerror = function () { return _this.unexpectedError(reject); };
                    request.onabort = function () { return _this.unexpectedError(reject); };
                    request.send();
                });
            }
            else {
                this.setHtml();
            }
        };
        svgLoader.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.loadSVG();
        };
        var svgLoader_1;
        __decorate([
            Core_1.bind.property1(String, {
                changed: function () {
                    this.html = null;
                    this.loadSVG();
                }
            }),
            __metadata("design:type", String)
        ], svgLoader.prototype, "mdSrc", void 0);
        __decorate([
            Core_1.bind.property(String),
            __metadata("design:type", String)
        ], svgLoader.prototype, "html", void 0);
        __decorate([
            Core_1.bind.property(String),
            __metadata("design:type", String)
        ], svgLoader.prototype, "error", void 0);
        __decorate([
            Dom_1.attributes.ComponentHandler("md-svg-loader", component_1.templateWrapper({ templateName: "md-svg-loader" })),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], svgLoader, "_builder", null);
        svgLoader = svgLoader_1 = __decorate([
            Dom_1.attributes.Event({ name: 'click' })
        ], svgLoader);
        return svgLoader;
    }(component_1.component));
    exports.svgLoader = svgLoader;
});
//# sourceMappingURL=svg-loader.js.map