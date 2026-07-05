import { SelectMenu, SelectMenuProps } from "makemd-core";
import React from "react";
import { Anchors, Rect } from "shared/types/Pos";
import { showMenu } from "./menu";
import {
  canShowNativeObsidianMenu,
  showNativeObsidianMenu,
} from "./nativeObsidianMenu";

export type Point = { x: number; y: number };

export const showSelectMenu = (
  rect: Rect,
  optionProps: SelectMenuProps,
  win: Window,
  defaultAnchor: Anchors,
  onHide?: () => void,
  force?: boolean
) => {
  if (canShowNativeObsidianMenu(optionProps, force)) {
    return showNativeObsidianMenu(rect, optionProps, win, defaultAnchor, onHide);
  }
  return showMenu({
    ui: optionProps.ui,
    rect: rect,
    anchor: defaultAnchor,
    win,
    fc: <SelectMenu {...optionProps} />,
    onHide,
    className: optionProps.searchable ? "mk-combo-menu" : "mk-select-menu",
    force,
  });
};
