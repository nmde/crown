import CSS from 'csstype';

export type Styles<T extends string> = Record<T, CSS.Properties>;

/**
 * Adds typing to CSS styles
 *
 * @param {Styles} styles the styles
 * @returns {Styles} the styles with correct typing
 */
export default function makeStyles<T extends string>(
  styles: Record<T, CSS.Properties>,
): Record<T, CSS.Properties> {
  return styles;
}
