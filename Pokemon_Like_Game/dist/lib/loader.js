"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
class Loader {
    constructor() {
        this.images = {};
    }
    loadImage(key, src) {
        const img = new Image();
        const d = new Promise((resolve, reject) => {
            img.onload = function () {
                this.images[key] = img;
                resolve(img);
            }.bind(this);
            img.onerror = function () {
                reject('Could not load image: ' + src);
            };
        });
        img.src = src;
        return d;
    }
    getImage(key) {
        if (key in this.images) {
            return this.images[key];
        }
    }
    loadImageToCanvas(asset, assetHeight, assetWidth) {
        const assetCanvas = document.createElement('canvas');
        assetCanvas.height = assetHeight;
        assetCanvas.width = assetWidth;
        const tileAtlasCtx = assetCanvas.getContext('2d');
        const tileAtlasPreloader = this.getImage(asset);
        if (tileAtlasCtx && tileAtlasPreloader) {
            tileAtlasCtx.drawImage(tileAtlasPreloader, 0, 0);
        }
        return assetCanvas;
    }
}
exports.Loader = Loader;
//# sourceMappingURL=loader.js.map