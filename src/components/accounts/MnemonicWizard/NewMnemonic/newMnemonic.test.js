import React from 'react';
import { shallow } from 'enzyme';
import { Button } from 'emerald-js-ui';
import { NewMnemonic } from './newMnemonic';

describe('When mnemonic is empty NewMnemonic', () => {
  it('renders Generate button', () => {
    const component = shallow(<NewMnemonic />);
    expect(component.find(Button).props().label).toEqual('Generate');
  });
});

describe('When mnemonic not empty NewMnemonic', () => {
  it('renders Continue button', () => {
    const component = shallow(<NewMnemonic mnemonic="some mnemonic"/>);
    expect(component.find(Button).props().label).toEqual('Continue');
  });
});
