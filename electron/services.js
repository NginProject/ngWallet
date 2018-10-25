const { JsonRpc, HttpTransport, Vault, VaultJsonRpcProvider, VaultInMemoryProvider } = require('emerald-js');
const log = require('./logger');
const { LocalGeth, NoneGeth, RemoteGeth } = require('./launcher');
const { LocalConnector } = require('./vault/launcher');
const UserNotify = require('./userNotify').UserNotify;
const newGethDownloader = require('./geth/downloader').newGethDownloader;
const { check, waitRpc } = require('./nodecheck');
const { getBinDir, getLogDir, isValidChain } = require('./utils');

require('es6-promise').polyfill();

const LOCAL_RPC_URL = 'http://localhost:52521';

const SERVICES = {
  CONNECTOR: 'connector',
  GETH: 'geth',
};

const STATUS = {
  NOT_STARTED: 0,
  STARTING: 1,
  STOPPING: 2,
  READY: 3,
  ERROR: 4,
  WRONG_SETTINGS: 5,
};

const LAUNCH_TYPE = {
  NONE: 0,
  LOCAL_RUN: 1,
  LOCAL_EXISTING: 2,
  REMOTE_URL: 3,
  AUTO: 4,
};

const DEFAULT_SETUP = {
  connector: {
    launchType: LAUNCH_TYPE.LOCAL_RUN,
    url: 'http://127.0.0.1:1920',
  },

  geth: {
    launchType: LAUNCH_TYPE.NONE,
    url: null,
    type: null,
  },
  chain: null,
};


class Services {
  constructor(webContents) {
    this.setup = Object.assign({}, DEFAULT_SETUP);
    this.connectorStatus = STATUS.NOT_STARTED;
    this.gethStatus = STATUS.NOT_STARTED;
    this.notify = new UserNotify(webContents);
    this.emerald = new Vault(
      new VaultJsonRpcProvider(
        new JsonRpc(
          new HttpTransport('http://127.0.0.1:1920'))));
    log.info(`Run services from ${getBinDir()}`);
  }

  /**
     * Configure services with new settings
     *
     * @param settings - plain JavaScript object with settings
     * @returns {Promise}
     */
  useSettings(settings) {
    return new Promise((resolve, reject) => {
      if (!isValidChain(settings.chain)) {
        this.gethStatus = STATUS.WRONG_SETTINGS;
        this.connectorStatus = STATUS.WRONG_SETTINGS;
        reject(`Wrong chain ${JSON.stringify(settings.chain)}`);
      }

      // Set desired chain
      this.setup.chain = settings.chain;

      // Set Geth
      this.setup.geth = settings.geth;

      if (this.setup.geth.type === 'remote') {
        this.setup.geth.launchType = LAUNCH_TYPE.REMOTE_URL;
      } else if (this.setup.geth.type === 'local') {
        this.setup.geth.launchType = LAUNCH_TYPE.AUTO;
      } else {
        this.setup.geth.launchType = LAUNCH_TYPE.NONE;
      }

      log.debug('New Services setup', this.setup);
      resolve(this.setup);
    });
  }

  start() {
    return Promise.all([
      this.startGeth(),
      this.startConnector(),
    ]);
  }

  shutdown() {
    const shuttingDown = [];

    if (this.geth) {
      shuttingDown.push(
        this.geth.shutdown()
          .then(() => { this.gethStatus = STATUS.NOT_STARTED; })
          .then(() => this.notifyEthRpcStatus()));
    }

    if (this.connector) {
      shuttingDown.push(this.connector.shutdown()
        .then(() => { this.connectorStatus = STATUS.NOT_STARTED; })
        .then(() => this.notifyConnectorStatus()));
    }
    return Promise.all(shuttingDown);
  }

  tryExistingGeth(url) {
    return new Promise((resolve, reject) => {
      check(url).then((status) => {
        resolve({
          name: status.chain,
          id: status.chainId,
          clientVersion: status.clientVersion,
        });
      }).catch(reject);
    });
  }

  startNoneRpc() {
    return new Promise((resolve, reject) => {
      log.info('use NONE ngind');
      this.notify.error('Ngin connection type is not configured');
      resolve(new NoneGeth());
    });
  }

  startRemoteRpc() {
    log.info('use REMOTE RPC');
    return this.tryExistingGeth(this.setup.geth.url).then((chain) => {
      this.setup.chain = chain;
      this.setup.geth.clientVersion = chain.clientVersion;
      this.gethStatus = STATUS.READY;

      this.notify.info(`Use Remote RPC API at ${this.setup.geth.url}`);
      this.notify.chain(this.setup.chain.name, this.setup.chain.id);
      this.notifyEthRpcStatus();
      return new RemoteGeth(null, null);
    });
  }

