import fs from "node:fs";

const drawer = fs.readFileSync("src/core/react/components/UI/Drawer.tsx", "utf8");
const menuCss = fs.readFileSync("src/css/Menus/Menu.css", "utf8");
const inputModal = fs.readFileSync(
  "src/core/react/components/UI/Modals/InputModal.tsx",
  "utf8"
);
const modal = fs.readFileSync("src/adapters/obsidian/ui/modal.tsx", "utf8");
const modalWrapper = fs.readFileSync(
  "src/core/react/components/UI/Modals/modalWrapper.tsx",
  "utf8"
);
const modalCss = fs.readFileSync("src/css/Modal/Modal.css", "utf8");
const selectMenuComponent = fs.readFileSync(
  "src/core/react/components/UI/Menus/menu/SelectMenuComponent.tsx",
  "utf8"
);
const menu = fs.readFileSync("src/core/react/components/UI/Menus/menu.tsx", "utf8");
const selectMenu = fs.readFileSync(
  "src/core/react/components/UI/Menus/selectMenu.tsx",
  "utf8"
);
const nativeObsidianMenu = fs.readFileSync(
  "src/core/react/components/UI/Menus/nativeObsidianMenu.ts",
  "utf8"
);
const colorPickerMenu = fs.readFileSync(
  "src/core/react/components/UI/Menus/properties/colorPickerMenu.tsx",
  "utf8"
);
const stickerPickerMenu = fs.readFileSync(
  "src/core/react/components/UI/Menus/properties/stickerPickerMenu.tsx",
  "utf8"
);

