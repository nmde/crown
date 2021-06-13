import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import t from '../translations/en-US.json';

@Component
/**
 * A common dialog for consistently displaying error messages
 */
export default class ErrorDialog extends Vue {
  /**
   * The dialog header
   */
  @Prop()
  public header!: string;

  /**
   * Details about the error
   */
  @Prop()
  public message!: string;

  /**
   * Visibility of the dialog
   */
  private open = false;

  public _tsx!: tsx.DeclareProps<tsx.AutoProps<ErrorDialog>>;

  /**
   * Automatically opens the dialog when the message changes
   */
  @Watch('message', {
    deep: true,
    immediate: true,
  })
  private toggleOpen(): void {
    if (this.message !== undefined && this.message.length > 0) {
      this.open = true;
    }
  }

  /**
   * Renders the component
   *
   * @returns {VNode} the error dialog
   */
  public render(): VNode {
    return (
      <v-dialog max-width={500} vModel={this.open}>
        <v-card>
          <v-card-title>{this.header}</v-card-title>
          <v-card-text>{this.message}</v-card-text>
          <v-card-actions>
            <v-btn
              block
              onClick={() => {
                this.open = false;
              }}
            >
              {t.btn.CLOSE}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    );
  }
}
