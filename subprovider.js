const LatticeKeyring = require('eth-lattice-keyring');

class LatticeSubprovider {
  constructor (options={}) {
    super()
    this.options = options;
    this.keyring = new LatticeKeyring(options);
  }

  getAccounts(cb) {
    this.kerying.getAccounts()
    .then((accounts) => {
      return cb(null, accounts)
    })
    .catch((err) => {
      return cb(err, null);
    })
  }

  create(cb) {
    this.keyring.unlock()
    .then(() => {
      this.keyring.addAccounts()
    })
    .then(() => {
      if (options.promisify)
        return cb(null, new HookedWalletSubprovider({
          getAccounts: this.keyring.getAccounts,
          signTransaction: (txData) => {
            return this.keyring.signTransaction(txData.from, txData)
          },
        }))
      else
        return cb(null, new HookedWalletSubprovider({
          getAccounts: callback => {
            this.keyring.getAccounts()
            .then((accounts) => {
              return callback(null, accounts)
            })
            .catch((err) => {
              return callback(err, null)
            })
          },

          signTransaction: (txData, callback) => {
            this.keyring.signTransaction(txData.from, txData)
            .then((signedTx) => {
              return callback(null, signedTx)
            })
            .catch((err) => {
              return callback(err, null)
            })
          }
        }))
    })
    .catch((err) => { 
      return cb(err, null); 
    }
  })
  }
}

module.exports = LatticeSubprovider;