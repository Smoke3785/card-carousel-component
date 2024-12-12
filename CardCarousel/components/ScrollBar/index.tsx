// Styles
import styles from "./scrollbar.module.scss";
import clsx from "clsx";

// Hooks
import { useScrollBarState } from "../../utils/hooks";

// Types
import type { ScrollBarProps } from "../../types";

const ScrollBar = ({
  goToCard,
  active,
  keys,
  // Base props
  className,
}: ScrollBarProps) => {
  const [containerRef, _scrollItems] = useScrollBarState(keys, active);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "gcollective-ScrollBar-root",
        styles.scrollBarContainer,
        "noScrollBar",
        className
      )}
    >
      {_scrollItems.map(({ key, ref }) => {
        const _active = key === active;

        return (
          <div
            data-active={_active.toString()}
            className={styles.scrollBar}
            ref={ref}
            key={key}
            onClick={() => {
              !_active && goToCard(key);
            }}
          />
        );
      })}
    </div>
  );
};

// Export this with a more context-agnostic name for use in other components.
export { ScrollBar as ProgressIndicator };
export default ScrollBar;
export { ScrollBar };
