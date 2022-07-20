"use strict";
exports.__esModule = true;
exports.Loader = void 0;
var Loader = /** @class */ (function () {
    function Loader() {
        this.images = {};
    }
    Loader.prototype.loadImage = function (key, src) {
        var _this = this;
        var img = new Image();
        var d = new Promise(function (resolve, reject) {
            img.onload = function () {
                this.images[key] = img;
                resolve(img);
            }.bind(_this);
            img.onerror = function () {
                reject('Could not load image: ' + src);
            };
        });
        img.src = src;
        return d;
    };
    Loader.prototype.getImage = function (key) {
        if (key in this.images) {
            return this.images[key];
        }
    };
    return Loader;
}());
exports.Loader = Loader;
//# sourceMappingURL=loader.js.map