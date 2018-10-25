import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { Back as BackIcon } from 'emerald-js-ui/lib/icons3';
import styles from './dashboardButton.scss';

const style = {
};

const DashboardButton = (props) => {
  const { onClick, label } = props;
  return (
    <FlatButton onClick={ onClick } >
      <div className={ styles.button }>
        <div className={ styles.iconContainer }>
          <BackIcon color={ style.color }/>
        </div>
        <div>{ label || 'Dashboard' }</div>
      </div>
    </FlatButton>
  );
};

export default DashboardButton;
