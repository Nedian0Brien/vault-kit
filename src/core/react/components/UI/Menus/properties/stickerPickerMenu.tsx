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

const nativeStickerIcon = (sticker: Sticker) =>
  sticker.type == "lucide" ? `lucide//${sticker.value}` : undefined;

const logStickerPicker = (message: string, data?: Record<string, unknown>) => {
  console.info("[VaultKit][sticker-picker]", message, data ?? {});
};

const stickerSample = (sticker: Sticker) => ({
  type: sticker.type,
  name: sticker.name,
  value: sticker.value,
  htmlLength: sticker.html?.length ?? 0,
  htmlStart: sticker.html?.slice(0, 24) ?? "",
  icon: nativeStickerIcon(sticker) ?? null,
});

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
  const allStickers = superstate.ui.allStickers();
  const categoryStickers = allStickers.filter(
    (sticker) => sticker.type == category
  );
  logStickerPicker("category:build-options:start", {
    category,
    allCount: allStickers.length,
    categoryCount: categoryStickers.length,
    rect,
    sample: categoryStickers.slice(0, 5).map(stickerSample),
  });

  const options = categoryStickers.map(
    (sticker): SelectOption => ({
      name: sticker.name,
      icon: nativeStickerIcon(sticker),
      onClick: () => selectedSticker(stickerValue(sticker)),
    })
  );

  logStickerPicker("category:open-menu:before", {
    category,
    optionCount: options.length,
    firstOption: options[0]?.name ?? null,
    lastOption: options[options.length - 1]?.name ?? null,
  });

  try {
    const menu = superstate.ui.openMenu(
      rect,
      defaultMenu(superstate.ui, options),
      win,
      "bottom"
    );
    logStickerPicker("category:open-menu:after", {
      category,
      optionCount: options.length,
    });
    return menu;
  } catch (error) {
    console.error("[VaultKit][sticker-picker] category:open-menu:error", {
      category,
      optionCount: options.length,
      error,
    });
    throw error;
  }
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
  const categoryCounts = categories.reduce<Record<string, number>>(
    (counts, category) => ({
      ...counts,
      [category]: stickers.filter((sticker) => sticker.type == category).length,
    }),
    {}
  );
  logStickerPicker("root:build-options", {
    totalCount: stickers.length,
    categoryCounts,
    categories,
    rect,
  });
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
      onSubmenu: (offset) => {
        logStickerPicker("root:submenu-click", { category, offset });
        return showNativeStickerCategoryMenu(
          superstate,
          offset,
          win,
          category,
          selectedSticker
        );
      },
    });
  });

  return superstate.ui.openMenu(
    rect,
    defaultMenu(superstate.ui, options),
    win,
    "bottom"
  );
};
