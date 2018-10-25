import React from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import Tokens from 'store/vault/tokens';
import { fromJS } from 'immutable';
import { Wei, convert } from 'emerald-js';
import { etherToWei } from 'lib/convert';
import muiThemeable from 'material-ui/styles/muiThemeable';
import CreateTransaction  from '../../components/tx/CreateTransaction';
import {Page} from 'emerald-js-ui';
import { Back } from 'emerald-js-ui/lib/icons3';
import { connect } from 'react-redux';
import accounts from 'store/vault/accounts';
import network from 'store/network';
import screen from 'store/wallet/screen';
import ledger from 'store/ledger/';
import { traceValidate } from '../../components/tx/SendTx/utils';
import SignTxForm from '../../components/tx/SendTx/SignTx';
import TransactionShow from '../../components/tx/TxDetails';

const { toHex } = convert;

const PAGES = {
  TX: 1,
  SIGN: 2,
  DETAILS: 3,
};

const DEFAULT_GAS_LIMIT = '21000';

class MultiCreateTransaction extends React.Component {
  static propTypes = {
    currency: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
    fiatBalance: PropTypes.string.isRequired,
    tokenSymbols: PropTypes.arrayOf(PropTypes.string).isRequired,
    addressBookAddresses: PropTypes.arrayOf(PropTypes.string).isRequired,
    ownAddresses: PropTypes.arrayOf(PropTypes.string).isRequired,
    accountAddress: PropTypes.string,
    txFee: PropTypes.string.isRequired,
    txFeeFiat: PropTypes.string.isRequired,
    data: PropTypes.object,
    typedData: PropTypes.object,
  };

  constructor() {
    super();
    this.onChangeFrom = this.onChangeFrom.bind(this);
    this.onChangeTo = this.onChangeTo.bind(this);
    this.onChangeToken = this.onChangeToken.bind(this);
    this.onChangeGasLimit = this.onChangeGasLimit.bind(this);
    this.onSubmitCreateTransaction = this.onSubmitCreateTransaction.bind(this);
    this.onSubmitSignTxForm = this.onSubmitSignTxForm.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.getPage = this.getPage.bind(this);
    this.state = {
      transaction: {},
      page: PAGES.TX,
    };
  }

  setTransaction(key, val) {
    this.setState({
      transaction: {
        ...this.state.transaction,
        [key]: val,
      },
    });
  }

  onChangeFrom(from) {
    this.setTransaction('from', from);
  }

  onChangeTo(to) {
    this.setTransaction('to', to);
  }

  onChangeToken(token) {
    this.setTransaction('token', token);
  }

  onChangePassword(password) {
    this.setTransaction('password', password);
  }

  onChangeGasLimit(value) {
    this.setTransaction('gasLimit', value || DEFAULT_GAS_LIMIT);
  }

  onChangeAmount(amount) {
    this.setTransaction('amount', amount);
  }

  componentDidMount() {
    this.setState({
      transaction: {
        ...this.state.transaction,
        from: this.props.selectedFromAccount,
        token: this.props.tokenSymbols[0],
        gasPrice: this.props.gasPrice,
        amount: this.props.amount,
        to: this.props.to,
        gasLimit: this.props.gasLimit,
      },
    });
  }

  onSubmitCreateTransaction() {
    this.setState({
      page: PAGES.PASSWORD,
    });
  }

  onSubmitSignTxForm() {
    this.props.signAndSend({
      transaction: this.state.transaction,
      allTokens: this.props.allTokens,
    });
  }

  getPage() {
    if (!this.state.transaction.from) { return null; }

    switch (this.state.page) {
      case PAGES.TX:
        return (
          <CreateTransaction
            to={this.state.transaction.to}
            from={this.state.transaction.from}
            token={this.state.transaction.token}
            amount={this.state.transaction.amount}
            gasLimit={this.state.transaction.gasLimit}
            txFee={this.props.getTxFeeForGasLimit(this.state.transaction.gasLimit)}
            txFeeFiat={this.props.getTxFeeFiatForGasLimit(this.state.transaction.gasLimit)}

            balance={this.props.getBalanceForAddress(this.state.transaction.from, this.state.transaction.token)}
            fiatBalance={this.props.getFiatForAddress(this.state.transaction.from, this.state.transaction.token)}

            currency={this.props.currency}
            tokenSymbols={this.props.tokenSymbols}
            addressBookAddresses={this.props.addressBookAddresses}
            ownAddresses={this.props.ownAddresses}

            onChangeFrom={this.onChangeFrom}
            onChangeToken={this.onChangeToken}
            onChangeGasLimit={this.onChangeGasLimit}
            onChangeAmount={this.onChangeAmount}
            onChangeTo={this.onChangeTo}
            onSubmit={this.onSubmitCreateTransaction}
            onCancel={this.props.onCancel}
            onEmptyAddressBookClick={this.props.onEmptyAddressBookClick}
          />
        );
      case PAGES.PASSWORD:
        return (
          <SignTxForm
            fiatRate={this.props.fiateRate}
            tx={this.state.transaction}
            txFee={this.props.getTxFeeForGasLimit(this.state.transaction.gasLimit)}
            onChangePassword={this.onChangePassword}
            useLedger={this.props.useLedger}
            onSubmit={this.onSubmitSignTxForm}
            onCancel={this.props.onCancel}
          />
        );
      case PAGES.DETAILS:
        return (
          <TransactionShow hash={this.state.transaction.hash} accountId={this.state.transaction.from}/>
        );
      default: return null;
    }
  }

