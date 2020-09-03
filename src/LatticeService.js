import { LocalService } from '@makerdao/services-core';
import LatticeHookedWalletSubprovider from './LatticeHookedWalletSubprovider';
import LatticeKeyring from 'eth-lattice-keyring'

export default class LatticeService extends LocalService {
  constructor(name = 'lattice') {
    super(name, ['accounts', 'web3']);
  }

  // eslint-disable-next-line no-unused-vars
  initialize(settings) {
    const networkId = this.get('web3').networkId();
    const network = chainIds[networkId] ? chainIds[networkId] : 'mainnet';
    const name = 'Maker';
    this.get('accounts').addAccountType('lattice', async settings => {
      const opts = { network, networkId, name, ...settings };
      // Setup Lattice keyring
      // NOTE: Lattice1 v1 only provides the first ETH address
      const keyring = new LatticeKeyring(opts);
      await keyring.addAccounts(1)
      // Setup the subprovider and get the first address
      const subprovider = new LatticeHookedWalletSubprovider({keyring, ...opts});
      const addresses = await subprovider.getAccounts();
      return { subprovider, address: addresses[0] };
    });
  }
}

const chainIds = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  5: 'goerli',
  42: 'kovan',
}