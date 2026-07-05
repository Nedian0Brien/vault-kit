import { isPhone } from "core/utils/ui/screen";
import { Menu } from "obsidian";
import React from "react";
import {
  MenuObject,
  SelectMenuProps,
  SelectOption,
  SelectOptionType,
} from "shared/types/menu";
import { Anchors, Rect } from "shared/types/Pos";

const unsupportedOptionTypes = new Set<SelectOptionType>([
  SelectOptionType.Disclosure,
  SelectOptionType.Input,
  SelectOptionType.Toggle,
  SelectOptionType.Custom,
]);

const toMenuPosition = (rect: Rect, anchor: Anchors) => ({
  x: rect.x,
  y: anchor == "bottom" ? rect.y + rect.height : rect.y,
  width: rect.width,
});

const logNativeMenu = (message: string, data?: Record<string, unknown>) => {
  console.log("[VaultKit][native-menu]", message, data ?? {});
};

const optionSample = (option: SelectOption) => ({
  name: option.name,
  icon: option.icon ?? null,
  type: option.type ?? SelectOptionType.Option,
  disabled: Boolean(option.disabled),
  hasSubmenu: Boolean(option.onSubmenu),
  autoLoadMore: Boolean(option.autoLoadMore),
  nativeSearch: Boolean(option.nativeSearch),
});

const findScrollableMenuElement = (menuEl: HTMLElement, win: Window) => {
  const candidates = [
    menuEl,
    ...Array.from(menuEl.querySelectorAll<HTMLElement>("*")),
  ];
  return candidates.find((el) => {
    if (el.scrollHeight <= el.clientHeight) return false;
    const overflowY = win.getComputedStyle(el).overflowY;
    return overflowY == "auto" || overflowY == "scroll" || el == menuEl;
  });
};

const uiIconMap: Record<string, string> = {
  "apply-items": "list-checks",
  "arrow-up-down": "arrow-up-down",
  "arrow-up-right": "arrow-up-right",
  check: "check",
  "clipboard-add": "clipboard-plus",
  close: "x",
  copy: "copy",
  documents: "files",
  edit: "pencil",
  "eye-off": "eye-off",
  "file-minus": "file-minus",
  "file-plus-2": "file-plus-2",
  "folder-plus": "folder-plus",
  "go-to-file": "file-input",
  "layout-dashboard": "layout-dashboard",
  "paper-plane": "send",
  palette: "palette",
  pin: "pin",
  "pin-off": "pin-off",
  plus: "plus",
  search: "search",
  "sort-desc": "arrow-down-wide-narrow",
  sticker: "sticker",
  tags: "tags",
  trash: "trash",
};

const toObsidianIcon = (icon?: string) => {
  if (!icon) return null;
  if (!icon.includes("//")) return icon;

  const [source, value] = icon.split("//");
  if (source == "lucide") return value;
  if (source == "ui") return uiIconMap[value] ?? null;
  return null;
};

const toReactMouseEvent = (
  event: MouseEvent | KeyboardEvent,
  win: Window
): React.MouseEvent => {
  if (event instanceof win.MouseEvent) {
    return event as MouseEvent & React.MouseEvent;
  }

  return new win.MouseEvent("click", {
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
    view: win,
  }) as MouseEvent & React.MouseEvent;
};

const canRenderOptionNatively = (option: SelectOption) => {
  if (option.nativeSearch) return true;
  if (
    option.fragment ||
    option.onMoreOptions ||
    option.onRemove ||
    option.onToggle ||
    option.onReorder ||
    option.onValueChange ||
    option.sortable ||
    option.removeable
  ) {
    return false;
  }
  if (option.type && unsupportedOptionTypes.has(option.type)) return false;
  if (option.type == SelectOptionType.Submenu && !option.onSubmenu) return false;
  return true;
};

export const canShowNativeObsidianMenu = (
  optionProps: SelectMenuProps,
  force?: boolean
) => {
  if (!isPhone(optionProps.ui) || force) return false;
  if (
    optionProps.multi ||
    optionProps.editable ||
    optionProps.searchable ||
    optionProps.defaultOptions ||
    optionProps.addKeyword ||
    optionProps.previewComponent ||
    optionProps.showSections ||
    optionProps.sections?.length ||
    optionProps.onMoreOption ||
    optionProps.onHover ||
    optionProps.onSelectSection ||
    optionProps.isDisclosure
  ) {
    return false;
  }
  return optionProps.options.every(canRenderOptionNatively);
};

