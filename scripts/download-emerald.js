const os = require('os');
const process = require('process');
const { Downloader, getPlatformConfig } = require('emerald-js/lib/download');

const config = {
  format: 'v1',
  channel: 'stable',
  app: {
    version: '0.1.0',
  },
  download: [
    {
      platform: 'windows',
      binaries: [
        {
          type: 'https',
          pack: 'zip',
          url: 'https://github.com/NginProject/ngWallet-cli/releases/download/v0.1.0/ngWallet-cli-windows-amd64.zip',
        },
      ],
      signatures: [
        {
          type: 'pgp',
          url: 'https://github.com/NginProject/ngWallet-cli/releases/download/v0.1.0/ngWallet-cli-windows-amd64.zip.asc',
        },
      ],
    },
    {
      platform: 'linux',
      binaries: [
        {
          type: 'https',
          pack: 'zip',
          url: 'https://github.com/NginProject/ngWallet-cli/releases/download/v0.1.0/ngWallet-cli-linux-amd64.zip',
        },
      ],
      signatures: [
        {
          type: 'pgp',
          url: 'https://github.com/NginProject/ngWallet-cli/releases/download/v0.1.0/ngWallet-cli-linux-amd64.zip.asc',
        },
      ],
    },
  ],
};
const signers = '-----BEGIN PGP PUBLIC KEY BLOCK-----' + '\n\n'+
  'mQENBFvPNnkBCACy+/ZGJAC0FhDXVYWFpH5Kdk82SYJftleQUjOV5+Rsoik2ie/e'+ '\n' +
  '0pNEGjifXoSXMK75ojvhCw45DhZCSbSnuoxLUNgnkLEybJZ0nEkKTvKIgkmDtTfg'+ '\n' +
  'GRVD0Vcor9DnDahKyGDfDpbTvNHAP8iOBUIjfWSWrz7cMWjKMXy1/XhGTsKrZPDB'+ '\n' +
  'F51HP5WL4MBt7Wu0W8bYoorolS2Lg/mQiBpvCO3f5/FJhZTyeyISGqGSQ0gKsu1v'+ '\n' +
  'iS0NXGdMJ0pKGl/d6I2mgWHfU22PFl56uKyMiwiOMGW3QSEQ0axC5h+9nlxm5K2S'+ '\n' +
  '5K5wbUgMhYxa3IqTZsTyShUmZEeWRzl3MvxVABEBAAG0IFNlYXJjaGFpbiA8c2Vh'+ '\n' +
  'cmNoYWluQHlhbmRleC5jb20+iQFOBBMBCAA4AhsDBQsJCAcCBhUKCQgLAgQWAgMB'+ '\n' +
  'Ah4BAheAFiEEgQgPjNG7mJDovaBB4dwc2iyJ2x0FAlvPN90ACgkQ4dwc2iyJ2x2w'+ '\n' +
  'ZwgAohdsbPnHbgonixuhx7CDclMX3JRxXRH235Yv0wQKM/aV4R7vkuk34HyEvzZJ'+ '\n' +
  'kx5ejbobmK8+nIpS+t02mXie1AcY+FJz2vex0Coclh/OgOwZY/JN19y2+n3UCN8C'+ '\n' +
  'B+td88TIG4dQ4EBR7stDp+M2dwJy08GORkzoaDlZ2E9KqhmEnISVF4h/gjSh2qKm'+ '\n' +
  'ZsRrPRgijgSSXKSrphsDpbBbAXvI0KkNukXYjcXk9qxJzjNedpN9oUuO30SdH3hC'+ '\n' +
  'iHaBVeASB7Np/D8EAUpHSPnQzEMtnpDvNZQ3YVbEFUpGD+L2jHSNeu3fKIxrFjgS'+ '\n' +
  'WMwaHeZlnI0NsDrbjQUqCPUUebkBDQRbzzZ5AQgAvKtr2H1gzgTDUplCylGPswOn'+ '\n' +
  'XcBi8u92vKlk5djLD9ieXSsno0ery/7oQN15gDZ1llszsWrcuKlqtUh99QYk0l6e'+ '\n' +
  'HMLa3ooH5yiCjnoYovT7XzskG8JU8BvRNJliuSSsMu1dqsIHxY6vf1/xFoRFzFOC'+ '\n' +
  '+kAmFXrRlseQyupgNOkN0i8e1ZvPRE2dHLnJpqwBkbxM9zEYnZIKAgmunvkTym5Y'+ '\n' +
  'TQmH6WnmXJps4ooaldzH7fXyJgy38hyNllEXSJlqbUQ5hMTjwJPuihVjUDDMLQWT'+ '\n' +
  'SndjcX4nVKJP6qyZJHZQgrAPopgNWT/NRukAUACEDuPFihuQ75+DLGle2rzAiwAR'+ '\n' +
  'AQABiQE8BBgBCAAmFiEEgQgPjNG7mJDovaBB4dwc2iyJ2x0FAlvPNnkCGwwFCQPD'+ '\n' +
  'HscACgkQ4dwc2iyJ2x0IRAf9GBjH6f1olhrTy1bt08sx3r5Z0UQy2idxzbItVNS7'+ '\n' +
  'aqOn2JBsHlVGlXvmG/hc91eBUvl7H5HAE/9cMnDAiMMqD1I5vyOu7wNWlbkiMEgg'+ '\n' +
  'FYNrfQuZWUSWNMlohQFzR8Dz+2XVMbT2g+Ry8bqx0O3yoSQlv9y7gce8n7tjD+Of'+ '\n' +
  'hEru2gRdBrubPWOTl8ZL/Nyn9yDmbRe7NGy3/YnYG6J5rVeuUxP8Ww7YAXNlnqyJ'+ '\n' +
  'beBwr8lJEQCdNAyDOUqxUC/ds28rFnCQ70CI88uohwKMK0xL/kczUnZxmZM4HayY'+ '\n' +
  'e1frTe/7L9bsbyp4nvZfDc6hVFK8iMU0aPnhjRwGEzbuiQ==' +  '\n' +
  '=4Ozm' + '\n' +
  '-----END PGP PUBLIC KEY BLOCK-----';

const suffix = os.platform() === 'win32' ? '.exe' : '';
const fileName = `ngWallt-cli${suffix}`;

const downloader = new Downloader(getPlatformConfig(config), fileName, './', signers);
downloader.on('notify', (message) => {
  console.log(message);
});
downloader.on('error', (error) => {
  console.error(error);
});

downloader.downloadIfNotExists()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error during downloading ngWallet-cli:', error);
    process.exit(1);
  });
