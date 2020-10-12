/* eslint-disable import/no-extraneous-dependencies */
import {
  withKnobs, boolean, number, text,
} from '@storybook/addon-knobs';
import Chart from '.';
import createStory from '../createStory';

export default {
  title: 'components/Chart',
  Component: Chart,
  decorators: [withKnobs],
  argTypes: { onClick: { action: 'clicked' } },
} as StoryMeta<Chart>;

export const barChart = createStory((h) => (
  <Chart
    type="bar"
    labels={['January', 'February', 'March']}
    datasets={[
      {
        label: 'Label',
        backgroundColor: '#f87979',
        data: [40, 20, 25],
      },
    ]}
    responsive={boolean('Responsive', true)}
    responsiveAnimationDuration={number('Responsive Animation Duration', 1000)}
    aspectRatio={number('Aspect Ratio', 0.5)}
    maintainAspectRatio={boolean('Maintain Aspect Ratio', true)}
    title={{
      text: text('Title', 'Title'),
    }}
    animation={{
      duration: number('Animation Duration', 3000),
    }}
    layout={{
      padding: number('Padding', 0),
    }}
    showLines={boolean('Show Lines', true)}
    spanGaps={boolean('Span Gaps', false)}
    cutoutPercentage={number('Cutout Percentage', 0)}
    circumference={number('Circumference', 3.14)}
    rotation={number('Rotation', 0)}
  />
));
