import { isPhone } from "core/utils/ui/screen";
import { SelectOption, SelectOptionType, Superstate } from "makemd-core";
import React from "react";
import StickerModal from "shared/components/StickerModal";
import i18n from "shared/i18n";
import { MenuObject } from "shared/types/menu";
import { Rect } from "shared/types/Pos";
import { Sticker } from "shared/types/ui";
import { defaultMenu, menuSeparator } from "../menu/SelectionMenu";

const stickerValue = (sticker: Sticker) => `${sticker.type}//${sticker.value}`;

const openStickerPalette = (
  superstate: Superstate,
  win: Window,
  selectedSticker: (sticker: string) => void
) =>
  superstate.ui.openPalette(
    <StickerModal ui={superstate.ui} selectedSticker={selectedSticker} />,
    win
  );

const showNativeStickerCategoryMenu = (
  superstate: Superstate,
  rect: Rect,
  win: Window,
  category: string,
  selectedSticker: (sticker: string) => void
): MenuObject => {
  const options = superstate.ui
    .allStickers()
    .filter((sticker) => sticker.type == category)
    .map(
      (sticker): SelectOption => ({
        name: sticker.name,
        icon: "ui//sticker",
        onClick: () => selectedSticker(stickerValue(sticker)),
      })
    );

  return superstate.ui.openMenu(
    rect,
    defaultMenu(superstate.ui, options),
    win,
    "bottom"
  );
};

export const showStickerPickerMenu = (
  superstate: Superstate,
  rect: Rect,
  win: Window,
  selectedSticker: (sticker: string) => void
): MenuObject => {
  if (!isPhone(superstate.ui)) {
    return openStickerPalette(superstate, win, selectedSticker);
  }

  const stickers = superstate.ui.allStickers();
  const categories = Array.from(new Set(stickers.map((sticker) => sticker.type)));
  const options: SelectOption[] = [
    {
      name: i18n.labels.findStickers,
      icon: "ui//search",
      onClick: () => openStickerPalette(superstate, win, selectedSticker),
    },
  ];

  if (categories.length > 0) options.push(menuSeparator);

  categories.forEach((category) => {
    options.push({
      name: category,
      icon: "ui//sticker",
      type: SelectOptionType.Submenu,
      onSubmenu: (offset) =>
        showNativeStickerCategoryMenu(
          superstate,
          offset,
          win,
          category,
          selectedSticker
        ),
    });
  });

  return superstate.ui.openMenu(
    rect,
    defaultMenu(superstate.ui, options),
    win,
    "bottom"
  );
};
