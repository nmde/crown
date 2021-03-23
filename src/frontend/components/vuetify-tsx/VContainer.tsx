import * as tsx from 'vue-tsx-support';
import { VContainer } from 'vuetify/lib';
import { Taggable } from './types';

type Props = Taggable & {
  /**
   * Removes viewport maximum-width size breakpoints
   */
  fluid?: boolean;

  /**
   * Sets the DOM id on the component
   */
  id?: string;
};

export default tsx.ofType<Props>().convert(VContainer);
