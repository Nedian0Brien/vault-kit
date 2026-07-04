import fs from "node:fs";

const drawer = fs.readFileSync("src/core/react/components/UI/Drawer.tsx", "utf8");
const menuCss = fs.readFileSync("src/css/Menus/Menu.css", "utf8");

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
    name: "mobile drawer modal uses keyboard inset token",
    pass:
      /\.mk-drawer-content\.mk-drawer-modal[\s\S]*--mk-keyboard-inset-bottom/.test(
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
