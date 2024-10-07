import create from 'zustand';

interface MyDataState {
  isMyDataConnected: boolean;
  setMyDataConnected: (connected: boolean) => void;
}

const useMyDataStore = create<MyDataState>((set) => ({
  isMyDataConnected: false,
  setMyDataConnected: (connected: boolean) =>
    set({ isMyDataConnected: connected }),
}));

export default useMyDataStore;
