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
                    <tr v-if="hasNewEntries" class="bg-gray-100">
                        <td colspan="100" class="text-center p-8">
                            <a
                                v-if="! loadingNewEntries"
                                @click.prevent="loadNewEntries"
                                href="#"
                                class="no-underline dim text-primary font-bold"
                            >Load New Entries</a>

                            <small v-if="loadingNewEntries">Loading...</small>
                        </td>
                    </tr>

                    <tr v-for="job in jobs" :key="job.id">
                        <td>
                            <router-link
                                :title="job.name"
                                :to="{ name: 'failed-jobs-preview', params: { jobId: job.id }}"
                                class="no-underline dim text-primary font-bold"
                            >
                                {{ prettyJobName(job.name) }}
                            </router-link>

                            <br>

                            <small>
                                <span>Queue: {{ job.queue }}</span>
                                <span v-if="job.payload.tags.length">
                                    | Tags: {{ job.payload.tags && job.payload.tags.length ? job.payload.tags.join(', ') : '' }}
                                </span>
                            </small>
                        </td>

                        <td>
                            <span>{{ job.failed_at ? String((job.failed_at - job.reserved_at).toFixed(2)) + 's' : '-' }}</span>
                        </td>

                        <td>
                            {{ readableTimestamp(job.failed_at) }}
                        </td>

                        <td class="text-right">
                            <a
                                href="#"
                                @click.prevent="retry(job.id)"
                                v-if="! hasCompleted(job)"
                            >
                                <svg class="fill-primary" viewBox="0 0 20 20" style="width: 1.5rem; height: 1.5rem;" :class="{spin: isRetrying(job.id)}">
                                    <path d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"/>
                                </svg>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="ready && jobs.length" class="flex justify-between p-3">
                <button
                    @click="previousPage"
                    class="btn btn-secondary"
                    :disabled="page == 1"
                >Previous</button>

                <button
                    @click="nextPage"
                    class="btn btn-secondary"
                    :disabled="page >= totalPages"
                >Next</button>
            </div>
        </div>

        <div class="p-8 border-t-2 rounded-b-lg border-gray-300 text-center bg-gray-100" v-else>
            No failed jobs found.
        </div>
    </card>
</template>

<script>
import HandlesJobs from '../../mixins/HandlesJobs';
import HandlesDates from '../../mixins/HandlesDates';
import HandlesPages from '../../mixins/HandlesPages';

export default {
    mixins: [
        HandlesJobs,
        HandlesDates
    ],

    data() {
        return {
            ready: false,
            searchQuery: '',
            searchTimeout: null,
            loadingNewEntries: false,
            hasNewEntries: false,
            page: 1,
            perPage: 50,
            totalPages: 1,
            jobs: [],
            retryingJobs: [],
        };
    },

    /**
     * Mounted.
     */
    mounted() {
        this.fetchRecentJobs();

        this.refreshRecentJobsPeriodically();
    },

    /**
     * Destroyed.
     */
    destroyed() {
        clearInterval(this.interval);
    },

    /**
     * Watch.
     */
    watch: {
        searchQuery() {
            clearTimeout(this.searchTimeout);
            clearInterval(this.interval);

            this.searchTimeout = setTimeout(() => {
                this.fetchRecentJobs();
                this.refreshRecentJobsPeriodically();
            }, 500);
        }
    },


    methods: {
        /**
         * Load the jobs of the given tag.
         */
        fetchRecentJobs(starting = 0, refreshing = false) {
            if (! refreshing) {
                this.ready = false;
            }

            var tagQuery = this.searchQuery ? 'tag=' + this.searchQuery + '&' : '';

            var queryParams = tagQuery + 'starting_at=' + starting + '&limit=' + this.perPage;

            Nova.request().get(
                '/horizon/api/jobs/failed?' + queryParams
            ).then(response => {
                if (
                    refreshing &&
                    this.jobs.length &&
                    _.first(response.data.jobs).id !== _.first(this.jobs).id
                ) {
                    this.hasNewEntries = true;
                } else {
                    this.jobs = response.data.jobs;

                    this.totalPages = Math.ceil(response.data.total / this.perPage);
                }

                this.ready = true;
            });
        },

        /**
         * Refresh the jobs every period of time.
         */
        refreshRecentJobsPeriodically() {
            this.interval = setInterval(() => {
                this.fetchRecentJobs((this.page - 1) * this.perPage, true);
            }, 3000);
        },

        /**
         * Load new entries.
         */
        loadNewEntries() {
            this.jobs = [];

            this.fetchRecentJobs(0, false);

            this.hasNewEntries = false;
        },

        /**
         * Retry the given failed job.
         */
        retry(id) {
            if (this.isRetrying(id)) {
                return;
            }

            this.retryingJobs.push(id);

            Nova.request().post('/horizon/api/jobs/retry/' + id).then((response) => {
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
    .w-25{ width: 25%; }

    .bg-gray-100{ background: #f7fafc; }

    .border-gray-300{ border-color: #e2e8f0; }
</style>
