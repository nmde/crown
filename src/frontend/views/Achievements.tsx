/**
 * @file Achievements page.
 */
import { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { IUser } from '../../types';
import ViewComponent from '../classes/ViewComponent';
import store from '../store';
import fab from '../styles/fab';
import makeStyles from '../styles/makeStyles';

const styles = makeStyles({});

@Component
/**
 * The achievement list page.
 */
export default class Achievements extends ViewComponent<typeof styles> {
  /**
   * Constructs Achievements.
   */
  public constructor() {
    super(styles);
  }

  /**
   * Created lifecycle hook.
   */
  public async created(): Promise<void> {
    await this.fetchData();
  }

  /**
   * Fetches the user data from the backend.
   */
  @Watch('$route', {
    deep: true,
    immediate: true,
  })
  private async fetchData() {
    const user = await this.getUser();
    console.log(user);
  }

  /**
   * Renders the component.
   *
   * @returns {VNode} The component.
   */
  public render(): VNode {
    return (
      <div>
        <h1>Achievements</h1>
      </div>
    );
  }
}
