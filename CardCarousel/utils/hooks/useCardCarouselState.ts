// React
import React, { useRef, useState, useEffect, useCallback } from "react";

// Functions
import { calculateCardProximity } from "../functions/helperFunctions";

// Mantine
import { useMediaQuery } from "@mantine/hooks";

// Types
export type CardDataStruct = HTMLDivElement & {
  styles: React.CSSProperties;
  proximity: number;
  active: boolean;
  offset: number;
  cardX: number;
  past: boolean;
  width: number;
  key: string;
};

export type CardStyles = React.CSSProperties & {};
type CardsDataStore = React.MutableRefObject<
  Record<string | number, CardDataStruct>
>;

export type ReturnedCardProps = {
  ref: (instance: HTMLDivElement) => void; // A function that registers a ref to the cardsStore
  children?: React.ReactNode; // The children of the card
  cardData: CardDataStruct; // The data for the card
  key: number | string; // The key of the card within the cards array
};

type CardCarouselState = [
  refs: {
    containerRef: React.RefObject<HTMLDivElement>;
    sidebarRef: React.RefObject<HTMLDivElement>;
  },
  state: {
    scrollMarginLeft: number | null;
    activeCardKey: string | null;
    scrollPosition: number;
  },
  functions: {
    getCardByKey: (key: string) => CardDataStruct;
    goToCard: (key: string) => void;
    getActiveCard: () => void;
  },
  _cards: Array<ReturnedCardProps>,
  ready: boolean
];

// It might be time for a reducer...
export default function useCardCarouselState(
  cards: Array<any>
): CardCarouselState {
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [_scrollMarginLeft, setScrollMarginLeft] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [activeCardKey, setActiveCardKey] = useState<string | null>(null);
  const [initComplete, setInitComplete] = useState(false);

  const isMobile = useMediaQuery("(max-width: 80rem)");
  const scrollMarginLeft = isMobile ? 0 : Number(_scrollMarginLeft.toFixed(2));

  const cardsDataStore: CardsDataStore = useRef({});

  const controller = new AbortController();
  const listenerProps = {
    signal: controller.signal,
    passive: true,
  };

  const handleContainerResize = useCallback(() => {
    if (!(sidebarRef?.current && containerRef?.current)) return;

    // Get the x position of the right side of sidebar within the container
    const sidebarRect = sidebarRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Notify the carousel that initial calculations are complete
    // Allowing the carousel to transition from fallback styles to calculated styles
    // NOTE: Does this interfere with the offset calc?
    if (!initComplete) setInitComplete(true);

    setScrollMarginLeft(sidebarRect.right - containerRect.left + 128);
  }, [initComplete]);

  const handleContainerScroll = useCallback(() => {
    if (!containerRef?.current) return;
    const _scrollPosition = Number(containerRef.current.scrollLeft.toFixed());
    setScrollPosition(_scrollPosition);
  }, []);

  const getCardByKey = useCallback(
    (key: string) => cardsDataStore.current[key],
    [cardsDataStore]
  );

  const getActiveCard = useCallback(() => {
    return Object.values(cardsDataStore.current).find((card) => card.active);
  }, [cardsDataStore.current]);

  // The application state is derived from the scroll position within the container, not the other way around.
  // Unsure if this is an anti-pattern, but I trust the stability of built-in scroll functionality more than any React nonsense.
  const goToCard = useCallback(
    (key: string) => {
      if (!containerRef?.current) return;

      const container = containerRef.current;
      const card = getCardByKey(key);

      container.scrollTo({
        behavior: "smooth",
        left: card.offset,
      });
    },
    [cardsDataStore.current, containerRef]
  );

  // On mount
  useEffect(() => {
    if (!window) return;

    const container = containerRef.current;
    if (!container) return;

    let resizeTimeout: number | null = null;
    let scrollTimeout: number | null = null;

    const handleResize = () => {
      if (resizeTimeout) {
        cancelAnimationFrame(resizeTimeout);
      }
      resizeTimeout = requestAnimationFrame(handleContainerResize);
    };

    const handleScroll = () => {
      if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
      scrollTimeout = requestAnimationFrame(handleContainerScroll);
    };

    container.addEventListener("resize", handleResize, listenerProps);
    container.addEventListener("scroll", handleScroll, listenerProps);

    // Calculate initial values
    handleContainerResize();
    handleContainerScroll();

    return () => {
      controller.abort();
    };
  }, []);

  // Whenever the environment changes, iterate over each card and update its state
  useEffect(() => {
    calculateCardStates();
  }, [scrollPosition, scrollMarginLeft]);

  // NOTE: This function relies on pretty much all of the state and refs in the component.
  // Is it worth placing inside a useCallback? Maybe if I made this a pure function it would be better.
  async function calculateCardStates() {
    if (!containerRef?.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    const cards = Object.values(cardsDataStore.current);

    await Promise.all(
      cards.map(async (card) => {
        const { left, width } = card.getBoundingClientRect();

        card.cardX = left - containerRect.left;
        card.width = width;

        card.proximity = calculateCardProximity(card, scrollMarginLeft);

        // Immediately set the past state for mobile, no extra room to the left anyhow
        card.past = isMobile ? true : card.cardX - scrollMarginLeft < 0;

        card.active = card.proximity > 50;

        if (card.active) setActiveCardKey(card.key);

        // Get scroll offset
        card.offset = container.scrollLeft + left - scrollMarginLeft;
      })
    );

    // NOTE: Some sort of binary search algorithm could be used here to find the active card more efficiently.
    // Initial testing brings calculation time from 16ms to 1ms or less, but doesn't apply styles to the next few cards.
    // console.debug(
    //   "Time to calculate card states:",
    //   Number((performance.now() - start).toFixed(2)),
    //   "ms"
    // );
  }

  // This function returns a function that registers a ref to the cardsStore
  // Typings here aren't right, I am extending the wrong type I think
  function imperativeGetRef<T extends HTMLElement = HTMLDivElement>(
    key: string
  ) {
    return function (instance: T): void {
      if (!cardsDataStore?.current?.[key]) {
        if (typeof instance === "undefined") return;
        let newInstance = instance as unknown as CardDataStruct;

        newInstance.active = false;
        newInstance.proximity = 0;
        newInstance.key = key;
        newInstance.cardX = 0;

        cardsDataStore.current = {
          ...cardsDataStore.current,
          [key as string]: instance as any as CardDataStruct,
        };
      }
    };
  }

  // Collect refs
  const refs = {
    containerRef,
    sidebarRef,
  };

  // Collect state
  const state = {
    scrollMarginLeft,
    scrollPosition,
    activeCardKey,
  };

  // Collect functions
  const functions = {
    getActiveCard,
    getCardByKey,
    goToCard,
  };

  // Calculate card data - I'd memoize this but there aren't many cases where state changes and doesn't trigger a recalculation
  let _cards: Array<ReturnedCardProps> = cards.map((reactNode, index) => {
    let key = `card-${index}`;

    return {
      cardData: getCardByKey(key),
      ref: imperativeGetRef(key),
      children: reactNode,
      key,
    };
  });

  return [refs, state, functions, _cards, initComplete];
}

export { useCardCarouselState };
