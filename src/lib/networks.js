export const Networks = [
  {
    geth: {
      type: 'local',
      url: 'http://127.0.0.1:52521',
    },
    chain: {
      id: 111,
      name: 'mainnet',
    },
    title: 'Local Mainnet',
    id: 'local/mainnet',
  },
  {
    geth: {
      type: 'remote',
      url: 'https://node1.ngin.cash:443',
    },
    chain: {
      id: 111,
      name: 'mainnet',
    },
    title: 'Explorer Mainnet',
    id: 'remote/mainnet',
  }
];


export function findNetwork(gethUrl, chainId) {
  return Networks.find((n) => {
    return (n.chain.id === chainId) && (n.geth.url === gethUrl);
  });
}
