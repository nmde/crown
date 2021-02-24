import moment from 'moment';

/**
 * Utility to consistently format dates across the app
 * @param original The original, unformatted date
 * @returns The formatted date
 */
export default function formatDate(original: string): string {
    return moment(original).format('MMM Do, h:mm a');
}
