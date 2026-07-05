import classNames from "classnames";
import { NavigatorContext } from "core/react/context/SidebarContext";
import { showNativeSpacesMenu } from "core/react/components/UI/Menus/properties/selectSpaceMenu";
import { createSpace } from "core/superstate/utils/spaces";
import { Superstate } from "makemd-core";
import i18n from "shared/i18n";
import React, { useContext, useEffect, useState } from "react";
import { Focus } from "shared/types/focus";
import { windowFromDocument } from "shared/utils/dom";
import StickerModal from "../../../../../shared/components/StickerModal";
export const FocusEditor = (props: {
  superstate: Superstate;
  focus: Focus;
  saveFocus: (focus: Focus) => void;
}) => {
  const {
    saveActiveSpace,
    editFocus: editFocus,
    activeFocus: activeFocus,
    setFocuses: setFocuses,
    focuses: focuses,
    setEditFocus: setEditFocus,
  } = useContext(NavigatorContext);
  const [focus, setFocus] = useState<Focus>(props.focus);
  useEffect(() => {
    setFocus(props.focus);
  }, [props.focus]);
  return focus && props.focus ? (
    props.focus.name?.length == 0 || editFocus ? (
      <div className="mk-path-tree-focus">
        <div
          className={classNames("mk-focuses-item")}
          dangerouslySetInnerHTML={{
            __html: props.superstate.ui.getSticker(focus.sticker),
          }}
          onClick={(e) =>
            props.superstate.ui.openPalette(
              <StickerModal
                ui={props.superstate.ui}
                selectedSticker={(emoji) => {
                  setFocus({ ...focus, sticker: emoji });
                }}
              />,
              windowFromDocument(e.view.document)
            )
          }
        ></div>
        <input
          value={focus.name}
          onChange={(e) => setFocus({ ...focus, name: e.target.value })}
        ></input>
        <div className="mk-button-group">
          <button onClick={() => props.saveFocus(focus)}>
            {i18n.buttons.save}
          </button>
          <button
            onClick={() => {
              if (props.focus.name.length == 0) {
                setFocuses(focuses.filter((f, i) => i != activeFocus));
                props.superstate.saveSettings();
              } else {
                setEditFocus(false);
              }
            }}
          >
            {i18n.buttons.cancel}
          </button>
        </div>
      </div>
    ) : (
      <div className="mk-path-tree-empty">
        <div className="mk-empty-state-title">{i18n.labels.openASpace}</div>
        <div className="mk-empty-state-description">
          {i18n.labels.openASpaceDesc}
        </div>
        <button
          onClick={(e) => {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            const win = windowFromDocument(e.view.document);
            const openSpace = (link: string) => {
              const isNew = !props.superstate.pathsIndex.has(link);
              if (isNew) {
                createSpace(props.superstate, link, {}).then((f) => {
                  saveActiveSpace(link);
                  props.superstate.ui.openPath(link, false);
                });
                return;
              }
              saveActiveSpace(link);
            };
            showNativeSpacesMenu(
              rect,
              win,
              props.superstate,
              openSpace,
              true,
              false,
              false
            );
          }}
        >
          {i18n.labels.openASpace}
        </button>
      </div>
    )
  ) : (
    <></>
  );
};
