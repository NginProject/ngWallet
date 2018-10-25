import React from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import Header from '../../src/components/layout/Header';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { fromJS } from 'immutable';
import { Wei } from 'emerald-js';

storiesOf('Header', module)
  .add('default', () => {
    const s = {
      wallet: {
        screen: fromJS({})
      },
      accounts: fromJS({
        accounts: [
          {
            balance: Wei.Zero
          }
        ]
      }),
      network: fromJS({
        peerCount: 10,
        currentBlock: {
          height: 120000
        },
        sync: {
          highestBlock: 200000
        }
      }),
      launcher: fromJS({
        connecting: false,
        chain: {
          id: 111,
          name: 'mainnet'
        },
        geth: {
          url: 'http://127.0.0.1:52521',
          id: 111,
          type: 'local'
        }
      })
    };

    const store = createStore((state = s, action) => state);
    return (
        <Provider store={store}>
        <Header />
        </Provider>
    )
  })
  .add('connecting', () => {
    const s = {
      wallet: {
        screen: fromJS({})
      },
      accounts: fromJS({
        accounts: [
          {
            balance: Wei.Zero
          }
        ]
      }),
      network: fromJS({
        peerCount: 10,
        currentBlock: {
          height: 100000
        },
        sync: {
          highestBlock: 200000
        }
      }),
      launcher: fromJS({
        connecting: true,
        chain: {
          id: 111,
          name: 'mainnet'
        },
        geth: {
          url: 'http://127.0.0.1:52521',
          id: 111,
          type: 'local'
        }
      })
    };

    const store = createStore((state = s, action) => state);
    return (
        <Provider store={store}>
        <Header />
        </Provider>
    )
  })
  .add('gas tracker', () => {
    const s = {
      wallet: {
        screen: fromJS({})
      },
      accounts: fromJS({
        accounts: [
          {
            balance: Wei.Zero
          }
        ]
      }),
      network: fromJS({
        peerCount: 10,
        currentBlock: {
          height: 100000
        },
        sync: {
          highestBlock: 200000
        }
      }),
      launcher: fromJS({
        connecting: true,
        chain: {
          id: 111,
          name: 'mainnet'
        },
        geth: {
          url: 'https://web3.gastracker.io',
          id: 111,
          type: 'remote'
        }
      })
    };

    const store = createStore((state = s, action) => state);
    return (
        <Provider store={store}>
        <Header />
        </Provider>
    )
  });
