import { create } from "zustand";
import { persist } from 'zustand/middleware';
import * as bip39 from 'bip39';
import { HDNodeWallet } from 'ethers';
import { AES, SHA256 } from 'crypto-js'
import type { VWallet, VWalletStore, WalletAccount } from "~src/types/wallet";

const initStore: VWallet = {
  isLocked: false,
  currentAccount: null,
  accounts: [],
  mnemonic: null,
  password: null,
}

/**
 * 钱包全局状态
 */
const useWalletStore = create<VWalletStore>()(persist((set) => ({
    ...initStore,

    /** 创建新钱包 */
    createWallet: async (password: string) => {
      // 1、生成助记词
      const mnemonic = bip39.generateMnemonic();
      console.log("助记词：", mnemonic);

      // 2、派生成出种子
      const seedBuffer = await bip39.mnemonicToSeed(mnemonic);
      const seed = new Uint8Array(seedBuffer);
      console.log("种子: ", seed);

      // 3、根据种子生成 HD Node
      const hdNode = await HDNodeWallet.fromSeed(seed);

      const wallet = hdNode.derivePath("m/44'/60'/0'/0/0");

      console.dir(wallet)

      const account: WalletAccount = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        name: "Account 1",
        index: 0
      };

      // 加密敏感数据
      const encryptedMnemonic = AES.encrypt(mnemonic, password).toString();
      const encryptedPrivateKey = AES.encrypt(wallet.privateKey, password).toString();

      set({
        isLocked: false,
        accounts: [{ ...account, privateKey: encryptedPrivateKey }],
        currentAccount: account,
        mnemonic: encryptedMnemonic,
        password: SHA256(password).toString()
      });

      return { mnemonic, account }
    },

  }),
  {
    name: 'victree-wallet',
    storage: {
      getItem: async (name: string) => {
        const result = await chrome.storage.local.get(name);
        console.log('chrome.storage.local', chrome.storage.local)
        return result[name] || null;
      },
      setItem: async (name: string, value: any) => {
        return await chrome.storage.local.set({ [name]: value })
      },
      removeItem: async (name: string) => {
        return await chrome.storage.local.remove(name);
      }
    },
  }
));

export default useWalletStore;