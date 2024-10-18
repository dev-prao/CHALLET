import create from 'zustand';
import { persist } from 'zustand/middleware';

type AgreementType = {
  serviceAgreement: boolean;
  financialTransaction: boolean;
  personalInfoUsage: boolean;
  withdrawalConsent: boolean;
  thirdPartyInfo: boolean;
};

type MyDataState = {
  agreements: AgreementType;
  selectedBanks: Record<string, boolean>;
  setAgreements: (agreements: AgreementType) => void;
  setSelectedBanks: (selectedBanks: Record<string, boolean>) => void;
};

const useMyDataStore = create<MyDataState>()(
  persist(
    (set) => ({
      agreements: {
        serviceAgreement: false,
        financialTransaction: false,
        personalInfoUsage: false,
        withdrawalConsent: false,
        thirdPartyInfo: false,
      },
      selectedBanks: {
        sh: false,
        kb: false,
        nh: false,
      },
      setAgreements: (agreements) => {
        // console.log('Agreements updated:', agreements); // 상태 변경 시 콘솔 출력
        set({ agreements });
      },
      setSelectedBanks: (selectedBanks) => {
        // console.log('Selected banks updated:', selectedBanks); // 상태 변경 시 콘솔 출력
        set({ selectedBanks });
      },
    }),
    {
      name: 'my-data-storage', // localStorage에 저장될 키 이름
      getStorage: () => localStorage, // (선택) 로컬 스토리지 사용 설정
    }
  )
);

export default useMyDataStore;
