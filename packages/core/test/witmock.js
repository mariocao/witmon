// Contracts
const WitmonMock = artifacts.require("WitmonMock")

contract("Witmon Mock", accounts => {
  describe("mint creature: ", () => {
    let witmock
    before(async () => {
      witmock = await WitmonMock.deployed()
    })

    it(`should do something`, async () => {
        const lol = await witmock.mintCreature(
          '0x184cc5908e1a3d29b4d31df67d99622c4baa7b71', // address _eggOwner,
          0,                                            // uint256 _eggIndex,
          0,                                            // uint256 _eggColorIndex,
          0,                                            // uint256 _eggScore,
          1,                                            // uint256 _eggRanking,
          // 1..totalEggs
          //'0xa7e125ea7347704245c0b73d08dd63878e2065be72f200f1274e1fb3f650f045067a2610b36a3118ef53b963bb8020552e6e5bf031d43b9f5c8ebdb7e0aaafeb1b',                                    // bytes calldata _signature
          //'0xc9872184df85bb8d4d1abeb009b6b8967029c4edc0ef75f7d74b1db4d921de6b5faa476f905dc50826010a71614a426a84368fcdc32e570e6fc25e7e73164b47'
          '0xc9872184df85bb8d4d1abeb009b6b8967029c4edc0ef75f7d74b1db4d921de6b5faa476f905dc50826010a71614a426a84368fcdc32e570e6fc25e7e73164b471b'
          //'0xc9872184df85bb8d4d1abeb009b6b8967029c4edc0ef75f7d74b1db4d921de6b5faa476f905dc50826010a71614a426a84368fcdc32e570e6fc25e7e73164b470'
        )
        // assert.equal(hash, test.hash)
    })
  })
})
