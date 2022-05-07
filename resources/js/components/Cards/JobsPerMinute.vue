<template>
    <card class="nova-horizon">
        <div class="px-6 py-6">
            <h3 class="mr-3 mb-3 text-base text-80 font-bold">Jobs</h3>

            <p class="text-4xl mb-3">
                {{ stats.jobsPerMinute ? stats.jobsPerMinute.toLocaleString() : 0 }}
            </p>

            <div class="text-80">
                Per Minute
            </div>
        </div>
    </card>
</template>

<script>
import StatsCard from '../../templates/StatsCard';

export default {
    extends: StatsCard,
}
</script>
