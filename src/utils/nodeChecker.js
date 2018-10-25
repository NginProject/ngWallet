// @flow
import { EthRpc, convert } from 'emerald-js';

type NodeInfo = {
    chain: string,
    chainId: number,
    clientVersion: string,
}

export default class NodeChecker {
    ethRpc: EthRpc;


    constructor(ethRpc: EthRpc) {
      this.ethRpc = ethRpc;
    }

    check(): Promise<NodeInfo> {
      return this.exists()
        .then(clientVersion => this.getChain()
          .then(chain => ({
            ...chain,
            clientVersion,
          })));
    }

    exists() {
      return this.ethRpc.web3.clientVersion();
    }

    getChain(): Promise<any> {
      return new Promise((resolve, reject) => {
        this.ethRpc.eth.getBlockByNumber('0x0', false).then((result) => {
          if (true){
            // (result.hash === NodeChecker.NGIN_MAINNET_GENESIS) {
            // TODO: GENESIS
            resolve({ chain: 'mainnet', chainId: 111});
          // } else if (result.hash === NodeChecker.NGIN_MORDEN_GENESIS) {
          //   resolve({ chain: 'morden', chainId: 101 });
          // } else {
          //   resolve({ chain: 'unknown', chainId: 0 });
          }
        }).catch((error) => {
          reject(error);
        });
      });
    }
}
