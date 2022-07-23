import * as forge from 'node-forge';
import * as fs from 'fs';

const keypair = forge.pki.rsa.generateKeyPair({ bits: 512 });

const toJSONFile = JSON.stringify({
  publicKeyPem: forge.pki.publicKeyToPem(keypair.publicKey),
  privateKeyPem: forge.pki.privateKeyToPem(keypair.privateKey),
});

fs.writeFile('../../../src/qrcodes/keys.txt', toJSONFile, (err) => {
  if (err) {
    console.log(err);
  }
});

// const fromJSONFile = JSON.parse(toJSONFile);
// const publicKey = forge.pki.publicKeyFromPem(fromJSONFile.publicKeyPem);
// const privateKey = forge.pki.privateKeyFromPem(fromJSONFile.privateKeyPem);
//
// console.log(publicKey, privateKey);
