const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const compiled_factory = require("../ethereum/build/Factory.json");
const compiled_campaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaign_address;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compiled_factory.interface))
                              .deploy({data: compiled_factory.bytecode})
                              .send({from: accounts[0], gas: "1000000"});
  factory.setProvider(provider);

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000"
  });

  [campaign_address] = await factory.methods.getDeployedCampaigns().call();           //Same as campaign_address = await factory.methods.getDeployedCampaigns().call()[0];
  campaign = await new web3.eth.Contract(JSON.parse(compiled_campaign.interface), campaign_address);
});

describe("Campaigns", () => {
  it("should deploy a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("should mark campaign deployer as the manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("should allow people to contribute money and marks them as contributors", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200"
    });
    const isContributor = await campaign.methods.contributors(accounts[1]).call();
    assert(isContributor);
  });

  it("should require a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "5",
        from: accounts[2]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("should allow a manager to make a payment request", async () => {
    await campaign.methods.createRequest("buy batteries", "100", accounts[2]).send({from: accounts[0], gas: "1000000"});
    const request = await campaign.methods.requests(0).call();
    assert.equal(request.description, "buy batteries");
  });

  it('processes requests', async () => {
   await campaign.methods.contribute().send({
     from: accounts[0],
     value: web3.utils.toWei('10', 'ether')
   });

   await campaign.methods
     .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
     .send({from: accounts[0], gas: '1000000'});

   await campaign.methods.approveRequest(0).send({
     from: accounts[0],
     gas: '1000000'
   });

   await campaign.methods.finalizeRequest(0).send({
     from: accounts[0],
     gas: '1000000'
   });

   let balance = await web3.eth.getBalance(accounts[1]);
   balance = web3.utils.fromWei(balance, 'ether');
   balance = parseFloat(balance);

   assert(balance > 104);
 });
});
