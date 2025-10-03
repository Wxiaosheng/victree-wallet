import { create } from "zustand";
import { persist } from 'zustand/middleware';
import type { VWallet } from "~src/types/wallet";

const initStore = {
  currentAccount: 'X0d35fdfg35je3fs',
  accounts: []
}

/**
 * 钱包全局状态
 */
const useWalletStore = create<VWallet>()(persist((set) => ({
    ...initStore,

    updateAccount: async () => {
      set(state => ({
        currentAccount: state.currentAccount + '1'
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