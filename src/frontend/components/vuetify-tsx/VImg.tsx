import * as tsx from 'vue-tsx-support';
import { VImg } from 'vuetify/lib';
import { Sizeable, Themeable } from './types';

type Props = Themeable &
  Sizeable & {
    /**
     * Alternate text for screen readers
     * Leave empty for decorative images.
     */
    alt?: string;

    /**
     * Calculated as width/height, so for a 1920x1080px image this will be 1.7778
     * Will be calculated automatically if omitted.
     */
    aspectRatio?: string | number;

    /**
     * Prevents the image from being cropped if it doesn’t fit
     */
    contain?: boolean;

    /**
     * Apply a custom class to the responsive content div
     */
    contentClass?: string;

    /**
     * Will force the components content to render on mounted
     * This is useful if you have content that will not be rendered in the DOM that you want crawled for SEO.
     */
    eager?: boolean;

    /**
     * Overlays a gradient onto the image
     * Only supports linear-gradient syntax, anything else should be done with classes
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient
     */
    gradient?: string;

    /**
     * Something to show while waiting for the main image to load, typically a small base64-encoded thumbnail
     */
    lazySrc?: string;

    /**
     * Options that are passed to the Intersection observer constructor
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
     */
    options?: IntersectionObserverInit;

    /**
     * Overrides the default to change which parts get cropped off
     * Uses the same syntax as background-position.
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/background-position
     */
    position?: string;

    /**
     * For use with srcset
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes
     */
    sizes?: string;

    /**
     * The image URL
     */
    src: string | Object;

    /**
     * A set of alternate images to use based on device size
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset
     */
    srcset?: string;

    /**
     * The transition to use when switching from lazy-src to src
     */
    transition?: boolean | string;
  };

type Events = {
  onError: object | string;
  onLoad: object | string;
};

export default tsx.ofType<Props, Events>().convert(VImg);
