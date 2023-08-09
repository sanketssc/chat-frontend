import { create } from "zustand";

export const useCreateRoomStore = create((set) => ({
    item: {
        type: "create",
        username: "",
    },
    setItem: (item) => set({ item: item }),
}));
