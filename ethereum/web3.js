import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined")
  //When running in browser and MetaMask is running.
  web3 = new Web3(window.web3.currentProvider);
else {
  //When running on server OR, MetaMask is not run by the user.
  const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/dcba2c5ecde54489b258f74a10e4a74e");
  web3 = new Web3(provider);
}

export default web3;
