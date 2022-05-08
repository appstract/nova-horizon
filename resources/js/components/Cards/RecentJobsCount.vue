<template>
    <card class="nova-horizon">
        <div class="px-6 py-6">
            <h3 class="mb-3 text-sm font-bold">Recent Jobs</h3>

            <p class="text-4xl mb-3">
                {{ stats.recentJobs ? stats.recentJobs.toLocaleString() : 0 }}
            </p>

            <div class="text-80" v-text="recentJobsPeriod"></div>
        </div>
    </card>
</template>

<script>
import CardWithStats from '../../templates/CardWithStats';

export default {
    extends: CardWithStats,

    computed: {
        recentJobsPeriod() {
            return this.ready && this.stats.periods
                ? `Past ${this.determinePeriod(this.stats.periods.recentJobs)}`
                : 'Past hour';
        },
    }
}
</script>
