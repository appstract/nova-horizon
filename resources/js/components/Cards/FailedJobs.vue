<template>
    <card class="nova-horizon">
        <nova-horizon-card-header class="flex justify-between">
            <h5 class="p-3">Failed Jobs</h5>
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Search Tags"
                style="width: 200px"
                class="border-none !border-l border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-tl"
            >
        </nova-horizon-card-header>

        <nova-horizon-loading v-if="! ready"></nova-horizon-loading>

        <nova-horizon-no-results v-if="ready && jobs.length == 0">
            No failed jobs found.
        </nova-horizon-no-results>

        <nova-horizon-table
            v-if="ready && jobs.length > 0"
            :header="[
                { label: 'Job', class: 'pl-3' },
                { label: 'Runtime' },
                { label: 'Failed At' },
                { label: 'Retry', class: 'pr-3' },
            ]"
        >
            <tr v-if="hasNewEntries" key="newEntries">
                <td colspan="100" class="text-center bg-gray-50 border-y border-gray-200 dark:border-gray-700 hover:text-sky-500">
                    <a
                        href="#"
                        v-on:click.prevent="loadNewEntries"
                        v-if="! loadingNewEntries"
                        class="block p-8 text-sm font-bold"
                    >Load New Entries</a>

                    <small v-if="loadingNewEntries">Loading...</small>
                </td>
            </tr>

            <tr v-for="job in jobs" :key="job.id">
                <td :class="cellClass('pl-3')">
                    <div class="no-underline dim text-primary font-bold" :title="job.name">
                        {{ jobBaseName(job.name) }}
                    </div>

                    <p class="text-xxs">
                        Queue: {{job.queue}}

                        <span v-if="job.payload && job.payload.tags.length">
                            | Tags: {{ job.payload.tags && job.payload.tags.length ? job.payload.tags.join(', ') : '' }}
                        </span>
                    </p>
                </td>

                <td :class="cellClass()">
                    <span>{{ job.failed_at ? String((job.failed_at - job.reserved_at).toFixed(2))+'s' : '-' }}</span>
                </td>

                <td :class="cellClass()">
                    {{ readableTimestamp(job.failed_at) }}
                </td>

                <td :class="cellClass('pr-3 text-right')">
                    <a href="#" @click.prevent="retry(job.id)" v-if="! hasCompleted(job)">
                        <svg class="w-6" viewBox="0 0 20 20" :class="{spin: isRetrying(job.id)}">
                            <path d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"/>
                        </svg>
                    </a>
                </td>
            </tr>
        </nova-horizon-table>

        <div v-if="ready && jobs.length" class="flex justify-between p-3 border-t border-gray-200 dark:border-gray-700">
            <button @click="previous" class="btn btn-secondary btn-md" :disabled="page==1">Previous</button>
            <button @click="next" class="btn btn-secondary btn-md" :disabled="page>=totalPages">Next</button>
        </div>
    </card>
</template>

<script>
import CardWithJobs from '../../templates/CardWithJobs';
import { first, reject, includes, find } from 'lodash';

export default {
    extends: CardWithJobs,

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

                    if (! this.$root.autoLoadsNewEntries && refreshing && this.jobs.length && first(response.data.jobs).id !== first(this.jobs).id) {
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
                        this.retryingJobs = reject(this.retryingJobs, job => job == id);
                    }, 10000);
                });
        },

        /**
         * Determine if the given job is currently retrying.
         */
        isRetrying(id) {
            return includes(this.retryingJobs, id);
        },

        /**
         * Determine if the given job has completed.
         */
        hasCompleted(job) {
            return find(job.retried_by, retry => retry.status == 'completed');
        },
    }
}
</script>

<style scoped>
    .p-8{ padding: 2rem; }

    .bg-gray-100{ background: #f7fafc; }

    .border-gray-300{ border-color: #e2e8f0; }
</style>
