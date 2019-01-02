import Factory from "./build/Factory.json";
import web3 from "./web3";

const instance = new web3.eth.Contract(
  JSON.parse(Factory.interface),
  "0xF8fEBefBDb9190842E521c9742A9cB49b0c71eEB"
);

export default instance;
