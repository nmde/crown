import { component } from 'vue-tsx-support';
import { VNode } from 'vue';

/**
 * The main app component - Contains all global logic & UI
 */
export default component({
  render(): VNode {
    return (
      <div>
        <h1>App</h1>
      </div>
    );
  },
});
