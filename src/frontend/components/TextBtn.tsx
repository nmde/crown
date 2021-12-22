import { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import Styled from 'vue-styled-component';
import * as tsx from 'vue-tsx-support';

const styles = Styled.makeStyles({
  button: {
    textTransform: 'initial',
  },
});

export type Props = {
  text: string;
};

@Component
/**
 * A "button" displaying primarily text
 */
export default class TextBtn extends Styled<typeof styles> implements Props {
  /** the button text */
  @Prop()
  public text!: string;

  /** passes type information to TSX */
  public _tsx!: tsx.DeclareProps<Props> & tsx.DeclareOnEvents<{ onClick: unknown }>;

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
      <v-btn
        block
        class={this.className('button')}
        color="primary"
        elevation={0}
        plain
        onClick={() => {
          this.$emit('click');
        }}
      >
        {this.text}
      </v-btn>
    );
  }
}
