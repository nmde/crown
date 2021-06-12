import CSS from 'csstype';
import { render } from 'fela-dom';
import Vue from 'vue';
import { Styles } from '../styles/makeStyles';
import renderer from '../styles/renderer';

/**
 * Utility class for applying custom CSS to components with strict typing
 * Type parameter T is a type containing the names of all classes the component uses
 */
export default class Styled<T extends Styles<string>> extends Vue {
  /**
   * Stores the associations between T and compiled class names
   */
  private classes: Record<string, string> = {};

  /**
   * @constructs
   * @param {Styles} css The custom component styles
   */
  public constructor(css: Record<keyof T, CSS.Properties>) {
    super();
    // Create style rules
    Object.keys(css).forEach((key) => {
      this.classes[key] = renderer.renderRule((props) => props, css[key]);
    });
    // Render to DOM
    render(renderer);
  }

  /**
   * Retrieves the compiled CSS class name corresponding to a class name defined in T
   *
   * @param {string} name The class name as defined in T
   * @returns {string} The compiled class name
   */
  protected className(name: keyof T): string {
    return this.classes[name as string];
  }
}
