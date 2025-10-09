import { create } from "zustand";
import { persist } from 'zustand/middleware';
import * as bip39 from 'bip39';
import { HDNodeWallet, Wallet } from 'ethers';
import { AES, SHA256 } from 'crypto-js'
import type { VWallet, VWalletStore, WalletAccount } from "~src/types/wallet";

const initStore: VWallet = {
  isLocked: false,
  currentAccount: null,
  accounts: [],
  mnemonic: null,
  password: null,
  privateKey: null,
}

/**
 * 钱包全局状态
 */
const useWalletStore = create<VWalletStore>()(persist((set, get) => ({
    ...initStore,

    /** 创建新钱包 */
    createWallet: async (password: string) => {
      try {
        // 1、随机 生成助记词
        const mnemonic = bip39.generateMnemonic();
        console.log("助记词：", mnemonic);

        const store = get();
        const { account } = await store.importWalletByMnemonic(mnemonic, password);
  
        return { mnemonic, account }
      } catch (error) {
        throw Error('创建钱包失败', error);
      }
    },

    /** 通过私钥导入钱包 */
    importWalletByPrivateKey: async (privateKey: string, password: string) => {
      try {
        // 通过私钥 创建钱包
        const wallet = new Wallet(privateKey);

        const account: WalletAccount = {
          address: wallet.address,
          name: "Account 1",
          index: 0
        };

        const encryptedPrivateKey = AES.encrypt(privateKey, password).toString();
        const encryptedPassword = SHA256(password).toString();

        set({
          isLocked: false,
          currentAccount: account,
          accounts: [account],
          privateKey: encryptedPrivateKey,
          password: encryptedPassword,
          mnemonic: '', // 导入私钥的，没有助记词
        });

        return { account }
      } catch (error) {
        console.error(error)
        throw Error('私钥导入钱包失败', error);
      }
    },

    /** 通过助记词导入钱包 */
    importWalletByMnemonic: async (mnemonic: string, password: string) => {
      // 通过助记词， 创建钱包
      try {
        // 1、派生成出种子
        const seedBuffer = await bip39.mnemonicToSeed(mnemonic);
        const seed = new Uint8Array(seedBuffer);
        console.log("种子: ", seed);

        // 2、根据种子生成 HD Node
        const hdNode = await HDNodeWallet.fromSeed(seed);
        const wallet = hdNode.derivePath("m/44'/60'/0'/0/0");

        const account: WalletAccount = {
          address: wallet.address,
          name: "Account 1",
          index: 0
        };

        // 加密敏感数据
        const encryptedMnemonic = AES.encrypt(mnemonic, password).toString();
        const encryptedPrivateKey = AES.encrypt(wallet.privateKey, password).toString();

        set({
          isLocked: false,
          accounts: [account],
          currentAccount: account,
          privateKey: encryptedPrivateKey,
          mnemonic: encryptedMnemonic,
          // @ts-ignore 临时调试用
          mnemonicOrigin: mnemonic,
          password: SHA256(password).toString()
        });

        return { account }
      } catch (error) {
        throw Error('创建钱包失败', error);
      }
    }
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