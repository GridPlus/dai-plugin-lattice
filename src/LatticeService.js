import { LocalService } from '@makerdao/services-core';
import LatticeHookedWalletSubprovider from './LatticeHookedWalletSubprovider';

export default class LatticeService extends LocalService {
  constructor(name = 'lattice') {
    super(name, ['accounts', 'web3']);
  }

  // eslint-disable-next-line no-unused-vars
  initialize(settings) {
    const networkID = this.get('web3').networkId();
    const network = chainIds[networkID] ? chainIds[networkID] : 'mainnet';
    const name = 'Maker';
    this.get('accounts').addAccountType('lattice', async settings => {
      const subprovider = new LatticeHookedWalletSubprovider({network, name, ...settings});
      const address = await subprovider.getAccounts()[0];
      return { subprovider, address };
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