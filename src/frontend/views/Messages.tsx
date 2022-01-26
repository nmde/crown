/**
 * @file Messages view.
 */
import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import ViewComponent from '../classes/ViewComponent';
import Messaging from '../components/Messaging';
import store from '../store';
import makeStyles from '../styles/makeStyles';

const styles = makeStyles({});

@Component
/**
 * Messages view component.
 */
export default class Messages extends ViewComponent<typeof styles> {
  /**
   * Constructs Messages.
   */
  public constructor() {
    super(styles);
    // TODO: loading blocked when store.currentUser isn't set yet
    console.log(store.currentUser);
    console.log(this.$route.query);
  }

  /**
   * Renders the component.
   *
   * @returns {VNode} The component.
   */
  public render(): VNode {
    return <Messaging />;
  }
}
