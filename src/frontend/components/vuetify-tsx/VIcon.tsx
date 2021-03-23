import * as tsx from 'vue-tsx-support';
import { VIcon } from 'vuetify/lib';
import { Colorable, Themeable } from './types';

type Props = Colorable & Themeable & {
    /**
     * Makes the icon smaller
     */
    dense?: boolean;

    /**
     * Disable the input
     */
    disabled?: boolean;

    /**
     * Makes the component large
     */
    large?: boolean;

    /**
     * Applies appropriate margins to the icon inside of a button when placed to the left of another element or text
     */
    left?: boolean;

    /**
     * Applies appropriate margins to the icon inside of a button when placed to the right of another element or text
     */
    right?: boolean;

    /**
     * Specifies a custom font size for the icon
     */
    size?: number | string;

    /**
     * Makes the component small
     */
    small?: boolean;

    /**
     * Specifies a custom tag to be used
     */
    tag?: string;

    /**
     * Makes the component extra large
     */
    xLarge?: boolean;

    /**
     * Makes the component extra small
     */
    xSmall?: boolean;
};

export default tsx.ofType<Props>().convert(VIcon);
