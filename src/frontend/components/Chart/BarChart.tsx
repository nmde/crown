import { ChartData, ChartOptions } from 'chart.js';
import { Bar } from 'vue-chartjs';
import { Component, Prop, Mixins } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

/**
 * A Chart.js bar chart
 */
@Component({})
export default class BarChart extends Mixins(Bar) {
  public _tsx!: tsx.DeclareProps<tsx.PickProps<BarChart, 'chart' | 'options'>>;

  /**
   * The chart data
   * @see https://www.chartjs.org/docs/latest/getting-started/usage.html
   */
  @Prop()
  public chart!: ChartData;

  /**
   * Additional options for the chart, as an object
   * @see https://www.chartjs.org/docs/latest/general/options.html
   */
  @Prop()
  public options?: ChartOptions;

  /**
   * Vue mounted lifecycle hook
   */
  public mounted(): void {
    // "undefined" keys being in the options object caused all sorts of errors for some reason
    // So this just goes through each entry in options and deletes it if it's empty
    const { options } = this;
    if (options !== undefined) {
      (Object.keys(options) as (keyof ChartOptions)[]).forEach((key) => {
        if (options[key] === undefined) {
          delete options[key];
        }
      });
    }
    this.renderChart(this.chart, options);
  }
}
