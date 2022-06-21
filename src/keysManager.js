import addressGenerator from "./addressGenerator.js";
import { ethers } from "ethers";
import keyManage from "../abi/KeysManager.abi.js";
const accountInstanceWithRPC = async (RPCurl) => {
  const provider = new ethers.providers.JsonRpcProvider(RPCurl);
  //to hide
  //1
  //2
  //3
  //4
  let wallet = new ethers.Wallet("", provider);

  return wallet;
};

export default class KeysManager {
  async init() {
    const KEYS_MANAGER_ADDRESS = "0xKEYS_MANAGER_ADDRESS";
    console.log("Keys Manager ", KEYS_MANAGER_ADDRESS);

    const KeysManagerAbi = keyManage;
    const account = await accountInstanceWithRPC("http://127.0.0.1:8565/");
    this.instance = new ethers.Contract(
      KEYS_MANAGER_ADDRESS,
      KeysManagerAbi,
      account
    );
    this.gasPrice = ethers.utils.parseUnits("0", "gwei");
    this.gasLimit = ethers.utils.parseUnits("6700000", "wei");
  }

  async isInitialKeyValid(initialKey) {
    return new Promise((resolve, reject) => {
      this.instance;
      let getInitialKeyStatus;
      if (this.instance.getInitialKeyStatus) {
        getInitialKeyStatus = this.instance.getInitialKeyStatus;
      } else {
        getInitialKeyStatus = this.instance.initialKeys;
      }
      getInitialKeyStatus(initialKey)
        .then(function (result) {
          resolve(result);
        })
        .catch(function (e) {
          reject(false);
        });
    });
  }

  async generateKeys() {
    return await addressGenerator();
  }

  createKeys({ mining, voting, payout, sender }) {
    let tx = {
      from: sender,
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
    };
    return this.instance.createKeys(mining, voting, payout, tx);
  }
}
