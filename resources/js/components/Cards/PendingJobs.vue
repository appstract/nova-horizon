<template>
    <card class="nova-horizon flex flex-col">
        <nova-horizon-card-header class="p-3">
            Pending Jobs
        </nova-horizon-card-header>

        <nova-horizon-loading v-if="! ready"></nova-horizon-loading>

        <nova-horizon-no-results v-if="ready && jobs.length == 0">
            No pending jobs found.
        </nova-horizon-no-results>

        <nova-horizon-table
            v-if="ready && jobs.length > 0"
            :header="[
                { label: 'Job', class: 'pl-3' },
                { label: 'Queued At' },
                { label: 'Runtime' },
                { label: 'Status', class: 'pr-3' },
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

            <tr v-for="job in jobs" :key="job.id" :job="job">
                <td :class="cellClass('pl-3')">
                    <div class="font-bold" :title="job.name">
                        {{ jobBaseName(job.name) }}
                    </div>

                    <p class="text-xxs">#{{ job.id }}</p>

                    <p class="text-xxs">
                        Queue: {{job.queue}}

                        <span v-if="job.payload.tags.length">
                            | Tags: {{ job.payload.tags && job.payload.tags.length ? job.payload.tags.slice(0,3).join(', ') : '' }}<span v-if="job.payload.tags.length > 3"> ({{ job.payload.tags.length - 3 }} more)</span>
                        </span>
                    </p>
                </td>

                <td :class="cellClass()">
                    {{ readableTimestamp(job.payload.pushedAt) }}
                </td>

                <td :class="cellClass()">
                    <span>
                        {{ job.completed_at ? (job.completed_at - job.reserved_at).toFixed(2)+'s' : '-' }}
                    </span>
                </td>

                <td :class="cellClass('pr-3 text-right')">
                    <svg v-if="job.status == 'completed'" class="w-6 fill-green-500" viewBox="0 0 20 20">
                        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"></path>
                    </svg>

                    <svg v-if="job.status == 'reserved' || job.status == 'pending'" class="w-6 fill-yellow-500" viewBox="0 0 20 20">
                        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM7 6h2v8H7V6zm4 0h2v8h-2V6z"/>
                    </svg>

                    <svg v-if="job.status == 'failed'" class="w-6 fill-red-500" viewBox="0 0 20 20">
                        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z"/>
                    </svg>
                </td>
            </tr>
        </nova-horizon-table>

        <div v-if="ready && jobs.length" class="p-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <button @click="previous" class="btn btn-secondary btn-md" :disabled="page == 1">Previous</button>
            <button @click="next" class="btn btn-secondary btn-md" :disabled="page >= totalPages">Next</button>
        </div>
    </card>
</template>

<script>
import CardWithJobs from '../../templates/CardWithJobs';
import { first } from 'lodash';

export default {
    extends: CardWithJobs,

    methods: {
        /**
         * Load the jobs of the given tag.
         */
        loadJobs(starting = -1, refreshing = false) {
            if (! refreshing) {
                this.ready = false;
            }

            Nova.request().get(config.novaHorizon.basePath + '/api/jobs/pending?starting_at=' + starting + '&limit=' + this.perPage)
                .then(response => {
                    if (
                        refreshing &&
                        this.jobs.length &&
                        first(response.data.jobs) !== undefined &&
                        first(response.data.jobs).id !== first(this.jobs).id
                    ) {
                        this.hasNewEntries = true;
                    } else {
                        this.jobs = response.data.jobs;

                        this.totalPages = Math.ceil(response.data.jobs.length / this.perPage);
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
