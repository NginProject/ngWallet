import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { gotoScreen, showDialog } from '../../../store/wallet/screen/screenActions';
import Menu from './menu';

import classes from './header.scss';

class Header extends React.Component {
  render() {
    const { generate, importJson, importLedger, importPrivateKey, importMnemonic, addToken, createMnemonic, showAddressBook } = this.props;
    const { t } = this.props;
    return (
      <div className={ classes.header }>
        <div>
          <span className={ classes.title }>{ t('list.title') }</span>
        </div>
        <Menu
          generate={ generate }
          importJson={ importJson }
          importLedger={ importLedger }
          importPrivateKey={ importPrivateKey }
          importMnemonic={ importMnemonic }
          createMnemonic={ createMnemonic }
          addressBook={ showAddressBook }
          addToken={ addToken }
          t={ t }
        />
      </div>);
  }
}

export default translate('accounts')(
  connect(
    (state, ownProps) => ({}),
    (dispatch, ownProps) => ({
      generate: () => {
        dispatch(gotoScreen('generate'));
      },
      createMnemonic: () => {
        dispatch(gotoScreen('new-mnemonic'));
      },
      importJson: () => {
        dispatch(gotoScreen('importjson'));
      },
      importPrivateKey: () => {
        dispatch(gotoScreen('import-private-key'));
      },
      importLedger: () => {
        dispatch(gotoScreen('add-from-ledger'));
      },
      importMnemonic: () => {
        dispatch(gotoScreen('import-mnemonic'));
      },
      showAddressBook: () => {
        dispatch(gotoScreen('address-book'));
      },
      addToken: () => {
        dispatch(showDialog('tokens'));
      },
    })
  )(Header)
);
