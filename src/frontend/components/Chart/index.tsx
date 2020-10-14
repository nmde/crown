import ChartJS, {
  ChartAnimationOptions,
  ChartElementsOptions,
  ChartHoverOptions,
  ChartLayoutOptions,
  ChartLegendOptions,
  ChartPluginsOptions,
  ChartScales,
  ChartSize,
  ChartTitleOptions,
  ChartTooltipOptions,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  ChartData,
  ChartDataSets,
} from 'chart.js';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
// TODO add to node_modules
//import { VCard } from '../../../../../vuetify-tsx/lib';
import BarChart from './BarChart';

type Events = {
  onHover: {
    chart: ChartJS;
    event: MouseEvent;
    activeElements: Array<{}>;
  };
  onClick: {
    event: MouseEvent;
    activeElements: Array<{}>;
  };
  onResize: {
    chart: ChartJS;
    newSize: ChartSize;
  };
};

/**
 * A Chart.js component with multiple chart types & custom styles
 */
@Component({})
export default class Chart extends Vue {
  public _tsx!: tsx.DeclareProps<tsx.AutoProps<Chart>> & tsx.DeclareOnEvents<Events>;

  // Most of these props are from Chart.js's "options" object
  // See https://www.chartjs.org/docs/latest/general/options.html for docs & examples

  @Prop()
  public responsive?: boolean;

  @Prop()
  public responsiveAnimationDuration?: number;

  @Prop()
  public aspectRatio?: number;

  @Prop()
  public maintainAspectRatio?: boolean;

  @Prop()
  public events?: string[];

  @Prop()
  public legendCallback?: (chart: ChartJS) => string;

  @Prop()
  public title?: ChartTitleOptions;

  @Prop()
  public legend?: ChartLegendOptions;

  @Prop()
  public tooltips?: ChartTooltipOptions;

  @Prop()
  public hover?: ChartHoverOptions;

  @Prop()
  public animation?: ChartAnimationOptions;

  @Prop()
  public elements?: ChartElementsOptions;

  @Prop()
  public layout?: ChartLayoutOptions;

  @Prop()
  public scale?: RadialLinearScale;

  @Prop()
  public scales?: ChartScales | LinearScale | LogarithmicScale | TimeScale;

  @Prop()
  public showLines?: boolean;

  @Prop()
  public spanGaps?: boolean;

  @Prop()
  public cutoutPercentage?: number;

  @Prop()
  public circumference?: number;

  @Prop()
  public rotation?: number;

  @Prop()
  public devicePixelRatio?: number;

  @Prop()
  public plugins?: ChartPluginsOptions;

  /**
   * An array of dataset labels
   * @see https://www.chartjs.org/docs/latest/getting-started/usage.html
   */
  @Prop()
  public labels?: ChartData['labels'];

  /**
   * The datasets (required)
   * @see https://www.chartjs.org/docs/latest/getting-started/usage.html
   */
  @Prop()
  public datasets!: ChartDataSets[];

  /**
   * Specifies which type of chart to render
   * Right now, "bar" is the only implemented option
   */
  @Prop()
  public type!: 'bar';

  public render(): VNode {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const chart = this;
    return (
      //<VCard maxWidth="100%">
        <BarChart
          chart={{
            labels: this.labels,
            datasets: this.datasets,
          }}
          options={{
            responsive: this.responsive,
            responsiveAnimationDuration: this.responsiveAnimationDuration,
            aspectRatio: this.aspectRatio,
            maintainAspectRatio: this.maintainAspectRatio,
            events: this.events,
            legendCallback: this.legendCallback,
            title: this.title,
            legend: this.legend,
            tooltips: this.tooltips,
            hover: this.hover,
            animation: this.animation,
            elements: this.elements,
            layout: this.layout,
            scale: this.scale,
            scales: this.scales,
            showLines: this.showLines,
            spanGaps: this.spanGaps,
            cutoutPercentage: this.cutoutPercentage,
            circumference: this.circumference,
            rotation: this.rotation,
            devicePixelRatio: this.devicePixelRatio,
            plugins: this.plugins,
            onHover(event, activeElements) {
              chart.$emit('hover', {
                chart: this,
                event,
                activeElements,
              });
            },
            onClick(event, activeElements) {
              chart.$emit('click', {
                event,
                activeElements,
              });
            },
            onResize(newSize) {
              chart.$emit('resize', {
                chart: this,
                newSize,
              });
            },
          }}
        />
      //</VCard>
    );
  }
}
