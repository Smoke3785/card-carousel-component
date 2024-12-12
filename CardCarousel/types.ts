export type ScrollBarProps = ComponentBaseProps & {
  goToCard: (key: string) => void;
  active: string | null;
  keys: Array<string>;
};

export type CardCarouselProps = ComponentBaseProps & {
  initialIndex?: number;
  cards: Array<any>;
};
