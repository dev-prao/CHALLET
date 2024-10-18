import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SignUpState {
  name: string;
  phoneNumber: string;
  age: number;
  gender: number | null;
  password: string;
  nickname: string;
  setSignUpData: (data: Partial<SignUpState>) => void;
}

const useSignUpStore = create<SignUpState>()(
  persist(
    (set) => ({
      name: '',
      phoneNumber: '',
      age: 0,
      gender: null,
      password: '',
      nickname: '',
      setSignUpData: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: 'signup-storage',
    }
  )
);

export default useSignUpStore;
