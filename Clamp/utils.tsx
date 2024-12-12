// Styles
import styles from "./clamp.module.scss";
import clsx from "clsx";

// Types
import type {
  TransformedClampProps,
  ClampProps,
  ClampWidth,
  ClampSize,
} from "./types";

export function normalizeNumberInput(n: ClampWidth): string {
  const isNumber = !isNaN(n as number) || typeof n === "number";

  // Second clause is logically unnecessary, but satisfies TypeScript
  return isNumber ? `${n}px` : n;
}

export function normalizeWidth(width: ClampWidth | ClampSize): string {
  const sizes = {
    small: "var(--clamp-small-width)",
    standard: "var(--standard-width)",
    full: "var(--clamp-full-width)",
    text: "var(--clamp-text-width)",
    nav: "var(--nav-width)",
  };

  if (Object.keys(sizes).includes(width as string)) {
    return sizes[width as ClampSize];
  }

  return normalizeNumberInput(width as ClampWidth);
}

export function transformClampProps(Component: any) {
  return function Clamp({
    margin = `var(--normalized-margin)`,
    width = `var(--normalized-width)`,
    simulated = false,
    padding = "both",
    type = "margin",
    className,
    section,
    ...props
  }: ClampProps) {
    margin = normalizeNumberInput(margin);
    width = normalizeWidth(width);

    const _padding = padding === "both" ? "left,right" : padding;

    if (type === "padding") {
      props["data-local-padding"] = _padding;
    }

    // Add standard classes
    const classNames = [className, "iliad-Clamp-root"];

    if (simulated) {
      classNames.push("iliad-Clamp-simulated", styles.simulated);
    }

    className = clsx(classNames);

    const transformedProps: TransformedClampProps = {
      padding: _padding,
      className,
      margin,
      width,
      type,
      ...props,
    };

    if (section && !props["component"]) {
      transformedProps.component = "section";
    }

    Component.displayName = "Clamp";

    return <Component {...transformedProps} />;
  };
}
