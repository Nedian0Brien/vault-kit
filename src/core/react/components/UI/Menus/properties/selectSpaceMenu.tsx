import { SelectOption, Superstate } from "makemd-core";
import i18n from "shared/i18n";
import { MenuObject } from "shared/types/menu";
import { Rect } from "shared/types/Pos";

export const showSpacesMenu = (
  offset: Rect,
  win: Window,
  superstate: Superstate,
  saveLink: (link: string, isNew?: boolean, type?: string) => void,
  includeDefaults?: boolean,
  canAdd?: boolean,
  onlyTags?: boolean,
  hidden?: boolean
) => {
  const options = [...superstate.allSpaces(true, hidden)]
    .filter(
      (f) =>
        (includeDefaults || f.type != "default") &&
        (!onlyTags || f.type == "tag")
    )
    .map<SelectOption>((f) => ({
      name: f.name,
      value: f.path,
      icon: superstate.pathsIndex.get(f.path)?.label?.sticker,
      section: f.type == "tag" ? "tag" : f.type == "folder" ? "folder" : "",
      description:
        f.type == "tag" ? f.name : f.type == "folder" ? f.path : f.path,
    }));

  return superstate.ui.openMenu(
    offset,
    {
      ui: superstate.ui,
      multi: false,
      editable: canAdd,
      addKeyword: "Create",
      value: [],
      options,
      sections: onlyTags
        ? []
        : [
            { name: i18n.buttons.tag, value: "tag" },
            { name: i18n.menu.folder, value: "folder" },
          ],
      saveOptions: (
        _: string[],
        value: string[],
        isNew?: boolean,
        section?: string
      ) => {
        saveLink(value[0], isNew, section);
      },
      placeholder: i18n.labels.spaceSelectPlaceholder,
      detail: true,
      searchable: true,
      showSections: !onlyTags,
      showAll: true,
    },
    win,
    "bottom"
  );
};

export const showNativeSpacesMenu = (
  offset: Rect,
  win: Window,
  superstate: Superstate,
  saveLink: (link: string) => void,
  includeDefaults?: boolean,
  onlyTags?: boolean,
  hidden?: boolean,
  query = ""
) => {
  const normalizedQuery = query.trim().toLowerCase();
  const spaces = [...superstate.allSpaces(true, hidden)]
    .filter(
      (f) =>
        (includeDefaults || f.type != "default") &&
        (!onlyTags || f.type == "tag") &&
        (!normalizedQuery ||
          [f.name, f.path, f.type].some((value) =>
            value?.toLowerCase().includes(normalizedQuery)
          ))
    )
    .map<SelectOption>((f) => ({
      name: f.name,
      value: f.path,
      icon: superstate.pathsIndex.get(f.path)?.label?.sticker,
      description:
        f.type == "tag" ? f.name : f.type == "folder" ? f.path : f.path,
      onClick: () => saveLink(f.path),
    }));
  const options: SelectOption[] =
    spaces.length > 0
      ? spaces
      : [
          {
            name: i18n.labels.empty,
            disabled: true,
          },
        ];
  let menuObject: MenuObject;
  const reopenWithQuery = (nextQuery: string) => {
    menuObject?.hide(true);
    showNativeSpacesMenu(
      offset,
      win,
      superstate,
      saveLink,
      includeDefaults,
      onlyTags,
      hidden,
      nextQuery
    );
  };

  menuObject = superstate.ui.openMenu(
    offset,
    {
      ui: superstate.ui,
      multi: false,
      editable: false,
      value: [],
      options,
      searchable: false,
      showAll: true,
      floatingSearch: {
        value: query,
        placeholder: i18n.labels.spaceSelectPlaceholder,
        onChange: reopenWithQuery,
        autoFocus: Boolean(query),
      },
    },
    win,
    "bottom"
  );
  return menuObject;
};
