import { create } from "zustand";
import { persist } from 'zustand/middleware';
import * as bip39 from 'bip39';
import { HDNodeWallet, Wallet, JsonRpcProvider, Contract } from 'ethers';
import { AES, SHA256, enc } from 'crypto-js'
import { NETWORKS } from "./contants";
import type { VWallet, VWalletStore, WalletAccount, WalletToken } from "~src/types/wallet";
import type { VNetwork } from "~src/types/network";

const initStore: VWallet = {
  isLocked: false,
  currentAccount: null,
  accounts: [],
  mnemonic: null,
  password: null,
  privateKey: null,
  
  currentNetwork: NETWORKS[0],
  networks: NETWORKS,

  tokens: [],
}

/**
 * 钱包全局状态
 */
const useWalletStore = create<VWalletStore>()(persist((set, get) => ({
    ...initStore,

    /** 创建新钱包 */
    createWallet: async (password: string) => {
      try {
        const store = get();

        // 1、随机 生成助记词
        const mnemonic = bip39.generateMnemonic();
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

        const encryptedPassword = SHA256(password).toString();
        const encryptedPrivateKey = AES.encrypt(privateKey, password).toString();

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
        const encryptedPassword = SHA256(password).toString();
        console.log('encryptedPassword', encryptedPassword)
        const encryptedMnemonic = AES.encrypt(mnemonic, encryptedPassword).toString();
        const encryptedPrivateKey = AES.encrypt(wallet.privateKey, encryptedPassword).toString();

        set({
          isLocked: false,
          accounts: [account],
          currentAccount: account,
          privateKey: encryptedPrivateKey,
          mnemonic: encryptedMnemonic,
          // @ts-ignore 临时调试用
          mnemonicOrigin: mnemonic,
          password: encryptedPassword,
        });

        return { account }
      } catch (error) {
        throw Error('创建钱包失败', error);
      }
    },

    /** 切换用户 */
    switchAccount: async (address: string) => {
      const store = get();

      const account = store.accounts.filter(a => a.address === address)[0] || null;

      if (!account) throw new Error('用户不存在');

      set(state => ({
        ...state,
        currentAccount: account
      }));
    },

    /** 验证密码 */
    validPassword: (password: string) => {
      const store = get();
      console.log('validPassword', {
        password,
        enPassword: SHA256(password).toString(),
        storePassword: store.password,
      })
      return SHA256(password).toString() === store.password;
    },

    /** 添加账户 */
    addAccount: async (name: string) => {
      const store = get();
      // 恢复助记词
      const decryptMnemonic = AES.decrypt(store.mnemonic, store.password).toString(enc.Utf8);

      // 助记词派生种子
      const seedBuffer = await bip39.mnemonicToSeed(decryptMnemonic);
      const seed = new Uint8Array(seedBuffer);

      // 种子派生钱包
      const hdNode = await HDNodeWallet.fromSeed(seed);
      const index = store.accounts.length;
      const wallet = hdNode.derivePath(`m/44'/60'/0'/0/${index}`);

      // 钱包生成账户（根据索引）
      const account: WalletAccount = {
        name,
        index,
        address: wallet.address,
      }

      set(state => ({
        ...state,
        currentAccount: account,
        accounts: [...state.accounts, account],
      }));

      return account; 
    },

    /** 验证网络 */
    testNetwork: async (network: VNetwork) => {
      // 测试网络连接
      const provider = new JsonRpcProvider(network.rpcUrl);
      const networkInfo = await provider.getNetwork();
      if (networkInfo.chainId !== BigInt(network.chainId)) {
        throw new Error('链 ID 不匹配');
      }
    },

    /** 切换网络 */
    switchNetwork: async (id: string) => {
      const store = get();
      // 获取用户选择的网络
      const network = store.networks.filter(net => net.id === id)?.[0];
      if (!network) {
        throw new Error('你选择的网络不存在！！')
      }

      await store.testNetwork(network);

      // 设置新网络
      set(state => ({
        ...state,
        currentNetwork: network
      }));
    },

    /** 添加网络 */
    addNetwork: async (network: VNetwork) => {
      const store = get();
      await store.testNetwork(network);

      set(state => ({
        ...state,
        currentNetwork: network,
        networks: [...state.networks, network]
      }));
    },

    /** 验证 ERC20 */
    validERC20: async (contractAddress: string) => {
      const store = get();

      const provider = new JsonRpcProvider(store.currentNetwork.rpcUrl);
      const ERC20_ABI = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function decimals() view returns (uint8)",
      ];
      const contract = new Contract(contractAddress, ERC20_ABI, provider);
      
      try {
        const name: string = await contract.name();
        const symbol: string = await contract.symbol();
        const decimals: number = await contract.decimals(); 
        return { name, symbol, decimals };
      } catch (error) {
        console.error('validERC20 error', error)
        // throw new Error('合约不是标准的 ERC-20 合约');
      }
    },

    /** 验证 ERC721 合约 */
    validERC721: async (contractAddress: string) => {
      const store = get();

      const provider = new JsonRpcProvider(store.currentNetwork.rpcUrl);
      const ERC721_ABI = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function supportsInterface(bytes4 interfaceID) external view returns (bool)"
      ];
      const contract = new Contract(contractAddress, ERC721_ABI, provider);

      try {
        const name: string = await contract.name();
        const symbol: string = await contract.symbol();
        const isERC721 = await contract.supportsInterface('0x80ac58cd'); // ERC721 接口 ID

        if (!isERC721) {
          throw new Error('合约不是标准的 ERC-721 合约');
        }

        return { name, symbol };
      } catch (error) {
        throw new Error('合约不是标准的 ERC-721 合约');
      }
    },

    /** 添加代币 */
    addToken: async (token: WalletToken) => {
      const store = get();
      // 查看代币是否已存在
      const exist = store.tokens.find(t => t.contractAddress === token.contractAddress && t.chainId === token.chainId);
      if (exist) {
        throw new Error('代币已存在');
      }

      set(state => ({
        ...state,
        tokens: [...state.tokens, token]
      }));
    },

    /** 代币余额 */
    tokenBalance: async (contractAddress: string, userAddress?: string) => {
      const store = get();
      userAddress = userAddress || store.currentAccount?.address;
      if (!userAddress) {
        throw new Error('请先选择账户');
      }

      const provider = new JsonRpcProvider(store.currentNetwork.rpcUrl);
      const ERC20_ABI = [
        "function balanceOf(address owner) view returns (uint256)"
      ];
      const contract = new Contract(contractAddress, ERC20_ABI, provider);

      try {
        const balance: bigint = await contract.balanceOf(store.currentAccount.address);
        return balance;
      } catch (error) {
        throw new Error('获取余额失败');
      }
    },

    /** 删除代币 */
    removeToken: async (contractAddress: string) => {
      set(state => ({
        ...state,
        tokens: state.tokens.filter(t => t.contractAddress !== contractAddress)
      }))
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