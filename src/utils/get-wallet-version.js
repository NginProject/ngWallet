import fetch from 'node-fetch';
import {version as currentVersion} from '../../package.json';

export default (current) => {
  return fetch('https://api.github.com/repos/NginProject/ngWallet/releases/latest')
    .then((res) => res.json())
    .then(({tag_name, html_url}) => ({
      isLatest: tag_name === `v${currentVersion}`, // eslint-disable-line camelcase
      tag: tag_name,
      downloadLink: html_url,
    }));
};
