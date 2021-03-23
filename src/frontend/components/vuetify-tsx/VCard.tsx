import { Stringified } from 'type-fest';
import * as tsx from 'vue-tsx-support';
import { VCard } from 'vuetify/lib';
import { Colorable, Sizeable, Themeable } from './types';

type Elevation = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;

type Props = Colorable & Themeable & Sizeable & {
    /**
     * Configure the active CSS class applied when the link is active
     * @see https://router.vuejs.org/api/#active-class
     */
    activeClass?: string;

    /**
     * Setting append prop always appends the relative path to the current path
     * @see https://router.vuejs.org/api/#append
     */
    append?: boolean;

    /**
     * Removes the ability to click or target the component
     */
    disabled?: boolean;

    /**
     * Designates an elevation applied to the component between 0 and 24
     * @see https://vuetifyjs.com/styles/elevation
     */
    elevation?: Elevation | Stringified<Elevation>;

    /**
     * Exactly match the link. Without this, ‘/’ will match every route
     * @see https://router.vuejs.org/api/#exact
     */
    exact?: boolean;

    /**
     * Configure the active CSS class applied when the link is active with exact match
     * @see https://router.vuejs.org/api/#exact-active-class
     */
    exactActiveClass?: string;

    /**
     * Removes the card's elevation
     */
    flat?: boolean;

    /**
     * Will apply an elevation of 4dp when hovered
     * @see https://vuetifyjs.com/styles/elevation
     */
    hover?: boolean;

    /**
     * Designates the component as anchor and applies the href attribute
     */
    href?: string | Object;

    /**
     * Specifies an image background for the card
     */
    img?: string;

    /**
     * Designates that the component is a link
     * This is automatic when using the href or to prop.
     */
    link?: boolean;

    /**
     * Specifies the height of the loader
     */
    loaderHeight?: number | string;

    /**
     * Displays linear progress bar
     * Can either be a String which specifies which color is applied to the progress bar (any material color or theme color),
     * or a Boolean which uses the component color (set by color prop)
     */
    loading?: boolean | string;

    /**
     * Specifies the link is a nuxt-link
     */
    nuxt?: boolean;

    /**
     * Removes elevation (box-shadow) and adds a thin border
     */
    outlined?: boolean;

    /**
     * Specifies a higher default elevation (8dp)
     * @see https://vuetifyjs.com/styles/elevation
     */
    raised?: boolean;

    /**
     * Setting replace prop will call router.replace() instead of router.push() when clicked, so the navigation will not leave a history record
     * @see https://router.vuejs.org/api/#replace
     */
    replace?: boolean;

    /**
     * Applies the v-ripple directive
     * @see https://vuetifyjs.com/directives/ripple
     */
    ripple?: boolean | Object;

    /**
     * Designates the border-radius applied to the component
     * @see https://vuetifyjs.com/styles/border-radius
     */
    rounded?: boolean | string;

    /**
     * Applies a large border radius on the top left and bottom right of the card
     */
    shaped?: boolean;

    /**
     * Specify a custom tag used on the root element
     */
    tag?: string;

    /**
     * Designates the target attribute
     * This should only be applied when using the href prop
     */
    target?: string;

    /**
     * Removes the component's border-radius
     */
    tile?: boolean;

    /**
     * Denotes the target route of the link
     * @see https://router.vuejs.org/api/#to
     */
    to?: string | Object;
};

type Events = {
    onClick: void;
};

export default tsx.ofType<Props, Events>().convert(VCard);
