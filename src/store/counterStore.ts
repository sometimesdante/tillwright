import { create } from "zustand";

interface CountState {
  count: number;
  increment: (by: number) => void;
}

const useCountStore = create<CountState>((set) => ({
  count: 3,
  increment: () => set((state: any) => ({ count: state.count + 1 })),
}));

export default useCountStore;
