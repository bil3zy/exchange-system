import { create } from 'zustand';

interface State
{
    updatedState: boolean;
    setUpdatedState: () => void;
    collapsedState: boolean;
    setCollapsedState: () => void;
}

const useStore = create<State>()((set) => ({
    // bears: 0,
    // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    // removeAllBears: () => set({ bears: 0 }),
    updatedState: false,
    setUpdatedState: () => set((state) => ({ updatedState: !state.updatedState })),
    collapsedState: false,
    setCollapsedState: () => set((state) => ({ collapsedState: !state.collapsedState })),
}));

export default useStore;