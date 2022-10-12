import QRCode from 'qrcode';
import * as forge from 'node-forge';
import keys from './keys.json';

const { key, iv } = keys;

const cipher = forge.cipher.createCipher('AES-CBC', key);
cipher.start({ iv });
cipher.update(forge.util.createBuffer('217'));
cipher.finish();
const encrypted = cipher.output;
// outputs encrypted hex

QRCode.toFile('../../../src/qrcodes/generated/foo.png', encrypted.toHex(), {
  color: {
    dark: '#000000', // Black dots
    light: '#0000', // Transparent background
  },
}, (err) => {
  if (err) throw err;
  console.log('done');
});

console.log(encrypted);
console.log(forge.util.createBuffer(forge.util.hexToBytes(encrypted.toHex())));

// decrypt some bytes using CBC mode
// (other modes include: CFB, OFB, CTR, and GCM)
const decipher = forge.cipher.createDecipher('AES-CBC', key);
decipher.start({ iv });
decipher.update(forge.util.createBuffer(forge.util.hexToBytes(encrypted.toHex())));
const result = decipher.finish(); // check 'result' for true/false
console.log(result);
// outputs decrypted hex
console.log(decipher.output.toString());
