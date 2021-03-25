import * as tsx from 'vue-tsx-support';
import { VProgressLinear } from 'vuetify/lib';
import { Colorable, Themeable } from './types';

type Props = Colorable & Themeable & {
    /**
     * Applies position: absolute to the component
     */
    absolute?: boolean;

    /**
     * Reduces the height to 0, hiding component
     */
    active?: boolean;

    /**
     * Background color, set to component's color if null
     */
    backgroundColor?: string;

    /**
     * Background opacity
     * If null, it defaults to 0.3 if the background color is not specified or 1 otherwise
     */
    backgroundOpacity?: number | string;

    /**
     * Aligns the component towards the bottom
     */
    bottom?: boolean;

    /**
     * The percentage value for the buffer
     */
    bufferValue?: number | string;

    /**
     * Applies position: fixed to the component
     */
    fixed?: boolean;

    /**
     * Set the height for the component
     */
    height?: number | string;

    /**
     * Constantly animates, use when loading progress is unknown
     */
    indeterminate?: boolean;

    /**
     * Animates like indeterminate, but inverse
     */
    query?: boolean;

    /**
     * Displays reversed progress
     */
    reverse?: boolean;

    /**
     * Adds a border radius to the progress component
     */
    rounded?: boolean;

    /**
     * An alternative style for portraying loading that works in tandem with buffer-value
     */
    stream?: boolean;

    /**
     * Adds a stripe background to the filled portion of the progress component
     */
    striped?: boolean;

    /**
     * Aligns the component towards the top
     */
    top?: boolean;

    /**
     * The percentage value for current progress
     */
    value?: number | string;
};

export default tsx.ofType<Props>().convert(VProgressLinear);
