export default {
    /**
     * Data.
     */
    data() {
        return {
            ready: false,
            hasNewEntries: false,
            loadingNewEntries: false,
            page: 1,
            perPage: 50,
            totalPages: 1,
            jobs: [],
            modal: null,
        }
    },

    /**
     * Mounted.
     */
    mounted() {
        //
    },

    /**
     * Destroyed.
     */
    destroyed() {
        clearInterval(this.interval);
    },

    methods: {
        /**
         * Load the jobs for the previous page.
         */
        previous() {
            this.loadJobs(
                (this.page - 2) * this.perPage
            );

            this.page -= 1;

            this.hasNewEntries = false;
        },

        /**
         * Load the jobs for the next page.
         */
        next() {
            this.loadJobs(
                this.page * this.perPage
            );

            this.page += 1;

            this.hasNewEntries = false;
        },

        /**
         * Checks if a modal needs to be open.
         */
        visibleModal(job) {
            return this.modal && this.modal.id == job.id;
        },

        /**
         * Open a modal.
         */
        openModal(job) {
            this.modal = job;
        },

        /**
         * Close a modal.
         */
        closeModal() {
            this.modal = null;
        },
    },
}