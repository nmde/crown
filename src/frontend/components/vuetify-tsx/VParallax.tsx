import * as tsx from 'vue-tsx-support';
import { VParallax } from 'vuetify/lib';

type Props = {
  /**
   * Attaches an alt property to the parallax image
   */
  alt?: string;

  /**
   * Sets the height for the component
   */
  height?: string | number;

  /**
   * The image to parallax
   */
  src?: string;

  /**
   * A set of alternate images to use based on device size
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset
   */
  srcset?: string;
};

export default tsx.ofType<Props>().convert(VParallax);
