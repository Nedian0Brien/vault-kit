import { isPhone } from "core/utils/ui/screen";
import { SelectOption, SelectOptionType, Superstate } from "makemd-core";
import React from "react";
import StickerModal from "shared/components/StickerModal";
import i18n from "shared/i18n";
import { MenuObject } from "shared/types/menu";
import { Rect } from "shared/types/Pos";
import { Sticker } from "shared/types/ui";
import { emojiFromString } from "shared/utils/stickers";
import { defaultMenu, menuSeparator } from "../menu/SelectionMenu";

const NATIVE_STICKER_BATCH_SIZE = 100;
const stickerValue = (sticker: Sticker) => `${sticker.type}//${sticker.value}`;

const nativeStickerIcon = (sticker: Sticker) =>
  sticker.type == "lucide" ? `lucide//${sticker.value}` : undefined;

const stickerMenuName = (sticker: Sticker) =>
  sticker.type == "emoji"
    ? `${emojiFromString(sticker.value)} ${sticker.name}`
    : sticker.name;

const matchesStickerQuery = (sticker: Sticker, query: string) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  return [sticker.name, sticker.value, sticker.keywords].some((value) =>
    value.toLowerCase().includes(normalizedQuery)
  );
};

const logStickerPicker = (message: string, data?: Record<string, unknown>) => {
  console.log("[VaultKit][sticker-picker]", message, data ?? {});
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

const showNativeStickerCategoryMenu = (
  superstate: Superstate,
  rect: Rect,
  win: Window,
  category: string | null,
  selectedSticker: (sticker: string) => void,
  visibleCount = NATIVE_STICKER_BATCH_SIZE,
  query = "",
  focusSearch = false
): MenuObject => {
  const allStickers = superstate.ui.allStickers();
  const categoryStickers = allStickers.filter(
    (sticker) =>
      (category == null || sticker.type == category) &&
      matchesStickerQuery(sticker, query)
  );
  const visibleStickers = categoryStickers.slice(0, visibleCount);
  logStickerPicker("category:build-options:start", {
    category: category ?? "all",
    query,
    allCount: allStickers.length,
    categoryCount: categoryStickers.length,
    visibleCount: visibleStickers.length,
    rect,
    sample: visibleStickers.slice(0, 5).map(stickerSample),
  });

  const options: SelectOption[] = [
    {
      name: i18n.labels.back,
      icon: "lucide//chevron-left",
      onClick: () =>
        showStickerPickerMenu(superstate, rect, win, selectedSticker),
    },
    {
      name: i18n.labels.findStickers,
      nativeSearch: {
        value: query,
        placeholder: i18n.labels.findStickers,
        autoFocus: focusSearch,
        onChange: (value) =>
          showNativeStickerCategoryMenu(
            superstate,
            rect,
            win,
            category,
            selectedSticker,
            NATIVE_STICKER_BATCH_SIZE,
            value,
            true
          ),
      },
    },
    menuSeparator,
  ];

  options.push(
    ...visibleStickers.map(
      (sticker): SelectOption => ({
        name: stickerMenuName(sticker),
        icon: nativeStickerIcon(sticker),
        onClick: () => selectedSticker(stickerValue(sticker)),
      })
    )
  );

  if (visibleStickers.length < categoryStickers.length) {
    options.push(menuSeparator);
    options.push({
      name: `${i18n.labels.loadMore} (${visibleStickers.length}/${categoryStickers.length})`,
      icon: "ui//plus",
      autoLoadMore: true,
      onClick: () =>
        showNativeStickerCategoryMenu(
          superstate,
          rect,
          win,
          category,
          selectedSticker,
          visibleCount + NATIVE_STICKER_BATCH_SIZE,
          query,
          focusSearch
        ),
    });
  }

  logStickerPicker("category:open-menu:before", {
    category: category ?? "all",
    query,
    optionCount: options.length,
    visibleCount: visibleStickers.length,
    totalCount: categoryStickers.length,
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
      category: category ?? "all",
      optionCount: options.length,
    });
    return menu;
  } catch (error) {
    console.error("[VaultKit][sticker-picker] category:open-menu:error", {
      category: category ?? "all",
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
      type: SelectOptionType.Submenu,
      onSubmenu: (offset) =>
        showNativeStickerCategoryMenu(
          superstate,
          offset,
          win,
          null,
          selectedSticker
        ),
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
