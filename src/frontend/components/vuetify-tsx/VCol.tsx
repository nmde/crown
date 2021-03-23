import { Stringified } from 'type-fest';
import * as tsx from 'vue-tsx-support';
import { VCol } from 'vuetify/lib';
import { Align, Taggable } from './types';

type ColCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type Cols = boolean | 'auto' | ColCount | Stringified<ColCount>;
type Order = 'inherit' | 'initial' | 'unset' | number;

type Props = Taggable & {
  /**
   * Applies the align-items css property
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/align-items
   */
  alignSelf?: Align | 'auto';

  /**
   * Sets the default number of columns the component extends
   */
  cols?: Cols;
  /**
   * Changes the number of columns on large and greater breakpoints
   */
  lg?: Cols;

  /**
   * Changes the number of columns on medium and greater breakpoints
   */
  md?: Cols;

  /**
   * Sets the default offset for the column
   */
  offset?: string | number;

  /**
   * Changes the offset of the component on large and greater breakpoints
   */
  offsetLg?: string | number;

  /**
   * Changes the offset of the component on medium and greater breakpoints
   */
  offsetMd?: string | number;

  /**
   * Changes the offset of the component on small and greater breakpoints
   */
  offsetSm?: string | number;

  /**
   * Changes the offset of the component on extra large and greater breakpoints
   */
  offsetXl?: string | number;

  /**
   * Sets the default order for the column
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/order
   */
  order?: Order;

  /**
   * Changes the order of the component on large and greater breakpoints
   */
  orderLg?: Order;

  /**
   * Changes the order of the component on medium and greater breakpoints
   */
  orderMd?: Order;

  /**
   * Changes the order of the component on small and greater breakpoints
   */
  orderSm?: Order;

  /**
   * Changes the order of the component on extra large and greater breakpoints
   */
  orderXl?: Order;

  /**
   * Changes the number of columns on small and greater breakpoints
   */
  sm?: Cols;

  /**
   * Changes the number of columns on extra large and greater breakpoints
   */
  xl?: Cols;
};

export default tsx.ofType<Props>().convert(VCol);
