// TODO 6 - Call mint entrypoint in the NFT contract
import { tezos } from "./tezos";
import {char2Bytes} from "@taquito/utils"

export const mintOperation = async (metadata) => {
  try {
    console.log("inside mint",char2Bytes("ipfs://" + metadata))
    const contractInstance = await tezos.wallet.at("KT1UmCb8a84ssmjaEXp7Zq4AiKrfTXTu2Z8b");
    const op = await contractInstance.methods.mint(char2Bytes("ipfs://" + metadata)).send();
    await op.confirmation(1);
  } catch (err) {
    throw err;
  }
};
