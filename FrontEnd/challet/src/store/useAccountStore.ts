import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccountInfo {
  id: string | number;
  accountNumber: string;
  accountBalance: number;
}

interface AccountState {
  accountInfo: AccountInfo | null;
  setAccountInfo: (info: AccountInfo) => void;
}

const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      accountInfo: null,
      setAccountInfo: (info) => set({ accountInfo: info }),
    }),
    {
      name: 'account-storage',
    }
  )
);

export default useAccountStore;
