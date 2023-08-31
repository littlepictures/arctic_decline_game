import {create} from "zustand";
import {immer} from "zustand/middleware/immer";

type Ui = "intro" | "game" | "finish" | "play-again";

interface State {
  autoplay: boolean;
  contentWidth: number;
  ui: "intro" | "game" | "finish" | "play-again";
  setUi: (ui: Ui) => void;
}

const useMyStore = create<State>()(
  immer((set) => ({
    autoplay: new URL(String(document.location)).searchParams?.get("autoplay")
      ? true
      : false,
    contentWidth: Math.min(window.innerWidth, 780),
    ui:
      (new URL(String(document.location)).searchParams?.get("debug") as Ui) ??
      "intro",
    setUi: (ui: Ui) =>
      set((state) => {
        state.ui = ui;
      }),
  }))
);

export {useMyStore};
