import Vue, { ComponentOptions } from 'vue';

type ArgsObj<T> = {
  args: T;
};

/**
 * Quick util for adding type-checking to template args
 * Type T is the props types
 * @returns An the bound template, with Type-safe args
 */
export default function bind<T>(
  template: (args: any, { argTypes }: { argTypes: any }) => ComponentOptions<Vue>,
): ArgsObj<T> {
  return template.bind({}) as unknown as ArgsObj<T>;
}
