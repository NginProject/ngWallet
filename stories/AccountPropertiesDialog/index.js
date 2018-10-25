import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import AccountPropertiesDialog from '../../src/components/accounts/GenerateAccount/AccountPropertiesDialog';

storiesOf('AccountPropertiesDialog', module)
  .add('default', () => <AccountPropertiesDialog onSkip={action('onSkip')}/>);
