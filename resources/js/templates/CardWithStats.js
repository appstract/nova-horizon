import { values, keys } from 'lodash';

export default {
    props: [
        'card',
    ],

    /**
     * Data.
     */
    data() {
        return {
            ready: false,
            stats: {},
        }
    },

    /**
     * Mounted.
     */
    mounted() {
        this.fetchStatsPeriodically();
    },

    /**
     * Destroyed.
     */
    destroyed() {
        clearTimeout(this.timeout);
    },

    methods: {
        /**
         * Manual dark mode.
         */
        darkModeClass() {
            let activeDarkMode = localStorage.novaTheme === 'dark';

            let prefersDarkMode = (! ('novaTheme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

            return (activeDarkMode ||  prefersDarkMode) ? 'dark' : '';
        },

        /**
         * Fetch stats from horizon.
         */
        fetchStats() {
            Nova.request().get(config.novaHorizon.basePath + '/api/stats').then(response => {
                this.stats = response.data;

                if (values(response.data.wait)[0]) {
                    this.stats.max_wait_time = values(response.data.wait)[0];
                    this.stats.max_wait_queue = keys(response.data.wait)[0].split(':')[1];
                }
            });
        },

        /**
         * Fetch stats periodically with Promise and timeout.
         */
        fetchStatsPeriodically() {
            Promise.all([
                this.fetchStats()
            ]).then(() => {
                this.ready = true;

                this.timeout = setTimeout(() => {
                    this.fetchStatsPeriodically();
                }, 10000);
            });
        },

        /**
         * Determine the unit for the given timeframe.
         */
        determinePeriod(minutes) {
            return moment.duration(
                moment().diff(moment().subtract(minutes, "minutes"))
            ).humanize().replace(/^An?/i, '');
        },

        /**
         * @returns {string}
         */
        humanTime(time) {
            return moment.duration(time, "seconds").humanize().replace(/^(.)|\s+(.)/g, function ($1) {
                return $1.toUpperCase();
            });
        },
    },
}
