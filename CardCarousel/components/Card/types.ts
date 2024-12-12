import type { CardDataStruct } from "../../utils/hooks/useCardCarouselState";

export type CardProps = ComponentBaseProps & {
  card: CardDataStruct;
  [key: string]: any;
};
