<template>
    <card class="nova-horizon flex flex-col">
        <div :class="darkModeClass()">
            <nova-horizon-card-header class="p-3">
                Current Workload
            </nova-horizon-card-header>

            <nova-horizon-table
                v-if="workload.length"
                :header="[
                    { label: 'Queue', class: 'pl-3' },
                    { label: 'Processes' },
                    { label: 'Jobs' },
                    { label: 'Wait', class: 'pr-3 text-right' },
                ]"
            >
                <tr v-for="queue in workload">
                    <td :class="cellClass('pl-3')">
                        {{ queue.name.replace(/,/g, ', ') }}
                    </td>
                    <td :class="cellClass()">
                        {{ queue.processes ? queue.processes.toLocaleString() : 0 }}
                    </td>
                    <td :class="cellClass()">
                        {{ queue.length ? queue.length.toLocaleString() : 0 }}
                    </td>
                    <td :class="cellClass('pr-3 text-right')">
                        {{ humanTime(queue.wait) }}
                    </td>
                </tr>
            </nova-horizon-table>

            <nova-horizon-not-active v-else></nova-horizon-not-active>
        </div>
    </card>
</template>

<script>
import Card from '../../templates/Card';

export default {
    extends: Card,

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
