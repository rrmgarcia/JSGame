import { create } from 'zustand';

type NameState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useName = create<NameState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
