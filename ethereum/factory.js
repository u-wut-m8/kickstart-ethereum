import Factory from "./build/Factory.json";
import web3 from "./web3";

const instance = new web3.eth.Contract(
  JSON.parse(Factory.interface),
  "0xe6A319EC182D04D4B98f29635D885BEC19997126"
);

export default instance;