  render() {
    return (
      <Page title="Create Transaction" leftIcon={<Back onClick={this.props.onCancel}/>}>
        {this.getPage()}
      </Page>
    );
  }
}

export default connect(
  (state, ownProps) => {
    const account = ownProps.account;
    const allTokens = state.tokens.get('tokens').concat([fromJS({address: '', symbol: 'NGIN', name: 'NGIN'})]).reverse();
    const gasPrice = state.network.get('gasPrice');

    const fiatRate = state.wallet.settings.get('localeRate');
    const currency = 'USD';

    const useLedger = account.get('hardware', false);
    const ledgerConnected = state.ledger.get('connected');

    const addressBookAddresses = state.addressBook.get('addressBook').toJS().map((i) => i.address);
    const ownAddresses = accounts.selectors.getAll(state).toJS().map((i) => i.id);

    const tokenSymbols = allTokens.toJS().map((i) => i.symbol);

    return {
      amount: ownProps.amount || '0',
      gasLimit:  DEFAULT_GAS_LIMIT,
      token: 'NGIN',
      selectedFromAccount: account.get('id'),
      getBalanceForAddress: (address, token) => {
        if (token === 'NGIN') {
          const selectedAccount = state.accounts.get('accounts').find((acnt) => acnt.get('id') === address);
          const newBalance = selectedAccount.get('balance');
          return newBalance.getEther().toString();
        }

        return state.tokens
          .get('balances')
          .get(address)
          .find((t) => t.get('symbol') === token)
          .get('balance')
          .getDecimalized();
      },
      getFiatForAddress: (address, token) => {
        if (token !== 'NGIN') { return '??'; }
        const selectedAccount = state.accounts.get('accounts').find((acnt) => acnt.get('id') === address);
        const newBalance = selectedAccount.get('balance');
        return newBalance.getFiat(fiatRate).toString();
      },
      getTxFeeForGasLimit: (gasLimit) => new Wei(gasPrice.mul(gasLimit).value()).getEther().toString(),
      getTxFeeFiatForGasLimit: (gasLimit) => new Wei(gasPrice.mul(gasLimit).value()).getFiat(fiatRate).toString(),
      currency,
      gasPrice,
      tokenSymbols,
      addressBookAddresses,
      ownAddresses,
      useLedger,
      ledgerConnected,
      allTokens,
    };
  },
  (dispatch, ownProps) => ({
    onCancel: () => dispatch(screen.actions.gotoScreen('home', ownProps.account)),
    onEmptyAddressBookClick: () => dispatch(screen.actions.gotoScreen('add-address')),
    signAndSend: ({transaction, allTokens}) => {
      const useLedger = ownProps.account.get('hardware', false);

      const tokenInfo = allTokens.find((t) => t.get('symbol') === transaction.token);

      const toAmount = etherToWei(transaction.amount);

      const gasLimit = new Wei(transaction.gasLimit).getValue();
      const gasPrice = transaction.gasPrice.getValue();

      if (transaction.token !== 'NGIN') {
        const decimals = convert.toNumber(tokenInfo.get('decimals'));
        const tokenUnits = convert.toBaseUnits(convert.toBigNumber(transaction.amount), decimals || 18);
        const txData = Tokens.actions.createTokenTxData(
          transaction.to,
          tokenUnits,
          'true');
        return dispatch(
          accounts.actions.sendTransaction(
            transaction.from,
            transaction.password,
            tokenInfo.get('address'),
            toHex(gasLimit),
            toHex(gasPrice),
            convert.toHex(0),
            txData
          )
        );
      }

      return traceValidate({
        from: transaction.from,
        to: transaction.to,
        gas: toHex(gasLimit),
        gasPrice: toHex(gasPrice),
        value: toHex(toAmount),
      }, dispatch, network.actions.estimateGas).then(() => {
        dispatch(ledger.actions.setWatch(false));

        return ledger.actions.closeConnection().then(() => {
          if (useLedger) {
            dispatch(screen.actions.showDialog('sign-transaction', transaction));
          }
          return dispatch(
            accounts.actions.sendTransaction(
              transaction.from,
              transaction.password,
              transaction.to,
              toHex(gasLimit),
              toHex(gasPrice),
              toHex(toAmount)
            )
          );
        });
      });
    },
  }))(MultiCreateTransaction);
