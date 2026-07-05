import { Superstate } from "makemd-core";
import React from "react";
import StickerModal from "shared/components/StickerModal";
import { MenuObject } from "shared/types/menu";
import { Rect } from "shared/types/Pos";

const openStickerPalette = (
  superstate: Superstate,
  win: Window,
  selectedSticker: (sticker: string) => void,
  initialCategory?: string
) =>
  superstate.ui.openPalette(
    <StickerModal
      ui={superstate.ui}
      selectedSticker={selectedSticker}
      initialCategory={initialCategory}
    />,
    win
  );

export const showStickerPickerMenu = (
  superstate: Superstate,
  _rect: Rect,
  win: Window,
  selectedSticker: (sticker: string) => void
): MenuObject => openStickerPalette(superstate, win, selectedSticker);
