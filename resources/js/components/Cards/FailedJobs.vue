<template>
    <card>
        <div class="flex items-center justify-between p-3">
            <h5 class="text-base text-80 font-bold">Failed Jobs</h5>
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Search Tags"
                style="width: 200px"
                class="form-control form-input form-input-bordered"
            >
        </div>

        <div v-if="! ready" class="p-8 border-t-2 rounded-b-lg border-gray-300 text-center bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="spin mr-2 w-8 fill-primary">
                <path d="M12 10a2 2 0 0 1-3.41 1.41A2 2 0 0 1 10 8V0a9.97 9.97 0 0 1 10 10h-8zm7.9 1.41A10 10 0 1 1 8.59.1v2.03a8 8 0 1 0 9.29 9.29h2.02zm-4.07 0a6 6 0 1 1-7.25-7.25v2.1a3.99 3.99 0 0 0-1.4 6.57 4 4 0 0 0 6.56-1.42h2.1z"></path>
            </svg>

            <span>Loading...</span>
        </div>

        <div v-if="ready && jobs.length == 0" class="p-8 border-t-2 rounded-b-lg border-gray-300 text-center bg-gray-100">
            <span>No failed jobs found.</span>
        </div>

        <div class="overflow-hidden overflow-x-auto relative" v-if="jobs.length">
            <table class="table w-full">
                <thead>
                    <tr>
                        <th class="text-left">Job</th>
                        <th class="text-left">Runtime</th>
                        <th class="text-left">Failed At</th>
                        <th class="text-right">Retry</th>
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

                    <tr v-for="job in jobs" :key="job.id">
                        <td>
                            <modal v-if="visibleModal(job)">
                                <div class="bg-white rounded-lg shadow-lg overflow-hidden" style="width: 900px">
                                    <div class="bg-30 p-4 flex items-center justify-between">
                                        <div class="font-bold">
                                            {{ modal.name }} (#{{ modal.id }})
                                        </div>

                                        <button
                                            @click.prevent="closeModal"
                                            class="btn btn-default btn-danger"
                                        >
                                            Close
                                        </button>
                                    </div>

                                    <div class="p-4">
                                        <nova-horizon-stack-trace :trace="modal.exception.split('\n')"></nova-horizon-stack-trace>
                                    </div>

                                    <div class="bg-30 p-4 flex items-center justify-between">
                                        <span class="font-bold">Data</span>
                                    </div>

                                    <div class="p-4 bg-black text-white">
                                        <nova-horizon-json-pretty :data="prettyPrintJob(modal.payload.data)"></nova-horizon-json-pretty>
                                    </div>
                                </div>
                            </modal>

                            <a class="no-underline dim text-primary font-bold" :title="job.name" href="#" @click.prevent="openModal(job)">
                                {{ jobBaseName(job.name) }}
                            </a>

                            <br>

                            <small>
                                Queue: {{job.queue}}
                                <span v-if="job.payload && job.payload.tags.length">
                                    | Tags: {{ job.payload.tags && job.payload.tags.length ? job.payload.tags.join(', ') : '' }}
                                </span>
                            </small>
                        </td>

                        <td>
                            <span>{{ job.failed_at ? String((job.failed_at - job.reserved_at).toFixed(2))+'s' : '-' }}</span>
                        </td>

                        <td>
                            {{ readableTimestamp(job.failed_at) }}
                        </td>

                        <td class="text-right">
                            <a href="#" @click.prevent="retry(job.id)" v-if="! hasCompleted(job)">
                                <svg class="fill-primary" viewBox="0 0 20 20" style="width: 1.5rem; height: 1.5rem;" :class="{spin: isRetrying(job.id)}">
                                    <path d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"/>
                                </svg>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="ready && jobs.length" class="flex justify-between p-3">
            <button @click="previous" class="btn btn-secondary btn-md" :disabled="page==1">Previous</button>
            <button @click="next" class="btn btn-secondary btn-md" :disabled="page>=totalPages">Next</button>
        </div>
    </card>
</template>

<script>
import JobsCard from '../../templates/JobsCard';

export default {
    extends: JobsCard,

    /**
     * The component's data.
     */
    data() {
        return {
            searchQuery: '',
            searchTimeout: null,
            retryingJobs: [],
        };
    },

    /**
     * Watch these properties for changes.
     */
    watch: {
        searchQuery() {
            clearTimeout(this.searchTimeout);
            clearInterval(this.interval);

            this.searchTimeout = setTimeout(() => {
                this.loadJobs();
                this.refreshJobsPeriodically();
            }, 500);
        }
    },

    methods: {
        /**
         * Load the jobs of the given tag.
         */
        loadJobs(starting = 0, refreshing = false) {
            if (! refreshing) {
                this.ready = false;
            }

            var tagQuery = this.searchQuery ? 'tag=' + this.searchQuery + '&' : '';

            Nova.request().get(config.novaHorizon.basePath + '/api/jobs/failed?' + tagQuery + 'starting_at=' + starting)
                .then(response => {
                    if (! this.$root.autoLoadsNewEntries && refreshing && ! response.data.jobs.length) {
                        return;
                    }

                    if (! this.$root.autoLoadsNewEntries && refreshing && this.jobs.length && _.first(response.data.jobs).id !== _.first(this.jobs).id) {
                        this.hasNewEntries = true;
                    } else {
                        this.jobs = response.data.jobs;

                        this.totalPages = Math.ceil(response.data.total / this.perPage);
                    }

                    this.ready = true;
                });
        },

        /**
         * Load new entries.
         */
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
                this.loadJobs((this.page - 1) * this.perPage, true);
            }, 3000);
        },

        /**
         * Retry the given failed job.
         */
        retry(id) {
            if (this.isRetrying(id)) {
                return;
            }

            this.retryingJobs.push(id);

            Nova.request().post(config.novaHorizon.basePath + '/api/jobs/retry/' + id)
                .then((response) => {
                    setTimeout(() => {
                        this.retryingJobs = _.reject(this.retryingJobs, job => job == id);
                    }, 10000);
                });
        },

        /**
         * Determine if the given job is currently retrying.
         */
        isRetrying(id) {
            return _.includes(this.retryingJobs, id);
        },

        /**
         * Determine if the given job has completed.
         */
        hasCompleted(job) {
            return _.find(job.retried_by, retry => retry.status == 'completed');
        },
    }
}
</script>

<style scoped>
    .p-8{ padding: 2rem; }

    .bg-gray-100{ background: #f7fafc; }

    .border-gray-300{ border-color: #e2e8f0; }
</style>
