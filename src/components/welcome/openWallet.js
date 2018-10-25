import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PlayCircle } from 'emerald-js-ui/lib/icons3';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import FlatButton from 'material-ui/FlatButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import launcher from 'store/launcher';
import { waitForServicesRestart } from 'store/store';

const Render = ({ save, muiTheme }) => {
  return (
    <Row style={{textAlign: 'center'}}>
      <Col xs={12} style={{marginTop: '3rem', marginBottom: '1.5rem'}}>
        <div style={{fontWeight: '300'}}>
          <p style={{fontSize: '1.5rem'}}>
            Welcome to Ngin Wallet<br/>
          </p>
          <p>
            Ngin is a transparent, powerful and hackable blockchain platform which will be based on a decentralized Search Engine.
          </p>
        </div>
      </Col>
      <Col xs={12}>
        <FlatButton label="Open Wallet"
          // icon={<PlayCircle style={{color: muiTheme.palette.alternateTextColor}}/>}
          style={{backgroundColor: muiTheme.palette.primary1Color, color: muiTheme.palette.alternateTextColor}}
          onClick={save}/>
      </Col>
    </Row>
  );
};


Render.propTypes = {
  save: PropTypes.func.isRequired,
};

const OpenWallet = connect(
  (state, ownProps) => ({
  }),
  (dispatch, ownProps) => ({
    save: () => {
      dispatch(launcher.actions.saveSettings());
      waitForServicesRestart();
    },
  })
)(Render);

export default muiThemeable()(OpenWallet);
