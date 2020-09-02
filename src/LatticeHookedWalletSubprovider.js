import HookedWallet from 'web3-provider-engine/subproviders/hooked-wallet';
import LatticeKeyring from 'eth-lattice-keyring'

const getAccountsAsync = async (keyring) => {
  await keyring.unlock();
  const accounts = await keyring.getAccounts();
  return accounts;
}

export default class LatticeHookedWalletSubprovider extends HookedWallet {
  constructor(opts = {}) {
    super(opts);
    this.keyring = opts.keyring;
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

}