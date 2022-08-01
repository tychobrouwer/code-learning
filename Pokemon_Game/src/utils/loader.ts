interface ImageType {
  [imageKey: string]: HTMLImageElement;
}

export class Loader {
  private images: ImageType

  constructor() {
    this.images = {};
  }

  loadImage(key: string, src: string): Promise<HTMLImageElement | string> {
    const img = new Image();

    const d: Promise<HTMLImageElement | string> = new Promise((resolve, reject) => {
        img.onload = function (this: Loader) {
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

  getImage (key: string): HTMLImageElement | undefined {
    if (key in this.images) {
      return this.images[key];
    }
  }

  loadImageToCanvas(asset: string, assetHeight: number, assetWidth: number): HTMLCanvasElement {
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