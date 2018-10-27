const spawn = require('child_process').spawn;
const fs = require('fs');
const os = require('os');
const path = require('path');

const log = require('./logger');
require('es6-promise').polyfill();

const suffix = os.platform() === 'win32' ? '.exe' : '';


class LocalGeth {
  constructor(bin, logDir, network, rpcPort) {
    this.bin = bin;
    this.logDir = logDir;
    this.network = network || 'mainnet';
    this.rpcPort = rpcPort || 52521;
  }

  launch() {
    return new Promise((resolve, reject) => {
      log.info(`Starting Ngind... [bin: ${this.bin} network: ${this.network}, port: ${this.rpcPort}]`);
      const bin = path.join(this.bin, `ngind${suffix}`);
      fs.access(bin, fs.constants.X_OK, (err) => {
        if (err) {
          log.error(`File ${bin} doesn't exist or app doesn't have execution flag`);
          reject(err);
        } else {
          const logTarget = path.join(this.logDir, 'Ngin'); // this shall be a dir
          const options = [
            '--chain', this.network,
            '--rpc',
            '--rpc-port', this.rpcPort,
            '--rpc-cors-domain', 'http://localhost:8000',
            '--cache=1024',
            '--atxi',
            '--fast', // (auto-disables when at or upon reaching current bc height)
            '--log-dir', logTarget,
          ];

          const env = Object.assign({}, process.env, {PATH: `${process.env.PATH}:.`});

          log.debug(`Ngind options: [${options}]`);
          this.proc = spawn(bin, options, { env });
          resolve(this.proc);
        }
      });
    });
  }

  shutdown() {
    log.info('Shutting down Local ngind');
    return new Promise((resolve, reject) => {
      if (!this.proc) {
        resolve('not_started');
        return;
      }
      this.proc.on('exit', () => {
        resolve('killed');
        this.proc = null;
      });
      this.proc.on('error', (err) => {
        log.error('Failed to shutdown Local ngind', err);
        reject(err);
      });
      this.proc.kill();
    });
  }

  getHost() {
    return '127.0.0.1';
  }

  getPort() {
    return this.rpcPort;
  }

  getUrl() {
    return `http://127.0.0.1:${this.rpcPort}`;
  }
}

class RemoteGeth {
  constructor(host, port) {
    this.host = host;
    this.port = port;
  }

  getHost() {
    return this.host;
  }

  getPort() {
    return this.port;
  }
}

class NoneGeth {

}

module.exports = {
  NoneGeth,
  RemoteGeth,
  LocalGeth,
};