export const showNativeObsidianMenu = (
  rect: Rect,
  optionProps: SelectMenuProps,
  win: Window,
  defaultAnchor: Anchors,
  onHide?: () => void
): MenuObject => {
  const menu = new Menu();
  let isComplete = false;
  let isParentHidden = false;
  let submenu: { hide: (suppress?: boolean) => void } | null = null;
  let removeAutoLoadMoreScroll: (() => void) | null = null;
  let autoLoadMoreTriggered = false;
  let nativeSearchTimeout: number | null = null;
  logNativeMenu("show:start", {
    optionCount: optionProps.options.length,
    anchor: defaultAnchor,
    position: toMenuPosition(rect, defaultAnchor),
    sample: optionProps.options.slice(0, 5).map(optionSample),
  });

  const hideParent = () => {
    if (isParentHidden) return;
    isParentHidden = true;
    menu.hide();
  };

  const hide = (suppress?: boolean) => {
    if (isComplete) return;
    isComplete = true;
    if (nativeSearchTimeout != null) {
      win.clearTimeout(nativeSearchTimeout);
      nativeSearchTimeout = null;
    }
    removeAutoLoadMoreScroll?.();
    removeAutoLoadMoreScroll = null;
    if (submenu) submenu.hide(true);
    hideParent();
    if (!suppress) onHide?.();
  };

  const saveOption = (option: SelectOption) => {
    if (!optionProps.saveOptions) return false;
    const value = option.value ?? option.name;
    optionProps.saveOptions(
      optionProps.options.map((item) => item.value ?? item.name),
      [value],
      true,
      option.section
    );
    return true;
  };

  const attachAutoLoadMoreScroll = () => {
    const autoLoadMoreOption = optionProps.options.find(
      (option) => option.autoLoadMore && option.onClick
    );
    if (!autoLoadMoreOption || !menu.dom) return;

    const scrollEl = findScrollableMenuElement(menu.dom, win);
    if (!scrollEl) {
      logNativeMenu("show:auto-load-more:no-scroll-target", {
        optionCount: optionProps.options.length,
      });
      return;
    }

    const onScroll = () => {
      if (isComplete || autoLoadMoreTriggered) return;
      if (scrollEl.scrollHeight <= scrollEl.clientHeight) return;

      const distanceFromBottom =
        scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight;
      if (distanceFromBottom > 96) return;

      autoLoadMoreTriggered = true;
      logNativeMenu("show:auto-load-more:trigger", {
        option: optionSample(autoLoadMoreOption),
        optionCount: optionProps.options.length,
        distanceFromBottom,
      });
      autoLoadMoreOption.onClick?.(
        toReactMouseEvent(new win.MouseEvent("click", { view: win }), win)
      );
      hide(true);
    };

    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    removeAutoLoadMoreScroll = () =>
      scrollEl.removeEventListener("scroll", onScroll);
  };

  optionProps.options.forEach((option, index) => {
    if (
      optionProps.options.length > 100 &&
      (index == 0 || index % 250 == 0 || index == optionProps.options.length - 1)
    ) {
      logNativeMenu("show:add-item:progress", {
        index,
        optionCount: optionProps.options.length,
        option: optionSample(option),
      });
    }
    if (option.type == SelectOptionType.Separator) {
      menu.addSeparator();
      return;
    }

    if (option.nativeSearch) {
      menu.addItem((item) => {
        const wrapper = win.document.createDocumentFragment();
        const search = win.document.createElement("input");
        search.type = "search";
        search.value = option.nativeSearch?.value ?? "";
        search.placeholder = option.nativeSearch?.placeholder ?? "";
        search.className = "vaultkit-native-search-input";
        search.autocapitalize = "none";
        search.autocomplete = "off";
        search.spellcheck = false;
        search.addEventListener("click", (event) => event.stopPropagation());
        search.addEventListener("touchstart", (event) => event.stopPropagation(), {
          passive: true,
        });
        search.addEventListener("keydown", (event) => event.stopPropagation());
        search.addEventListener("input", () => {
          if (nativeSearchTimeout != null) win.clearTimeout(nativeSearchTimeout);
          nativeSearchTimeout = win.setTimeout(() => {
            const nextValue = search.value;
            hide(true);
            option.nativeSearch?.onChange(nextValue);
          }, 180);
        });
        wrapper.appendChild(search);
        item.setTitle(wrapper);
        if (option.nativeSearch?.autoFocus) {
          win.setTimeout(() => {
            search.focus();
            search.setSelectionRange(search.value.length, search.value.length);
          }, 0);
        }
      });
      return;
    }

    menu.addItem((item) => {
      item.setTitle(option.name);
      const icon = toObsidianIcon(option.icon);
      if (icon) item.setIcon(icon);
      if (option.type == SelectOptionType.Section) {
        item.setIsLabel(true);
        item.setDisabled(true);
        return;
      }
      if (option.type == SelectOptionType.Radio) {
        item.setChecked(Boolean(option.value));
      }
      if (option.disabled) {
        item.setDisabled(true);
      }
      item.onClick((event) => {
        if (option.disabled) return;
        if (option.onSubmenu) {
          logNativeMenu("item:submenu-click", {
            option: optionSample(option),
            parentOptionCount: optionProps.options.length,
          });
          const nextMenu = option.onSubmenu(rect, () => hide(false));
          submenu?.hide(true);
          submenu = nextMenu;
          hideParent();
          return;
        }
        if (option.onClick) {
          option.onClick(toReactMouseEvent(event, win));
          hide(false);
          return;
        }
        if (saveOption(option)) {
          hide(false);
        }
      });
    });
  });

  menu.onHide(() => {
    isParentHidden = true;
    if (submenu || isComplete) return;
    hide(false);
  });
  const position = toMenuPosition(rect, defaultAnchor);
  logNativeMenu("show:show-at-position:before", {
    optionCount: optionProps.options.length,
    position,
  });
  menu.showAtPosition(position, win.document);
  logNativeMenu("show:show-at-position:after", {
    optionCount: optionProps.options.length,
  });
  win.setTimeout(attachAutoLoadMoreScroll, 0);

  return {
    hide,
    update: () => undefined,
  };
};
