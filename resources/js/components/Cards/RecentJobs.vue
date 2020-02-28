<template>
    <card>
        <div class="flex items-center justify-between p-3">
            <h5 class="text-base text-80 font-bold">Recent Jobs</h5>
        </div>

        <div v-if="! ready" class="p-8 border-t-2 rounded-b-lg border-gray-300 text-center bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="spin mr-2 w-8 fill-primary">
                <path d="M12 10a2 2 0 0 1-3.41 1.41A2 2 0 0 1 10 8V0a9.97 9.97 0 0 1 10 10h-8zm7.9 1.41A10 10 0 1 1 8.59.1v2.03a8 8 0 1 0 9.29 9.29h2.02zm-4.07 0a6 6 0 1 1-7.25-7.25v2.1a3.99 3.99 0 0 0-1.4 6.57 4 4 0 0 0 6.56-1.42h2.1z"></path>
            </svg>

            <span>Loading...</span>
        </div>

        <div v-if="ready && jobs.length == 0" class="p-8 border-t-2 rounded-b-lg border-gray-300 text-center bg-gray-100">
            <span>No recent jobs found.</span>
        </div>

        <div class="overflow-hidden overflow-x-auto relative" v-if="ready && jobs.length > 0">
            <table class="table w-full">
                <thead>
                    <tr>
                        <th class="text-left">Job</th>
                        <th class="text-left">Queued At</th>
                        <th class="text-left">Runtime</th>
                        <th class="text-right">Status</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-if="hasNewEntries" key="newEntries">
                        <td colspan="100" class="text-center bg-gray-100 p-8">
                            <a
                                href="#"
                                v-on:click.prevent="loadNewEntries"
                                v-if="! loadingNewEntries"
                                class="no-underline dim text-primary font-bold"
                            >Load New Entries</a>

                            <small v-if="loadingNewEntries">Loading...</small>
                        </td>
                    </tr>

                    <tr v-for="job in jobs" :key="job.id" :job="job" is="job-row"></tr>
                </tbody>
            </table>
        </div>

        <div v-if="ready && jobs.length" class="p-3 flex justify-between">
            <button @click="previous" class="btn btn-secondary btn-md" :disabled="page==1">Previous</button>
            <button @click="next" class="btn btn-secondary btn-md" :disabled="page>=totalPages">Next</button>
        </div>
    </card>
</template>

<script>
import JobsCard from '../../templates/JobsCard';
import JobRow from './RecentJobs/JobRow';

export default {
    extends: JobsCard,

    /**
     * Components
     */
    components: {
        JobRow,
    },

    /**
     * Prepare the component.
     */
    mounted() {
        this.loadJobs();

        this.refreshJobsPeriodically();
    },

    methods: {
        /**
         * Load the jobs of the given tag.
         */
        loadJobs(starting = -1, refreshing = false) {
            if (! refreshing) {
                this.ready = false;
            }

            Nova.request().get(NovaHorizon.basePath + '/api/jobs/recent?starting_at=' + starting + '&limit=' + this.perPage)
                .then(response => {
                    if (! this.$root.autoLoadsNewEntries && refreshing && this.jobs.length && _.first(response.data.jobs).id !== _.first(this.jobs).id) {
                        this.hasNewEntries = true;
                    } else {
                        this.jobs = response.data.jobs;

                        this.totalPages = Math.ceil(response.data.total / this.perPage);
                    }

                    this.ready = true;
                });
        },

        loadNewEntries() {
            this.jobs = [];

            this.loadJobs(-1, false);

            this.hasNewEntries = false;
        },

        /**
         * Refresh the jobs every period of time.
         */
        refreshJobsPeriodically() {
            this.interval = setInterval(() => {
                if (this.page != 1) {
                    return;
                }

                this.loadJobs(-1, true);
            }, 5000);
        },
    }
}
</script>

<style scoped>
    .p-8{ padding: 2rem; }

    .bg-gray-100{ background: #f7fafc; }

    .border-gray-300{ border-color: #e2e8f0; }
</style>