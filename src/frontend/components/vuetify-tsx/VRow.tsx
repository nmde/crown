import * as tsx from 'vue-tsx-support';
import { VRow } from 'vuetify/lib';
import { Align, Justify, Taggable } from './types';

type Props = Taggable & {
  /**
   * Applies the align-items css property
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/align-items
   */
  align?: Align;

  /**
   * Applies the align-content css property
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/align-content
   */
  alignContent?: Align;

  /**
   * Changes the align-content property on large and greater breakpoints
   */
  alignContentLg?: Align;

  /**
   * Changes the align-content property on medium and greater breakpoints
   */
  alignContentMd?: Align;

  /**
   * Changes the align-content property on small and greater breakpoints
   */
  alignContentSm?: Align;

  /**
   * Changes the align-content property on extra large and greater breakpoints
   */
  alignContentXl?: Align;

  /**
   * Changes the align-items property on large and greater breakpoints
   */
  alignLg?: Align;

  /**
   * Changes the align-items property on medium and greater breakpoints
   */
  alignMd?: Align;

  /**
   * Changes the align-items property on small and greater breakpoints
   */
  alignSm?: Align;

  /**
   * Changes the align-items property on extra large and greater breakpoints
   */
  alignXl?: Align;

  /**
   * Reduces the gutter betewen v-cols
   */
  dense?: boolean;

  /**
   * Applies the justify-content css property
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content
   */
  justify?: Justify;

  /**
   * Changes the justify-content property on large and greater breakpoints
   */
  justifyLg?: Justify;

  /**
   * Changes the justify-content property on medium and greater breakpoints
   */
  justifyMd?: Justify;

  /**
   * Changes the justify-content property on small and greater breakpoints
   */
  justifySm?: Justify;

  /**
   * Changes the justify-content property on extra large and greater breakpoints
   */
  justifyXl?: Justify;

  /**
   * Removes the gutter between v-cols
   */
  noGutters?: boolean;
};

export default tsx.ofType<Props>().convert(VRow);
