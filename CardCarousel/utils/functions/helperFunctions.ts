"use client";

// Types
import type { CardDataStruct, CardStyles } from "../hooks/useCardCarouselState";

type IntermediateCard = {
  cardX: number;
  width: number;
};

export function calculateCardProximity(
  card: IntermediateCard,
  scrollMarginLeft: number
): number {
  let { cardX, width } = card;

  const distance = Math.mapRange(
    Math.clamp(0, Math.abs(cardX - scrollMarginLeft), width),
    0,
    width,
    0,
    100
  );

  // Thanks to Carmine for reminding me about basic math
  return 100 - Math.round(distance);
}

export function getCardStyles(card: Partial<CardDataStruct>): CardStyles {
  if (!card) return {};

  const { proximity = 0, past } = card;

  const scale = Math.min(Math.mapRange(proximity + 20, 0, 100, 0.9, 1), 1);
  const opacity = Math.max(0.3, past ? proximity / 100 : 1);
  const transformOrigin = !past ? "right" : "left";

  return {
    transform: `scale(${scale})`,
    opacity: `${opacity}`,
    transformOrigin,
  };
}

export function getCarouselStyles({ scrollMarginLeft }): CardStyles {
  if (scrollMarginLeft === null) return {};

  return {
    "--scrollMarginLeft": `${scrollMarginLeft}px`,
  } as CardStyles;
}
