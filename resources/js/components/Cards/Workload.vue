<template>
    <card class="nova-horizon flex flex-col">
        <div class="p-3 border-b border-gray-200 tracking-wide text-sm font-bold">
            Current Workload
        </div>

        <div class="flex-1 overflow-hidden overflow-x-auto relative" v-if="workload.length">
            <table cellpadding="0" cellspacing="0" class="w-full table-default">
                <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th class="text-left p-2 pl-3 whitespace-nowrap uppercase text-gray-500 text-xxs">Queue</th>
                        <th class="text-left p-2 whitespace-nowrap uppercase text-gray-500 text-xxs">Processes</th>
                        <th class="text-left p-2 whitespace-nowrap uppercase text-gray-500 text-xxs">Jobs</th>
                        <th class="text-right p-2 pr-3 whitespace-nowrap uppercase text-gray-500 text-xxs">Wait</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="queue in workload">
                        <td class="p-2 pl-3 border-t border-gray-100 dark:border-gray-700 whitespace-nowrap dark:bg-gray-800">
                            {{ queue.name.replace(/,/g, ', ') }}
                        </td>
                        <td class="p-2 border-t border-gray-100 dark:border-gray-700 whitespace-nowrap dark:bg-gray-800">
                            {{ queue.processes ? queue.processes.toLocaleString() : 0 }}
                        </td>
                        <td class="p-2 border-t border-gray-100 dark:border-gray-700 whitespace-nowrap dark:bg-gray-800">
                            {{ queue.length ? queue.length.toLocaleString() : 0 }}
                        </td>
                        <td class="text-right p-2 pr-3 border-t border-gray-100 dark:border-gray-700 whitespace-nowrap dark:bg-gray-800">
                            {{ humanTime(queue.wait) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <nova-horizon-not-active v-else></nova-horizon-not-active>
    </card>
</template>

<script>
export default {
    data() {
        return {
            ready: false,
            workload: [],
        }
    },

    /**
     * Mounted.
     */
    mounted() {
        this.fetchWorkloadPeriodically();
    },

    methods: {
        /**
         * Fetch stats from horizon.
         */
        fetchWorkload() {
            Nova.request().get(config.novaHorizon.basePath + '/api/workload').then(response => {
                this.workload = response.data;
            });
        },

        /**
         * Fetch stats periodically with Promise and timeout.
         */
        fetchWorkloadPeriodically() {
            Promise.all([
                this.fetchWorkload()
            ]).then(() => {
                this.ready = true;

                this.timeout = setTimeout(() => {
                    this.fetchWorkloadPeriodically();
                }, 10000);
            });
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
</script>

<style scoped>
    .w-25{ width: 25%; }

    .bg-gray-100{ background: #f7fafc; }

    .border-gray-300{ border-color: #e2e8f0; }
</style>
