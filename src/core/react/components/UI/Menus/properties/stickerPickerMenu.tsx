import { isPhone } from "core/utils/ui/screen";
import { SelectOption, SelectOptionType, Superstate } from "makemd-core";
import { addIcon } from "obsidian";
import React from "react";
import StickerModal from "shared/components/StickerModal";
import i18n from "shared/i18n";
import { MenuObject } from "shared/types/menu";
import { Rect } from "shared/types/Pos";
import { Sticker } from "shared/types/ui";
import { emojiFromString } from "shared/utils/stickers";
import { defaultMenu, menuSeparator } from "../menu/SelectionMenu";

const stickerValue = (sticker: Sticker) => `${sticker.type}//${sticker.value}`;
const stickerPreviewIconIds = new Set<string>();

const hashStickerValue = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

const scaleStickerSvg = (svg: string) => {
  const trimmed = svg.trim();
  const viewBox = trimmed.match(/\sviewBox="([^"]+)"/)?.[1] ?? "0 0 24 24";
  const inner = trimmed
    .replace(/^<svg\b[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="${viewBox}"><g transform="translate(-2.4 -2.4) scale(1.2)">${inner}</g></svg>`;
};

const registerStickerPreviewIcon = (sticker: Sticker) => {
  if (sticker.type == "emoji") return null;

  const iconId = `vaultkit-sticker-preview-${hashStickerValue(
    stickerValue(sticker)
  )}`;
  if (stickerPreviewIconIds.has(iconId)) return iconId;

  if (!sticker.html.trim().startsWith("<svg")) return null;

  addIcon(iconId, scaleStickerSvg(sticker.html));
  stickerPreviewIconIds.add(iconId);
  return iconId;
};

const stickerMenuName = (sticker: Sticker) =>
  sticker.type == "emoji"
    ? `${emojiFromString(sticker.html)} ${sticker.name}`
    : sticker.name;

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
        name: stickerMenuName(sticker),
        icon: registerStickerPreviewIcon(sticker) ?? "ui//sticker",
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
