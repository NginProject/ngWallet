const DefaultGeth = {
  format: 'v1',
  channel: 'stable',
  app: {
    version: '5.2.0',
  },
  download: [
    {
      platform: 'windows',
      binaries: [
        {
          type: 'https',
          pack: 'zip',
          url: 'https://github.com/NginProject/ngind/releases/download/v0.1.3/ngind-windows-amd64.zip',
        },
      ],
      signatures: [
        {
          type: 'pgp',
          url: 'https://github.com/NginProject/ngind/releases/download/v0.1.3/ngind-windows-amd64.zip.asc',
        },
      ],
    },
    {
      platform: 'linux',
      binaries: [
        {
          type: 'https',
          pack: 'zip',
          url: 'https://github.com/NginProject/ngind/releases/download/v0.1.3/ngind-linux-amd64.zip',
        },
      ],
      signatures: [
        {
          type: 'pgp',
          url: 'https://github.com/NginProject/ngind/releases/download/v0.1.3/ngind-linux-amd64.zip.asc',
        },
      ],
    },
  ],
};

module.exports = {
  DefaultGeth,
};
