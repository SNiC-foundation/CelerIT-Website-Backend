import QRCode from 'qrcode';
import path from 'path';
import Generator from './Generator';

class QrCodeGenerator extends Generator {
  public async generateCode() {
    await QRCode.toFile(path.join(this.location, `${this.text}.png`), this.text, {
      color: {
        dark: '#000000', // Black dots
        light: '#0000', // Transparent background
      },
    });
  }
}

export default QrCodeGenerator;
