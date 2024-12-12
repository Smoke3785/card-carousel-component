"use client";

// Styles
import styles from "./card.module.scss";
import clsx from "clsx";

// Functions
import { getCardStyles } from "../../utils/functions/helperFunctions";

// Types
import type { CardProps } from "./types";

const Card = ({
  goToCard,
  card,
  ref,
  // Base Props
  className,
  children,
}: CardProps) => {
  const cardStyles = getCardStyles(card);

  return (
    <div ref={ref} className={clsx(styles.card, className)}>
      <div style={cardStyles} className={styles.cardContent}>
        {!card?.active && (
          <div
            className={styles.clickHandler}
            onClick={() => {
              goToCard(card.key);
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
};

export default Card;
export { Card };
