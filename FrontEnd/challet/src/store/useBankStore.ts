import create from 'zustand';

type BankStoreState = {
  connectedAccounts: {
    accountNumber: string;
    accountBalance: number;
    bankKey: string;
  }[];
  setConnectedAccounts: (
    accounts: {
      accountNumber: string;
      accountBalance: number;
      bankKey: string;
    }[]
  ) => void;
};

export const useBankStore = create<BankStoreState>((set) => ({
  connectedAccounts: [],
  setConnectedAccounts: (accounts) => set({ connectedAccounts: accounts }),
}));
