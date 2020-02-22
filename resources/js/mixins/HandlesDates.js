export default {
    methods: {
        /**
         * Human time.
         */
        humanTime(time) {
            return moment.duration(time, "seconds").humanize().replace(/^(.)|\s+(.)/g, function ($1) {
                return $1.toUpperCase();
            });
        },

        /**
         * Determine the time period.
         */
        determinePeriod(minutes) {
            return moment.duration(
                moment().diff(moment().subtract(minutes, "minutes"))
            ).humanize().replace(/^An?/i, '');
        },

        /**
         * Format the given date with respect to timezone.
         */
        formatDate(unixTime) {
            return moment(unixTime * 1000).add(new Date().getTimezoneOffset() / 60);
        },

        /**
         * Convert to human readable timestamp.
         */
        readableTimestamp(timestamp) {
            return this.formatDate(timestamp).format('YYYY-MM-DD HH:mm:ss');
        },
    }
}