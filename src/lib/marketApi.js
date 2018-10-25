import 'isomorphic-fetch';

const url = ''; // TODO: AfterListed
const currency = '';

export class MarketApi {
  call() {
    return new Promise((resolve, reject) => {
      this.getRates().then((json) => {
        if (json) {
          resolve(json);
        } else {
          reject(new Error(`Unknown JSON RPC response: ${json}`));
        }
      }).catch((error) => reject(error));
    });
  }

  getRates() {
   return fetch(url)
    .then((response) => response.json());
  }
}

/**
 * Creates rpc client instance or get
 * instance from Electron's main process
 */
function create() {
  return new MarketApi();
}
export const getRates = create();

export default getRates;
