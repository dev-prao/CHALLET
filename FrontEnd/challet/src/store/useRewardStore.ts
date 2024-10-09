import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

// 리워드 스토어 인터페이스
interface Reward {
  rewardId: number;
  type: boolean;
  category: string;
  datetime: string;
  title: string;
}

interface RewardDetail extends Reward {
  spendingLimit: number;
  startDate: string;
  endDate: string;
  spendingAmount: number;
}

interface RewardStore {
  rewards: Reward[];
  rewardDetail: RewardDetail | null;
  fetchRewards: () => Promise<void>;
  fetchRewardDetail: (rewardId: number) => Promise<void>;
  setRewards: (rewards: Reward[]) => void;
  setRewardDetail: (detail: RewardDetail | null) => void;
}

export const useRewardStore = create<RewardStore>((set) => ({
  rewards: [],
  rewardDetail: null,

  // 리워드 목록 가져오기
  fetchRewards: async () => {
    try {
      const response = await axiosInstance.get('/api/challet/users/rewards');
      set({ rewards: response.data.rewardList });
    } catch (error) {
      console.error('리워드 조회 실패:', error);
    }
  },

  // 리워드 상세 정보 가져오기
  fetchRewardDetail: async (rewardId: number) => {
    try {
      const response = await axiosInstance.get(
        `/api/challet/users/rewards/${rewardId}`
      );
      set({ rewardDetail: response.data });
    } catch (error) {
      console.error('리워드 상세 조회 실패:', error);
    }
  },

  setRewards: (rewards: Reward[]) => set({ rewards }),
  setRewardDetail: (detail: RewardDetail | null) =>
    set({ rewardDetail: detail }),
}));
