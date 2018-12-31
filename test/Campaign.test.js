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
});
