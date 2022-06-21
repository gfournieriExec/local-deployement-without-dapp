import KeysManager from "./src/keysManager.js";
import addressGenerator from "./src/addressGenerator.js";
import fs from "fs";

const keysManager = new KeysManager();

const generateKeys = async () => {
  const mining = await addressGenerator();
  const voting = await addressGenerator();
  const payout = await addressGenerator();
  return {
    mining,
    voting,
    payout,
  };
};

const main = async (initialKey, index) => {
  await keysManager.init();
  console.log("Initial Key", initialKey);
  let isValid;
  try {
    isValid = await keysManager.isInitialKeyValid(initialKey);
  } catch (error) {
    console.log("Founded an error", error);
  }
  if (isValid) {
    const { mining, voting, payout } = await generateKeys();

    console.log(" mining address :  ", mining.jsonStore.address);
    console.log(" voting address :  ", voting.jsonStore.address);
    console.log(" payout address :  ", payout.jsonStore.address);
    try {
      const tx = await keysManager.createKeys({
        mining: mining.jsonStore.address,
        voting: voting.jsonStore.address,
        payout: payout.jsonStore.address,
        sender: initialKey,
      });

      const receipt = await tx.wait();

      console.log("Congratulations!", "Your keys are generated!", "success");

      const dataMining = JSON.stringify(mining.jsonStore, null, 4);
      const dataVoting = JSON.stringify(voting.jsonStore, null, 4);
      const dataPayout = JSON.stringify(payout.jsonStore, null, 4);

      const path = "Path/to/#1/validator-keys/validator-" + index + "/";
      fs.writeFile(path + "mining.json", dataMining, (err) => {
        if (err) {
          throw err;
        }
        console.log("JSON data is saved.");
      });
      fs.writeFile(path + "mining.key", mining.password, (err) => {
        if (err) {
          throw err;
        }
        console.log("Key data is saved.");
      });
      fs.writeFile(path + "voting.json", dataVoting, (err) => {
        if (err) {
          throw err;
        }
        console.log("JSON data is saved.");
      });
      fs.writeFile(path + "voting.key", voting.password, (err) => {
        if (err) {
          throw err;
        }
        console.log("Key data is saved.");
      });
      fs.writeFile(path + "payout.json", dataPayout, (err) => {
        if (err) {
          throw err;
        }
        console.log("JSON data is saved.");
      });
      fs.writeFile(path + "payout.key", payout.password, (err) => {
        if (err) {
          throw err;
        }
        console.log("Key data is saved.");
      });
    } catch (error) {
      console.log("Founded an error calling the createKeys fct ", error);
    }
  }
};

// main("initial-key-address-1", 1);
// main("initial-key-address-2", 2);
// main("initial-key-address-3", 3);
// main("initial-key-address-4", 4);
