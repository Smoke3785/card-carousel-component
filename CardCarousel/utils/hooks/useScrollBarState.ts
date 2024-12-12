// React
import { useEffect, useRef } from "react";

type ScrollBarState = [
  containerRef: React.RefObject<HTMLDivElement>,
  _scrollItems: Array<ReturnedScrollItemProps>
];

type ReturnedScrollItemProps = {
  ref: (instance: HTMLDivElement) => void;
  key: string;
};

export default function useScrollBarState(
  keys: Array<string>,
  active: string | null
): ScrollBarState {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollItems = useRef({});

  // This function returns a function that registers a ref to the cardsStore
  function imperativeGetRef<T extends HTMLElement = HTMLDivElement>(
    key: string
  ) {
    return function (instance: T): void {
      if (scrollItems?.current?.[key]) return;
      if (typeof instance === "undefined") return;

      scrollItems.current = {
        ...scrollItems.current,
        [key]: instance,
      };
    };
  }

  const _scrollItems: Array<ReturnedScrollItemProps> = keys.map((key) => {
    return {
      ref: imperativeGetRef(key),
      key,
    };
  });

  useEffect(() => {
    if (!(active && containerRef.current)) return;

    // When active changes, scroll container to active item
    const scrollItem = scrollItems.current[active];
    if (!scrollItem) return;

    const container = containerRef.current;
    const itemRect = scrollItem.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const absoluteOffset = container.scrollLeft + itemRect.left;

    // Math 🤓
    const centerOffset =
      scrollItem.offsetLeft -
      container.clientWidth / 2 +
      scrollItem.clientWidth / 2;

    const offset =
      absoluteOffset <= containerRect.width
        ? scrollItem.offsetLeft - 128
        : centerOffset - 64;

    container.scrollTo({
      behavior: "smooth",
      left: offset,
    });
  }, [active]);

  return [containerRef, _scrollItems];
}

export { useScrollBarState };
