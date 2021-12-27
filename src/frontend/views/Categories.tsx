import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import categoryKey from '../../util/categoryKey';
import ViewComponent from '../classes/ViewComponent';
import categories from '../data/categories.json';
import makeStyles from '../styles/makeStyles';

const styles = makeStyles({});

@Component
/**
 * Categories page
 */
export default class Categories extends ViewComponent<typeof styles> {
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
      <div>
        {(() => categories.categories.map((category) => (
            <v-card to={`/c/${category.name}`}>
              <v-card-title>
                <v-icon>{category.icon}</v-icon>
                <p class="ml-3">{this.messages.categories[categoryKey(category.name)]}</p>
              </v-card-title>
            </v-card>
        )))()}
      </div>
    );
  }
}
