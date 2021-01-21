import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class Home extends Vue {
  // eslint-disable-next-line class-methods-use-this
  public render(): VNode {
    return <div>home</div>;
  }
}
