define(["require", "exports", "../lib/q/Core"], function (require, exports, Core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Promise = (function () {
        function Promise(runner) {
            this.runner = runner;
            this._thenStack = [];
            this._catchStack = [];
            Core_1.thread.Dispatcher.call(this, this.handle, runner);
        }
        Object.defineProperty(Promise.prototype, "success", {
            get: function () { return this._success; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Promise.prototype, "result", {
            get: function () { return this._result; },
            enumerable: true,
            configurable: true
        });
        Promise.prototype.handle = function (runner) {
            var _this = this;
            try {
                runner(function (d) { return _this._resolve(d); }, function (d) { return _this._reject(d); });
            }
            catch (e) {
                this._reject(e);
            }
        };
        Promise.prototype.then = function (resolve) {
            if (this._success === true)
                try {
                    resolve(this._result);
                }
                catch (e) { }
            else if (this._success === void 0)
                this._thenStack.push(resolve);
            return this;
        };
        Promise.prototype.catch = function (reject) {
            if (this._success === false)
                try {
                    reject(this._result);
                }
                catch (e) { }
            else if (this._success === void 0)
                this._catchStack.push(reject);
            return this;
        };
        Promise.prototype._resolve = function (d) {
            this._success = true;
            this._result = d;
            for (var _i = 0, _a = this._thenStack; _i < _a.length; _i++) {
                var t = _a[_i];
                try {
                    t(d);
                }
                catch (_b) {
                }
            }
            return this;
        };
        Promise.prototype._reject = function (d) {
            this._success = false;
            this._result = d;
            for (var _i = 0, _a = this._catchStack; _i < _a.length; _i++) {
                var t = _a[_i];
                try {
                    t(d);
                }
                catch (_b) {
                }
            }
            return this;
        };
        return Promise;
    }());
    exports.Promise = Promise;
});
//# sourceMappingURL=Promise.js.map