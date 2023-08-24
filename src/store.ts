import {create} from "zustand";
import {immer} from "zustand/middleware/immer";

type Ui = "intro" | "game" | "finish" | "play-again" | "highscore";

interface State {
  contentWidth: number;
  ui: "intro" | "game" | "finish" | "play-again" | "highscore";
  setUi: (ui: Ui) => void;
}

const useMyStore = create<State>()(
  immer((set) => ({
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
