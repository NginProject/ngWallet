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
    title: 'Mainnet',
    id: 'local/mainnet',
  }
];


export function findNetwork(gethUrl, chainId) {
  return Networks.find((n) => {
    return (n.chain.id === chainId) && (n.geth.url === gethUrl);
  });
}
