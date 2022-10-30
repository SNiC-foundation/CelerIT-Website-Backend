import * as forge from 'node-forge';
import * as fs from 'fs';

// generate a random key and IV
// Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
const key = forge.random.getBytesSync(16);
const iv = forge.random.getBytesSync(16);

const toJSONFile = JSON.stringify({
  key,
  iv,
});

fs.writeFile('../../../src/qrcodes/keys.json', toJSONFile, (err) => {
  if (err) {
    console.log(err);
  }
});

// const fromJSONFile = JSON.parse(toJSONFile);
// const publicKey = forge.pki.publicKeyFromPem(fromJSONFile.publicKeyPem);
// const privateKey = forge.pki.privateKeyFromPem(fromJSONFile.privateKeyPem);
//
// console.log(publicKey, privateKey);
