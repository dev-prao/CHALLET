// types.ts

export interface Transaction {
  userId: number;
  nickname: string;
  profileImage: string;
  sharedTransactionId: number;
  deposit: string;
  transactionAmount: number;
  transactionDateTime: string;
  content: string;
  image: string;
  goodCount: number;
  sosoCount: number;
  badCount: number;
  commentCount: number;
  userEmoji: string | null; // GOOD, SOSO, BAD
}
