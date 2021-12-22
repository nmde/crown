import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import Styled from 'vue-styled-component';

const styles = Styled.makeStyles({});

@Component
/**
 * @class Messaging
 * @classdesc Instant messaging pop up box.
 */
export default class Messaging extends Styled<typeof styles> {
  /**
   * Constructs Messaging.
   *
   * @constructs
   */
  public constructor() {
    super(styles);
  }

  /**
   * Renders the component.
   *
   * @returns {VNode} The component.
   */
  public render(): VNode {
    return (
      <v-card>
        <v-card-header>
          <v-toolbar color="primary">
            <v-toolbar-title></v-toolbar-title>
          </v-toolbar>
        </v-card-header>
      </v-card>
    );
  }
}
