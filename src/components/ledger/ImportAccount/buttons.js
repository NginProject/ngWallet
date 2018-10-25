import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import ledger from 'store/ledger/';
import screen from 'store/wallet/screen';
import accounts from 'store/vault/accounts/';
import { Button, ButtonGroup } from 'emerald-js-ui';
import { AddCircle as AddIcon } from 'emerald-js-ui/lib/icons3';

const Render = ({ selected, onAddSelected, onCancel }) => {
  return (
    <ButtonGroup>
      <Button
        label="Add Selected"
        disabled={!selected}
        primary={true}
        onClick={onAddSelected}
        icon={<AddIcon />}
      />
      <Button
        label="Cancel"
        onClick={onCancel}
      />
    </ButtonGroup>
  );
};

Render.propTypes = {
  selected: PropTypes.bool,
  onAddSelected: PropTypes.func,
  onCancel: PropTypes.func,
};

export default connect(
  (state, ownProps) => ({
    selected: state.ledger.get('selectedAddr') !== null,
  }),
  (dispatch, ownProps) => ({
    onAddSelected: () => {
      let acc = null;
      dispatch(ledger.actions.importSelected())
        .then((address) => {
          acc = Immutable.fromJS({ id: address });
          return dispatch(accounts.actions.loadAccountsList());
        })
        .then(() => {
          return dispatch(screen.actions.gotoScreen('account', acc));
        });
    },
    onCancel: () => {
      if (ownProps.onBackScreen) {
        return dispatch(screen.actions.gotoScreen(ownProps.onBackScreen));
      }
      dispatch(screen.actions.gotoScreen('home'));
    },
  })
)(Render);
