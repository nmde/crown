import CSS from 'csstype';

type Styles = Record<string, CSS.Properties>;

/**
 * Adds typing to CSS styles
 *
 * @param {Styles} styles the styles
 * @returns {Styles} the styles with correct typing
 */
export default function makeStyles(styles: Styles): Styles {
  return styles;
}
