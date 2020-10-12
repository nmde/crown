/* eslint-disable import/no-extraneous-dependencies */
import { BaseMeta } from '@storybook/addons';

/**
 * Global type definitions for the project
 */
declare global {
  /**
   * Defines meta info for the default export of Storybook files
   */
  type StoryMeta<Component> = BaseMeta<Component>;
}