const checks = [
  {
    name: "MobileDrawer reads visualViewport",
    pass: drawer.includes("visualViewport"),
  },
  {
    name: "MobileDrawer exposes keyboard inset token",
    pass: drawer.includes("--mk-keyboard-inset-bottom"),
  },
  {
    name: "MobileDrawer updates on viewport resize",
    pass: drawer.includes('addEventListener("resize"'),
  },
  {
    name: "MobileDrawer does not shrink compact drawers with Vaul fixed mode",
    pass: !/<Drawer\.Root[\s\S]*\bfixed\b[\s\S]*>/.test(drawer),
  },
  {
    name: "MobileDrawer can disable background scaling",
    pass: drawer.includes("scaleBackground?: boolean") &&
      drawer.includes("shouldScaleBackground={props.scaleBackground ?? true}"),
  },
  {
    name: "MobileDrawer can disable Vaul scroll prevention",
    pass:
      drawer.includes("disablePreventScroll?: boolean") &&
      drawer.includes(
        "disablePreventScroll={props.disablePreventScroll ?? false}"
      ),
  },
  {
    name: "mobile modals do not scale the Obsidian app container",
    pass: /<MobileDrawer[\s\S]*scaleBackground={false}/.test(modal),
  },
  {
    name: "mobile menu drawers do not move or scale the Obsidian app container",
    pass:
      /<MobileDrawer[\s\S]*className={classNames\("mk-drawer-menu"[\s\S]*scaleBackground={false}/.test(
        menu
      ) &&
      /<MobileDrawer[\s\S]*className={classNames\("mk-drawer-menu"[\s\S]*disablePreventScroll={true}/.test(
        menu
      ),
  },
  {
    name: "mobile input modals render as centered modal wrappers",
    pass: /if \(!props\.isPalette\) {[\s\S]*root\.render\(renderModalWrapper/.test(
      modal
    ),
  },
  {
    name: "mobile centered modal portal has fixed wrapper styles",
    pass:
      modal.includes('portalElement.classList.add("mk-modal-wrapper-centered")') &&
      /\.mk-modal-wrapper,\s*\.mk-modal-wrapper-centered[\s\S]*position:\s*fixed/.test(
        modalCss
      ),
  },
  {
    name: "centered mobile modal follows visual viewport",
    pass:
      modalWrapper.includes("--mk-visual-viewport-height") &&
      /\.mk-modal-wrapper-mobile \.mk-modal-container[\s\S]*--mk-visual-viewport-height/.test(
        modalCss
      ),
  },
  {
    name: "phone modal wrapper overrides bottom sheet sizing",
    pass:
      /\.is-phone \.mk-modal-wrapper-mobile \.mk-modal[\s\S]*bottom:\s*auto/.test(
        modalCss
      ),
  },
  {
    name: "InputModal delays mobile autofocus",
    pass: inputModal.includes("focusDelay") && inputModal.includes("is-mobile"),
  },
  {
    name: "InputModal focuses without forced scroll",
    pass: inputModal.includes("preventScroll: true"),
  },
  {
    name: "mobile drawer modal removes extra bottom gap when keyboard opens",
    pass:
      /\.mk-drawer-content\.mk-drawer-modal[\s\S]*50px - var\(--mk-keyboard-inset-bottom/.test(
        menuCss
      ),
  },
  {
    name: "mobile drawer modal follows keyboard inset from the bottom",
    pass:
      /\.mk-drawer-content\.mk-drawer-modal[\s\S]*bottom:\s*var\(--mk-keyboard-inset-bottom/.test(
        menuCss
      ),
  },
  {
    name: "mobile drawer modal caps height to visual viewport",
    pass:
      /\.mk-drawer-content\.mk-drawer-modal[\s\S]*--mk-visual-viewport-height/.test(
        menuCss
      ),
  },
  {
    name: "mobile select menus render options before drawer enter transition",
    pass:
      /useState<SelectOption\[\]>\(\(\) =>\s*getOptions\(props, query, section\)/.test(
        selectMenuComponent
      ) && !/useState<SelectOption\[\]>\(\[\]\)/.test(selectMenuComponent),
  },
  {
    name: "mobile standard select menus prefer Obsidian native menu",
    pass:
      selectMenu.includes("canShowNativeObsidianMenu") &&
      selectMenu.includes("showNativeObsidianMenu") &&
      nativeObsidianMenu.includes("new Menu()") &&
      nativeObsidianMenu.includes("showAtPosition"),
  },
  {
    name: "native mobile menu falls back for custom Make menu features",
    pass:
      nativeObsidianMenu.includes("SelectOptionType.Input") &&
      nativeObsidianMenu.includes("SelectOptionType.Custom") &&
      nativeObsidianMenu.includes("option.onMoreOptions") &&
      nativeObsidianMenu.includes("option.onRemove"),
  },
  {
    name: "native mobile menu maps Make icons to Obsidian icons",
    pass:
      nativeObsidianMenu.includes("uiIconMap") &&
      nativeObsidianMenu.includes("toObsidianIcon") &&
      nativeObsidianMenu.includes("item.setIcon(icon)") &&
      nativeObsidianMenu.includes('"go-to-file": "file-input"') &&
      nativeObsidianMenu.includes("check: \"check\"") &&
      nativeObsidianMenu.includes("sticker: \"sticker\""),
  },
  {
    name: "mobile color picker submenus prefer native Obsidian menu",
    pass:
      colorPickerMenu.includes("showNativeColorPickerMenu") &&
      colorPickerMenu.includes("getColorPalettes(superstate)") &&
      colorPickerMenu.includes("isPhone(superstate.ui) && isSubmenu") &&
      colorPickerMenu.includes("defaultMenu(superstate.ui, options)"),
  },
  {
    name: "mobile sticker picker offers native Obsidian menu categories",
    pass:
      stickerPickerMenu.includes("showStickerPickerMenu") &&
      stickerPickerMenu.includes("isPhone(superstate.ui)") &&
      stickerPickerMenu.includes("SelectOptionType.Submenu") &&
      stickerPickerMenu.includes("showNativeStickerCategoryMenu") &&
      stickerPickerMenu.includes("openStickerPalette"),
  },
];

const failures = checks.filter((check) => !check.pass);

if (failures.length > 0) {
  console.error("Keyboard-safe drawer checks failed:");
  for (const failure of failures) {
    console.error(`- ${failure.name}`);
  }
  process.exit(1);
}

console.log("Keyboard-safe drawer checks passed.");
