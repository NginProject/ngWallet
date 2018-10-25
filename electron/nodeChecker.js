'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _emeraldJs = require('emerald-js');
var log = require('./logger');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NodeChecker = function () {
  function NodeChecker(ethRpc) {
    _classCallCheck(this, NodeChecker);

    this.ethRpc = ethRpc;
  }

  _createClass(NodeChecker, [{
    key: 'check',
    value: function check() {
      var _this = this;

      return this.exists().then(function (clientVersion) {
        return _this.getChain().then(function (chain) {
          return _extends({}, chain, {
            clientVersion: clientVersion
          });
        });
      });
    }
  }, {
    key: 'exists',
    value: function exists() {
      return this.ethRpc.web3.clientVersion();
    }
  }, {
    key: 'getChain',
    value: function getChain() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.ethRpc.eth.getBlockByNumber('0x0', false).then(function (result) {
          if (true) {
            // (result.hash === NodeChecker.NGIN_MAINNET_GENESIS) {
            // TODO: GENESIS
            resolve({ chain: 'mainnet', chainId: 111 });
          // } else if (result.hash === NodeChecker.NGIN_MORDEN_GENESIS) {
          //   resolve({ chain: 'morden', chainId: 101 });
          // } else {
          //   resolve({ chain: 'unknown', chainId: 0 });
          }
        }).catch(function (error) {
          log.info(error);
          reject(error);
        });
      });
    }
  }]);

  return NodeChecker;
}();

// NodeChecker.NGIN_MAINNET_GENESIS =
// NodeChecker.NGIN_MORDEN_GENESIS =
module.exports = { NodeChecker };