<template>
    <card>
        <div class="p-3 text-base text-80 font-bold">
            Current Workload
        </div>

        <div class="overflow-hidden overflow-x-auto relative" v-if="workload.length">
            <table cellpadding="0" cellspacing="0" class="table w-full">
                <thead>
                    <tr>
                        <th class="text-left">Queue</th>
                        <th class="text-left">Processes</th>
                        <th class="text-left">Jobs</th>
                        <th class="text-right">Wait</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="queue in workload">
                        <td class="w-25">
                            {{ queue.name.replace(/,/g, ', ') }}
                        </td>
                        <td class="w-25">
                            {{ queue.processes ? queue.processes.toLocaleString() : 0 }}
                        </td>
                        <td class="w-25">
                            {{ queue.length ? queue.length.toLocaleString() : 0 }}
                        </td>
                        <td class="w-25 text-right">
                            {{ humanTime(queue.wait) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="p-8 border-t-2 rounded-b-lg border-gray-300 text-center bg-gray-100" v-else>
            Horizon is not active.
        </div>
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