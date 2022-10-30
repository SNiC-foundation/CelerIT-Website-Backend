import JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';
import path from 'path';
import * as fs from 'fs';

class BarcodeGenerator {
  private text: string;

  private location: string;

  constructor(text: string, location: string) {
    this.text = text;
    this.location = location;
  }

  public generateCode() {
    const canvas = createCanvas(80, 40);
    JsBarcode(canvas, this.text, { format: 'CODE128' });
    const stream = canvas.createPNGStream();
    const file = fs.createWriteStream(path.join(this.location, `${this.text}.png`));
    stream.pipe(file);
  }
}

export default BarcodeGenerator;
