export type Align = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
export type Justify = 'start' | 'center' | 'end' | 'space-between' | 'space-around';

export type Colorable = {
  /**
   * Applies specified color to the control - it can be the name of material color or css color
   * @see https://vuetifyjs.com/styles/colors#material-colors
   */
  color?: string;
};

export type Sizeable = {
  /**
   * Sets the height for the component
   */
  height?: number | string;

  /**
   * Sets the maximum height for the component
   */
  maxHeight?: number | string;

  /**
   * Sets the maximum width for the component
   */
  maxWidth?: number | string;

  /**
   * Sets the minimum height for the component
   */
  minHeight?: number | string;

  /**
   * Sets the minimum width for the component
   */
  minWidth?: number | string;

  /**
   * Sets the width for the component
   */
  width?: number | string;
};

export type Taggable = {
  /**
   * Specify a custom tag used on the root element
   * @default div
   */
  tag?: string;
};

export type Themeable = {
  /**
   * Applies the dark theme variant to the component
   * @see https://material.io/design/color/dark-theme.html
   */
  dark?: boolean;

  /**
   * Applies the light theme variant to the component
   */
  light?: boolean;
};
