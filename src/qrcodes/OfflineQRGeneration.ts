import QRCode from 'qrcode';

const encryptedId = 'faoufhuhuhjrhh';

QRCode.toFile('../../../src/qrcodes/generated/foo.png', encryptedId, {
  color: {
    dark: '#000000', // Black dots
    light: '#0000', // Transparent background
  },
}, (err) => {
  if (err) throw err;
  console.log('done');
});
