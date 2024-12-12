// Styles
import styles from "./clamp.module.scss";
import { clsx } from "clsx";

// Components / Sub-components
import Section from "./components/Section";

// Utils
import { transformClampProps } from "./utils";

// Mantine
import { Box } from "@mantine/core";

// Types
import type { TransformedClampProps } from "./types";

function Clamp({
  component,
  className,
  children,
  padding,
  margin,
  width,
  type,
  ...props
}: TransformedClampProps) {
  return (
    <Box
      className={clsx(styles.mainContainer, className)}
      data-local-type={type}
      component={"section"}
      style={{
        "--m": margin,
        "--w": width,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

const TransformedClamp = transformClampProps(Clamp);
export { TransformedClamp as Clamp, Section };
export default TransformedClamp;
