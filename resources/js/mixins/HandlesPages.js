export default {
    methods: {
        /**
         * Load the jobs for the previous page.
         */
        previousPage() {
            this.fetchRecentJobs((this.page - 2) * this.perPage);

            this.page -= 1;

            this.hasNewEntries = false;
        },

        /**
         * Load the jobs for the next page.
         */
        nextPage() {
            this.fetchRecentJobs(this.page * this.perPage);

            this.page += 1;

            this.hasNewEntries = false;
        },
    }
}