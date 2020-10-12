import Vue, { ComponentOptions } from 'vue';
import '../bootstrap';

type Options = ComponentOptions<Vue>;

/**
 * Shortcut for creating Stories, avoiding some of the awful templating
 * @param template The TSX template for the story
 */
export default function createStory(render: Options['render']): () => Options {
  return () => ({
    render,
  });
}
