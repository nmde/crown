import CSS from 'csstype';
import Vue from 'vue';

/**
 * Utility class for applying custom CSS to components with strict typing
 */
export default class Styled<T extends string> extends Vue {
  private css: Record<T, CSS.Properties>;

  public get style(): Record<T, CSS.Properties> {
    return this.css;
  }

  public constructor(css: Record<T, CSS.Properties>) {
    super();
    this.css = css;
  }

  public c(className: T): string {
    return this.f(className);
  }
}
