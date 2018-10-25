import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import { Account } from 'emerald-js-ui';
import { TransactionShow } from './show';
import TxInputData from './TxInputData';

const mockMuiTheme = {
  palette: {},
};


describe('TransactionShow', () => {
  it('should show tx input data', () => {
    const tx = fromJS({
      hash: '0x01',
      data: '0xDADA',
    });
    const component = shallow(<TransactionShow transaction={tx} muiTheme={mockMuiTheme}/>);
    const inputComps = component.find(TxInputData);
    expect(inputComps).toHaveLength(1);
    expect(inputComps.first().props().data).toEqual(tx.get('data'));
  });

  it('should not show To Account if to tx does not have to attribute', () => {
    const tx = fromJS({
      hash: '0x01',
      data: '0xDADA',
    });
    const component = shallow(<TransactionShow transaction={tx} muiTheme={mockMuiTheme}/>);
    expect(component.find(Account)).toHaveLength(1);
  });
});
