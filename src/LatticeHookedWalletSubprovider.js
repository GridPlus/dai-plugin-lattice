import HookedWallet from 'web3-provider-engine/subproviders/hooked-wallet';
import LatticeKeyring from 'eth-lattice-keyring'

/**
 *
 * @param {string} address
 */
const getPath = async address => {
  for (const key in pathMap) {
    if (key.toLowerCase() === address.toLowerCase()) return pathMap[key];
  }
};

const getKeyring = async () => {
  const keyring = new LatticeKeyring();
  await keyring.unlock();
  return keyring;
};

export default class LatticeHookedWalletSubprovider extends HookedWallet {
  constructor(opts = {}) {
    super(opts);
    this.opts = opts;
    this.keyring = null; 
  }

  async getKeyring() {
    if (this.keyring !== null)
      return this.keyring
    const keyring = new LatticeKeyring(this.opts);
    await keyring.unlock();
    this.keyring = keyring;
    return this.keyring;
  };

  async getAccountsAsync() {
    try {
      const keyring = await this.getKeyring();
      const accounts = await keyring.getAccounts();
      return accounts;
    } catch (err) {
      throw new Error(err);
    }
  }

  async signTransactionAsync(txData) {
    try {
      const keyring = await this.getKeyring();
      const signedTx = await keyring.signTransaction(txData.from, txData);
      return signedTx.tx; 
    } catch (err) {
      throw new Error(err);
    }
  }

  getAccounts(callback) {
    if (!callback) {
      return this.getAccountsAsync();
    } else {
      this.getAccountsAsync()
      .then((accounts) => {
        callback(null, accounts);
      })
      .catch((err) => {
        callback(err, null);
      });
    }
  }

  signTransaction(txData, callback) {
    if (!callback) {
      return this.signTransctionAsync(txData)
    } else {
      this.signTransactionAsync(txData)
      .then((tx) => {
        callback(null, tx);
      })
      .catch((err) => {
        callback(err, null);
      })
    }
  }
}