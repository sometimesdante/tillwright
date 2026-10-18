import { create } from "zustand";

type State = {
  searchText: string;
};

type Action = {
  updateSearchText: (searchText: State["searchText"]) => void;
};

const useSearchFunction = create<State & Action>((set) => ({
  searchText: "",
  updateSearchText: (searchText) => set(() => ({ searchText: searchText })),
}));

export default useSearchFunction;
