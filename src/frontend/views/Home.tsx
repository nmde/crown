/* eslint-disable class-methods-use-this */
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';

@Component
/**
 * The home page
 */
export default class Home extends Vue {
  /**
   * Renders the component
   *
   * @returns {VNode} the component
   */
  public render(): VNode {
    return <div>home</div>;
  }
}
