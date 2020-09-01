const LatticeSubprovider = require('./subprovider.js')

export default function(maker) {
  maker.service('accounts', true)
  .addAccountType('lattice', async settings => {
    const subproviderObj = new LatticeSubprovider(settings);
    subproviderObj.create((err, subprovider) => {
      const address = await new Promise((resolve, reject) => {
        subprovider.getAccounts((err, accounts) => {
          if (err)
            return reject(err)
          return resolve(accounts[0])
        })
      })
      return { address, subprovider }
    })
  })
}