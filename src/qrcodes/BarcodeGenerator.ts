import JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';
import path from 'path';
import * as fs from 'fs';
import Generator from './Generator';

class BarcodeGenerator extends Generator {
  public generateCode() {
    const canvas = createCanvas(80, 40);
    JsBarcode(canvas, this.text, { format: 'CODE128' });
    const stream = canvas.createPNGStream();
    const file = fs.createWriteStream(path.join(this.location, `${this.text}.png`));
    stream.pipe(file);
    return Promise.resolve();
  }
}

export default BarcodeGenerator;
