// Styles
import clsx from "clsx";

// Components
import { Clamp as TransformedClamp } from "../../index";

// Types
import type { ClampProps } from "../../types";
import type { SectionProps } from "./types";

const Section = ({
  fullWidth,
  literal,
  className,
  ...props
}: ClampProps & SectionProps) => {
  if (literal) {
    return (
      <section className={clsx(className, "iliad-Section-root")} {...props} />
    );
  }

  if (fullWidth) {
    return (
      <TransformedClamp
        className={clsx(className, "iliad-Section-root")}
        width="100%"
        margin={0}
        w="100%"
        m={0}
        // Spread props after init
        {...props}
        section
      />
    );
  }

  return (
    <TransformedClamp
      className={clsx(className, "iliad-Section-root")}
      {...props}
      section
    />
  );
};

export default Section;
export { Section };
