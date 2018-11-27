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
          url: 'https://github.com/NginProject/ngind/releases/download/v0.1.4/ngind-windows-amd64.zip',
        },
      ]
    },
    {
      platform: 'linux',
      binaries: [
        {
          type: 'https',
          pack: 'zip',
          url: 'https://github.com/NginProject/ngind/releases/download/v0.1.4/ngind-linux-amd64.zip',
        },
      ],
    },
  ],
};

module.exports = {
  DefaultGeth,
};
