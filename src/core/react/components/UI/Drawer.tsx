import classNames from "classnames";
import React, { cloneElement, useMemo } from "react";

type MobileDrawerViewportStyle = React.CSSProperties & {
  "--mk-visual-viewport-height": string;
  "--mk-visual-viewport-offset-top": string;
  "--mk-keyboard-inset-bottom": string;
};

const mobileDrawerViewportStyleKeys = [
  "--mk-visual-viewport-height",
  "--mk-visual-viewport-offset-top",
  "--mk-keyboard-inset-bottom",
] as const;

const getMobileDrawerWindow = () => document.defaultView ?? window;

const getMobileDrawerViewportStyle = (
  win: Window
): MobileDrawerViewportStyle => {
  const viewport = win.visualViewport;
  const height = Math.round(viewport?.height ?? win.innerHeight);
  const offsetTop = Math.round(viewport?.offsetTop ?? 0);
  const keyboardInset = Math.max(
    0,
    Math.round(win.innerHeight - height - offsetTop)
  );

  return {
    "--mk-visual-viewport-height": `${height}px`,
    "--mk-visual-viewport-offset-top": `${offsetTop}px`,
    "--mk-keyboard-inset-bottom": `${keyboardInset}px`,
  };
};

const isSameMobileDrawerViewportStyle = (
  current: MobileDrawerViewportStyle,
  next: MobileDrawerViewportStyle
) =>
  mobileDrawerViewportStyleKeys.every((key) => current[key] === next[key]);

type MobileDrawerPhase = "measuring" | "open";

export const MobileDrawer = (props: {
  fc: JSX.Element;
  title?: string;
  hide: (suppress: boolean) => void;
  className: string;
  newProps: any;
  scaleBackground?: boolean;
  disablePreventScroll?: boolean;
}) => {
  const { newProps } = props;
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [drawerPhase, setDrawerPhase] =
    React.useState<MobileDrawerPhase>("measuring");
  const [drawerHeight, setDrawerHeight] = React.useState<number>();
  const [viewportStyle, setViewportStyle] =
    React.useState<MobileDrawerViewportStyle>(() =>
      getMobileDrawerViewportStyle(getMobileDrawerWindow())
    );
  const drawerCount = useMemo(() => {
    const drawers = document.querySelectorAll(".mk-drawer-content");
    let drawerIndex = 0;
    drawers.forEach((drawer) => {
      if (drawer instanceof HTMLElement) {
        const index = drawer.getAttribute("data-drawer-index");
        if (index && parseInt(index) >= drawerIndex) {
          drawerIndex = parseInt(index) + 1;
        }
      }
    });
    return drawerIndex;
  }, []);
  React.useLayoutEffect(() => {
    const win = getMobileDrawerWindow();
    const viewport = win.visualViewport;
    const updateViewportStyle = () => {
      const nextStyle = getMobileDrawerViewportStyle(win);
      setViewportStyle((currentStyle) =>
        isSameMobileDrawerViewportStyle(currentStyle, nextStyle)
          ? currentStyle
          : nextStyle
      );
    };

    updateViewportStyle();
    viewport?.addEventListener("resize", updateViewportStyle);
    viewport?.addEventListener("scroll", updateViewportStyle);
    win.addEventListener("resize", updateViewportStyle);

    return () => {
      viewport?.removeEventListener("resize", updateViewportStyle);
      viewport?.removeEventListener("scroll", updateViewportStyle);
      win.removeEventListener("resize", updateViewportStyle);
    };
  }, []);

  React.useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const viewportHeight = parseInt(
      viewportStyle["--mk-visual-viewport-height"],
      10
    );
    const maxHeight = Math.max(0, (viewportHeight || window.innerHeight) - 24);
    const measuredHeight = Math.min(
      Math.ceil(content.getBoundingClientRect().height),
      maxHeight
    );

    setDrawerHeight((currentHeight) =>
      currentHeight === measuredHeight ? currentHeight : measuredHeight
    );

    const animationFrame = requestAnimationFrame(() => {
      setDrawerPhase("open");
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [viewportStyle]);

  const hideDrawer = (supress?: boolean) => {
    props.hide(supress);
  };

  return (
    <>
      <div
        className={classNames("mk-drawer-overlay", {
          "mk-drawer-open": drawerPhase === "open",
        })}
        onMouseDown={() => hideDrawer(true)}
        style={
          {
            "--drawer-index": drawerCount,
            ...viewportStyle,
          } as React.CSSProperties
        }
      />
      <div
        ref={contentRef}
        className={classNames("mk-drawer-content", props.className, {
          "mk-drawer-measuring": drawerPhase === "measuring",
          "mk-drawer-open": drawerPhase === "open",
        })}
        data-drawer-index={drawerCount}
        role="dialog"
        aria-modal="true"
        style={
          {
            "--drawer-index": drawerCount,
            ...(drawerHeight ? { height: `${drawerHeight}px` } : {}),
            ...viewportStyle,
          } as React.CSSProperties
        }
      >
        <div className="mk-drawer-handle" />
        <div className="mk-drawer-title" hidden={!(props.title?.length > 0)}>
          {props.title}
        </div>
        {cloneElement(props.fc, {
          hide: (supress?: boolean) => {
            hideDrawer(supress);
          },
          ...newProps,
        })}
      </div>
    </>
  );
};
