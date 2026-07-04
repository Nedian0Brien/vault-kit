import classNames from "classnames";
import React, { cloneElement, useMemo } from "react";
import { Drawer } from "vaul";
export const MobileDrawer = (props: {
  fc: JSX.Element;
  title?: string;
  hide: (suppress: boolean) => void;
  className: string;
  newProps: any;
}) => {
  const { newProps } = props;
  const [open, setOpen] = React.useState(true);
  const [viewportStyle, setViewportStyle] = React.useState<React.CSSProperties>(
    {}
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
  React.useEffect(() => {
    const win = document.defaultView ?? window;
    const viewport = win.visualViewport;
    const updateViewportStyle = () => {
      const height = Math.round(viewport?.height ?? win.innerHeight);
      const offsetTop = Math.round(viewport?.offsetTop ?? 0);
      const keyboardInset = Math.max(
        0,
        Math.round(win.innerHeight - height - offsetTop)
      );

      setViewportStyle({
        "--mk-visual-viewport-height": `${height}px`,
        "--mk-visual-viewport-offset-top": `${offsetTop}px`,
        "--mk-keyboard-inset-bottom": `${keyboardInset}px`,
      } as React.CSSProperties);
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

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
      shouldScaleBackground
      onClose={() => {
        setOpen(false);
        props.hide(true);
      }}
      fixed
      noBodyStyles
    >
      <Drawer.Portal>
        <Drawer.Content
          className={classNames("mk-drawer-content", props.className)}
          data-drawer-index={drawerCount}
          style={
            {
              "--drawer-index": drawerCount,
              ...viewportStyle,
            } as React.CSSProperties
          }
        >
          <Drawer.Handle className="mk-drawer-handle" />
          <Drawer.Title
            className="mk-drawer-title"
            hidden={!(props.title?.length > 0)}
          >
            {props.title}
          </Drawer.Title>
          {cloneElement(props.fc, {
            hide: (supress?: boolean) => {
              setOpen(false);
              props.hide(supress);
            },
            ...newProps,
          })}
        </Drawer.Content>
        <Drawer.Overlay
          className="mk-drawer-overlay"
          style={
            {
              "--drawer-index": drawerCount,
              ...viewportStyle,
            } as React.CSSProperties
          }
        />
      </Drawer.Portal>
    </Drawer.Root>
  );
};
