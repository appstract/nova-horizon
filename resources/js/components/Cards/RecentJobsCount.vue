<template>
    <card class="px-6 py-6">
        <h3 class="mr-3 mb-3 text-base text-80 font-bold">Recent Jobs</h3>

        <p class="text-4xl mb-3">
            {{ stats.recentJobs ? stats.recentJobs.toLocaleString() : 0 }}
        </p>

        <div class="text-80" v-text="recentJobsPeriod"></div>
    </card>
</template>

<script>
import StatsCard from '../../templates/StatsCard';

export default {
    extends: StatsCard,

    computed: {
        recentJobsPeriod() {
            return this.ready && this.stats.periods
                ? `Past ${this.determinePeriod(this.stats.periods.recentJobs)}`
                : 'Past hour';
        },
    }
}
</script>