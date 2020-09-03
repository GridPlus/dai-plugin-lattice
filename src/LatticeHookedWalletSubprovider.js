import HookedWallet from 'web3-provider-engine/subproviders/hooked-wallet';
import LatticeKeyring from 'eth-lattice-keyring'

const getAccountsAsync = async (keyring) => {
  try {
    await keyring.unlock();
    const accounts = await keyring.getAccounts();
    return accounts;
  } catch (err) {
    throw new Error(err);
  }
}

const signTransactionAsync = async (txData, keyring) => {
  try {
    await keyring.unlock();
    const signedTx = await keyring.signTransaction(txData.from, txData);
    return signedTx.tx;
  } catch (err) {
    throw new Error(err);
  }
}

export default class LatticeHookedWalletSubprovider extends HookedWallet {
  constructor(opts = {}) {
    super(opts);
    this.keyring = opts.keyring;
    this.networkId = opts.networkId;
  }

  getAccounts(callback) {
    if (!callback) {
      return getAccountsAsync(this.keyring);
    } else {
      getAccountsAsync(this.keyring)
      .then((accounts) => {
        callback(null, accounts);
      })
      .catch((err) => {
        callback(err, null);
      });
    }
  }

  signTransaction(txData, callback) {
    txData.chainId = this.networkId;
    if (!callback) {
      return signTransactionAsync(txData, this.keyring);
    } else {
      signTransactionAsync(txData, this.keyring)
      .then((tx) => {
        return callback(null, tx);
      })
      .catch((err) => {
        return callback(err, null);
      })
    }
  }

}