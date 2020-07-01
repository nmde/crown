import { component } from 'vue-tsx-support';
import { VNode } from 'vue';
import HelloWorld from '../components/HelloWorld';

export default component({
  render(): VNode {
    return (
      <div class="home">
        <HelloWorld message="Welcome to Your Vue.js App" />
      </div>
    );
  },
});