  startAutoRpc() {
    return new Promise((resolve, reject) => {
      this.tryExistingGeth(LOCAL_RPC_URL).then((chain) => {
        this.setup.chain = chain;
        log.info('Use Local Existing RPC API');

        this.gethStatus = STATUS.READY;
        this.setup.geth.url = LOCAL_RPC_URL;
        this.setup.geth.clientVersion = chain.clientVersion;
        this.setup.geth.type = 'local';

        this.notify.info('Use Local Existing RPC API');
        this.notify.chain(this.setup.chain.name, this.setup.chain.id);
        this.notifyEthRpcStatus();


        resolve(new LocalGeth(null, getLogDir(), this.setup.chain.name, 52521));
      }).catch((e) => {
        log.error(e);
        log.info("Can't find existing RPC. Try to launch");
        this.startLocalRpc()
          .then(resolve)
          .catch(reject);
      });
    });
  }

  startLocalRpc() {
    return new Promise((resolve, reject) => {
      const gethDownloader = newGethDownloader(this.notify, getBinDir());
      gethDownloader.downloadIfNotExists().then(() => {
        this.notify.info('Launching Ngind backend');
        this.gethStatus = STATUS.STARTING;
        this.geth = new LocalGeth(getBinDir(), getLogDir(), this.setup.chain.name, 52521);

        this.geth.launch().then((geth) => {
          geth.on('exit', (code) => {
            this.gethStatus = STATUS.NOT_STARTED;
            log.error(`ngind process exited with code: ${code}`);
          });
          if (geth.pid > 0) {
            waitRpc(this.geth.getUrl()).then((clientVersion) => {
              this.gethStatus = STATUS.READY;
              log.info(`RPC is ready: ${clientVersion}`);
              this.setup.geth.url = this.geth.getUrl();
              this.setup.geth.type = 'local';

              this.notify.info('Local ngind RPC API is ready');
              this.notify.chain(this.setup.chain.name, this.setup.chain.id);
              this.notifyEthRpcStatus();

              resolve(this.geth);
            }).catch(reject);
          } else {
            reject(new Error('ngind not launched'));
          }
        }).catch(reject);
      }).catch((err) => {
        log.error('Unable to download ngind', err);
        this.notify.info(`Unable to download ngind: ${err}`);
        reject(err);
      });
    });
  }

  startGeth() {
    this.gethStatus = STATUS.NOT_STARTED;
    this.notifyEthRpcStatus('not ready');

    if (this.setup.geth.launchType === LAUNCH_TYPE.NONE) {
      return this.startNoneRpc();
    } else if (this.setup.geth.launchType === LAUNCH_TYPE.REMOTE_URL) {
      return this.startRemoteRpc();
    } else if (this.setup.geth.launchType === LAUNCH_TYPE.AUTO
            || this.setup.geth.launchType === LAUNCH_TYPE.LOCAL_RUN) {
      return this.startAutoRpc();
    }
    return new Promise((resolve, reject) => {
      reject(new Error(`Invalid ngind launch type ${this.setup.geth.launchType}`));
    });
  }

  startConnector() {
    return new Promise((resolve, reject) => {
      this.connectorStatus = STATUS.NOT_STARTED;
      this.notifyConnectorStatus();

      this.connector = new LocalConnector(getBinDir(), this.setup.chain);
      this.connector.launch().then((emerald) => {
        this.connectorStatus = STATUS.STARTING;
        emerald.on('exit', (code) => {
          this.connectorStatus = STATUS.NOT_STARTED;
          log.error(`Ngin Connector process exited with code: ${code}`);
          this.connector.proc = null;
        });
        emerald.on('uncaughtException', (e) => {
          log.error((e && e.stack) ? e.stack : e);
        });
        const logTargetDir = getLogDir();
        log.debug('ngWallet log target dir:', logTargetDir);
        emerald.stderr.on('data', (data) => {
          log.debug(`[ngWallet-cli] ${data}`); // always log emerald data
          if (/Connector started on/.test(data)) {
            // call rpc to get current version of emerald vault
            this.emerald.currentVersion().then((version) => {
              this.setup.connector.version = version;
            });

            this.connectorStatus = STATUS.READY;
            this.notifyConnectorStatus();
            resolve(this.connector);
          }
        });
      }).catch(reject);
    });
  }

  notifyStatus() {
    return new Promise((resolve, reject) => {
      this.notifyConnectorStatus(Services.statusName(this.connectorStatus));
      this.notifyEthRpcStatus(Services.statusName(this.gethStatus));
      resolve('ok');
    });
  }

  static statusName(status) {
    switch (status) {
      case STATUS.READY: return 'ready';
      case STATUS.WRONG_SETTINGS: return 'wrong settings';
      case STATUS.NOT_STARTED: return 'not ready';
      default: return 'not ready';
    }
  }

  notifyConnectorStatus() {
    const connectorStatus = Services.statusName(this.connectorStatus);
    this.notify.status(SERVICES.CONNECTOR, {
      url: this.setup.connector.url,
      status: connectorStatus,
      version: this.setup.connector.version,
    });
  }

  notifyEthRpcStatus() {
    const gethStatus = Services.statusName(this.gethStatus);
    this.notify.status(SERVICES.GETH, {
      url: this.setup.geth.url,
      type: this.setup.geth.type,
      status: gethStatus,
      version: this.setup.geth.clientVersion,
    });
  }
}


module.exports = {
  Services,
};
