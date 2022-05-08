<template>
    <card class="nova-horizon flex flex-col">
        <div class="p-3 border-b border-gray-200 tracking-wide text-sm font-bold">
            Pending Jobs
        </div>

        <nova-horizon-loading v-if="! ready"></nova-horizon-loading>

        <nova-horizon-no-results v-if="ready && jobs.length == 0">
            No pending jobs found.
        </nova-horizon-no-results>

        <div class="overflow-hidden overflow-x-auto relative" v-if="ready && jobs.length > 0">
            <table class="w-full table-default">
                <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th class="text-left p-2 pl-3 whitespace-nowrap uppercase text-gray-500 text-xxs">Job</th>
                        <th class="text-left p-2 pl-3 whitespace-nowrap uppercase text-gray-500 text-xxs">Queued At</th>
                        <th class="text-left p-2 pl-3 whitespace-nowrap uppercase text-gray-500 text-xxs">Runtime</th>
                        <th class="text-left p-2 pr-3 whitespace-nowrap uppercase text-gray-500 text-xxs">Status</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-if="hasNewEntries" key="newEntries">
                        <td colspan="100" class="text-center bg-gray-50 border-y border-gray-200">
                            <a
                                href="#"
                                v-on:click.prevent="loadNewEntries"
                                v-if="! loadingNewEntries"
                                class="block p-8 text-sm font-bold border-gray"
                            >Load New Entries</a>

                            <small v-if="loadingNewEntries">Loading...</small>
                        </td>
                    </tr>

                    <tr v-for="job in jobs" :key="job.id" :job="job">
                        <td class="p-2 pl-3 border-t border-gray-100 dark:border-gray-700 whitespace-nowrap dark:bg-gray-800">
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

                                    <div class="p-4" v-if="modal.status == 'failed'">
                                        <nova-horizon-stack-trace :trace="modal.exception.split('\n')"></nova-horizon-stack-trace>
                                    </div>

                                    <div class="bg-30 p-4 flex items-center justify-between" v-if="modal.status == 'failed'">
                                        <span class="font-bold">Data</span>
                                    </div>

                                    <div class="p-4 bg-black text-white">
                                        <nova-horizon-json-pretty :data="prettyPrintJob(modal.payload.data)"></nova-horizon-json-pretty>
                                    </div>
                                </div>
                            </modal>

                            <a class="font-bold" :title="job.name" href="#" @click.prevent="openModal(job)">
                                {{ jobBaseName(job.name) }}
                            </a>

                            <p class="text-xxs">#{{ job.id }}</p>

                            <p class="text-xxs">
                                Queue: {{job.queue}}

                                <span v-if="job.payload.tags.length">
                                    | Tags: {{ job.payload.tags && job.payload.tags.length ? job.payload.tags.slice(0,3).join(', ') : '' }}<span v-if="job.payload.tags.length > 3"> ({{ job.payload.tags.length - 3 }} more)</span>
                                </span>
                            </p>
                        </td>

                        <td class="p-2 border-t border-gray-100 dark:border-gray-700 whitespace-nowrap dark:bg-gray-800">
                            {{ readableTimestamp(job.payload.pushedAt) }}
                        </td>

                        <td class="p-2 border-t border-gray-100 dark:border-gray-700 whitespace-nowrap dark:bg-gray-800">
                            <span>
                                {{ job.completed_at ? (job.completed_at - job.reserved_at).toFixed(2)+'s' : '-' }}
                            </span>
                        </td>

                        <td class="p-2 pr-3 border-t border-gray-100 dark:border-gray-700 whitespace-nowrap dark:bg-gray-800 text-right">
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
                </tbody>
            </table>
        </div>

        <div v-if="ready && jobs.length" class="p-3 border-t border-gray-200 flex justify-between">
            <button @click="previous" class="btn btn-secondary btn-md" :disabled="page == 1">Previous</button>
            <button @click="next" class="btn btn-secondary btn-md" :disabled="page >= totalPages">Next</button>
        </div>
    </card>
</template>

<script>
import JobsCard from '../../templates/JobsCard';

export default {
    extends: JobsCard,

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
                        _.first(response.data.jobs) !== undefined &&
                        _.first(response.data.jobs).id !== _.first(this.jobs).id
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
