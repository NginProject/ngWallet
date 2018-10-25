import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Button, Warning, WarningText, WarningHeader, Page } from 'emerald-js-ui';
import { Back } from 'emerald-js-ui/lib/icons3';
import muiThemeable from 'material-ui/styles/muiThemeable';

import screen from 'store/wallet/screen';
import accountsModule from 'store/vault/accounts';
import { Row, styles as formStyles } from 'elements/Form/index';

import FileDropField from './fileDropField';

class ImportJson extends React.Component {
    static propTypes = {
      importFile: PropTypes.func,
      showAccount: PropTypes.func,
      accounts: PropTypes.object,
      t: PropTypes.func,
      onDashboard: PropTypes.func,
    }

    constructor(props) {
      super(props);
      this.state = {
        fileError: null,
        file: null,
      };
    }

    submitFile = () => {
      const { importFile, showAccount } = this.props;
      importFile(this.state.file).then((result) => {
        if (result.error) {
          this.setState({ fileError: result.error.toString() });
        } else {
          showAccount(Immutable.fromJS({id: result}));
        }
      });
    }

    onFileChange = (file) => {
      this.setState({
        file,
      });
    }

    render() {
      const { t, onDashboard } = this.props;
      const { file, fileError } = this.state;

      return (
        <Page title={ t('import.title') } leftIcon={<Back onClick={onDashboard} />}>
          {fileError && (
            <Row>
              <div style={ formStyles.left }/>
              <div style={ formStyles.right }>
                <Warning fullWidth={ true }>
                  <WarningHeader>File error</WarningHeader>
                  <WarningText>{ fileError }</WarningText>
                </Warning>
              </div>
            </Row>
          )}
          <Row>
            <div style={ formStyles.left }/>
            <div style={ formStyles.right }>
              <FileDropField
                name="wallet"
                onChange={ this.onFileChange }
              />
            </div>
          </Row>

          {file && (
            <Row>
              <div style={ formStyles.left }/>
              <div style={ formStyles.right }>
                <Button primary onClick={ this.submitFile } label={ t('common:submit') }/>
              </div>
            </Row>)
          }
        </Page>
      );
    }
}

export default connect(
  (state, ownProps) => ({
  }),
  (dispatch, ownProps) => ({
    importFile: (file) => {
      return new Promise((resolve, reject) => {
        dispatch(accountsModule.actions.importWallet(file, '', ''))
          .then((accountId) => resolve(accountId))
          .catch((response) => resolve(response));
      });
    },
    showAccount: (account) => {
      dispatch(screen.actions.gotoScreen('account', account));
    },
    onDashboard: () => {
      if (ownProps.onBackScreen) {
        dispatch(screen.actions.gotoScreen(ownProps.onBackScreen));
      } else {
        dispatch(screen.actions.gotoScreen('home'));
      }
    },
    cancel: () => {
      dispatch(screen.actions.gotoScreen('home'));
    },
  })
)(translate('accounts')(muiThemeable()(ImportJson)));

