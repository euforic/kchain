/*!
 * kchain
 * Copyright(c) 2012 Christian Sullivan<cs@euforic.co>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var spawn = require('child_process').spawn;

/**
 * OS X Keychain API
 *
 * @class KeychainAccess
 * @api public
 */

function Kchain() {
  this.execPath = '/usr/bin/security';
}

/**
 * Get a password from the keychain.
 *
 * @param {Object} opts Object containing `account` and `service`
 * @param {Function} fn Callback
 * @api public
 */

module.exports = new Kchain();

Kchain.prototype.get = function(opts, fn) {
  opts = opts || {};
  var err;

  if (!opts.account) {
    err = new Error('An account is required');
    fn(err, null);
    return;
  }

  if (!opts.service) {
    err = new Error('A service is required');
    fn(err, null);
    return;
  }

  var security = spawn(this.execPath, [ 'find-generic-password', '-a', opts.account, '-s', opts.service, '-w' ]);
  var password = '';

  security.stdout.on('data', function(d) {
    password += d.toString();
  });

  security.on('exit', function(code, signal) {
    if (code !== 0) {
      err = new Error('Could not find password');
      fn(err, null);
      return;
    }

    password = password.replace('\n', '');
    fn(null, password);
  });
};

/**
 * Set/update a password in the keychain.
 *
 * @param {Object} opts Object containing `account`, `service`, and `password`
 * @param {Function} fn Callback
 * @api public
 */

Kchain.prototype.set = function(opts, fn) {
  var callback = fn || function (){};
  opts = opts || {};
  var err;

  if (!opts.account) {
    err = new Error('An account is required');
    callback(err, null);
    return;
  }

  if (!opts.service) {
    err = new Error('A service is required');
    callback(err, null);
    return;
  }

  if (!opts.password) {
    err = new Error('A password is required');
    callback(err, null);
    return;
  }

  var security = spawn(this.execPath, [ 'add-generic-password', '-a', opts.account, '-s', opts.service, '-w', opts.password ]);
  var self = this;

  security.on('exit', function(code, signal) {
    if (code !== 0) {
      var msg = 'Security returned a non-successful error code: ' + code;

      if (code == 45) {
        self.rm(opts, function(err) {
          if (err) {
            console.log(err);
            callback(err);
            return;
          }

          self.set(opts, fn);
          return;
        });
      } else {
       err = new Error(msg);
        callback(err);
        return;
      }
    } else {
     callback(null);
    }
  });
};

/**
* Remove a password from the keychain.
*
* @param {Object} opts Object containing `account`, `service`, and `password`
* @param {Function} fn Callback
* @api public
*/

Kchain.prototype.rm = function(opts, fn) {
  var callback = fn || function () {};
  opts = opts || {};
  var err;

  if (!opts.account) {
    err = new Error('An account is required');
    callback(err, null);
    return;
  }

  if (!opts.service) {
    err = new Error('A service is required');
    callback(err, null);
    return;
  }

  var security = spawn(this.execPath, [ 'delete-generic-password', '-a', opts.account, '-s', opts.service ]);

  security.on('exit', function(code, signal) {
    if (code !== 0) {
      err = new Error('Could not find password');
      callback(err);
      return;
    }
    callback(null);
  });
};