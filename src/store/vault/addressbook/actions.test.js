import { fromJS } from 'immutable';
import { loadAddressBook } from './actions';

describe('Addressbook actions', () => {
  it('loadAddressBook call emerald listAddresses', () => {
    const dispatch = jest.fn();
    const api = {
      emerald: {
        listAddresses: jest.fn(() => Promise.resolve([])),
      },
    };
    const state = {
      launcher: fromJS({
        chain: {
          name: 'mainnet',
        },
      }),
    };
    loadAddressBook()(dispatch, () => state, api);
    expect(api.emerald.listAddresses).toHaveBeenCalled();
  });
});
