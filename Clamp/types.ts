import type { BoxComponentProps } from "@mantine/core";

export type ClampSize = ("full" | "nav" | "standard" | "small" | "text") & {};
export type ClampWidth = (string & {}) | (number & {});
export type Padding = ("left" | "right" | "both") & {};
export type ClampType = ("margin" | "padding") & {};

export type ClampProps = ComponentBaseProps &
  BoxComponentProps & {
    component?: React.ElementType<any, keyof JSX.IntrinsicElements>;
    width?: ClampWidth | ClampSize;
    margin?: string | number;
    simulated?: boolean;
    section?: boolean;
    padding?: Padding;
    type?: ClampType;
  } & {
    [key: string]: any;
  };

export type TransformedClampProps = ComponentBaseProps &
  BoxComponentProps & {
    component?: React.ElementType<any, keyof JSX.IntrinsicElements>;
    padding?: Omit<Padding, "both"> | "left,right";
    simulated?: boolean;
    type: ClampType;
    margin: string;
    width: string;
  };
