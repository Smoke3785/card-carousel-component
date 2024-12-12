"use client";

// Styles
import styles from "./card-carousel.module.scss";
import clsx from "clsx";

// Components
import { ScrollBar, Card } from "./components";
import Clamp from "@iliad/components/Clamp";
import { Box } from "@mantine/core";

// Hooks / Utils
import { getCarouselStyles } from "./utils/functions/helperFunctions";
import { useCardCarouselState } from "./utils/hooks";
import { useEffect, useMemo } from "react";

// Types
import type { CardCarouselProps } from "./types";

const CardCarousel = ({
  children: sideBarChildren,
  initialIndex = 0,
  cards,
  // Base props
  className,
  ...props
}: CardCarouselProps) => {
  const [refs, state, functions, _cards, ready] = useCardCarouselState(cards);

  // Destructure state
  const { scrollMarginLeft, activeCardKey } = state;
  const { containerRef, sidebarRef } = refs;
  const { goToCard } = functions;

  // Calculate styles from state + extract keys
  const keys = useMemo(() => _cards.map(({ key }) => `${key}`), [_cards]);
  const carouselStyles = useMemo(
    () => getCarouselStyles({ scrollMarginLeft }),
    [scrollMarginLeft]
  );

  useEffect(() => {
    goToCard(keys[initialIndex]);
  }, [initialIndex]);

  return (
    <Box className={clsx(className, styles.responsive)} {...props}>
      <Clamp
        className={clsx(styles.mobileHeader, styles.mobileOnly)}
        width={1920}
      >
        {sideBarChildren}
      </Clamp>
      <Clamp
        className={clsx("noScrollBar", styles.mainContainer)}
        data-ready={ready.toString()}
        style={carouselStyles}
        ref={containerRef}
        width={1920}
        margin={0}
      >
        <div ref={sidebarRef} className={styles.sideBar}>
          <div className={styles.sideBarContent}>
            {sideBarChildren}
            <ScrollBar
              className={styles.scrollBarContainer}
              active={activeCardKey}
              goToCard={goToCard}
              keys={keys}
            />
          </div>
        </div>
        <div className={clsx(styles.scrollContainer)}>
          {_cards.map(({ key, ref, children, cardData }) => (
            <Card
              className={styles.card}
              card={{ ...cardData }}
              goToCard={goToCard}
              key={key}
              ref={ref}
            >
              {children}
            </Card>
          ))}
        </div>
      </Clamp>
      <Clamp
        className={clsx(styles.mobileScrollBar, styles.mobileOnly)}
        width={1920}
      >
        <ScrollBar
          className={styles.scrollBarContainer}
          active={activeCardKey}
          goToCard={goToCard}
          keys={keys}
        />
      </Clamp>
    </Box>
  );
};

export default CardCarousel;
export { CardCarousel };
