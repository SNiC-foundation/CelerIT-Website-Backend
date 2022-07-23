import QRCode from 'qrcode';
import * as forge from 'node-forge';
import keys from './keys.json';

// sign data with a private key and output DigestInfo DER-encoded bytes
// (defaults to RSASSA PKCS#1 v1.5)
const md = forge.md.sha1.create();

// const publicKey = forge.pki.publicKeyFromPem(keys.publicKeyPem);
const privateKey = forge.pki.privateKeyFromPem(keys.privateKeyPem);

md.update('sign this', 'utf8');
const encryptedId = privateKey.sign(md);

QRCode.toFile('../../../src/qrcodes/generated/foo.png', encryptedId, {
  color: {
    dark: '#000000', // Black dots
    light: '#0000', // Transparent background
  },
}, (err) => {
  if (err) throw err;
  console.log('done');
});
