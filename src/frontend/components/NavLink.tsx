import { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import Styled from 'vue-styled-component';
import * as tsx from 'vue-tsx-support';

const styles = Styled.makeStyles({});

export type Props = {
  href: string;
  icon: string;
  text: string;
};

@Component
/**
 * Main navigation link
 */
export default class NavLink extends Styled<typeof styles> implements Props {
  @Prop()
  public href!: string;

  @Prop()
  public icon!: string;

  @Prop()
  public text!: string;

  public _tsx!: tsx.DeclareProps<Props>;

  /**
   * @constructs
   */
  public constructor() {
    super(styles);
  }

  /**
   * Renders the component
   *
   * @returns {VNode} the component
   */
  public render(): VNode {
    return (
      <v-list-item link to={this.href}>
        <v-list-item-icon>
          <v-icon>{this.icon}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{this.text}</v-list-item-title>
      </v-list-item>
    );
  }
}
