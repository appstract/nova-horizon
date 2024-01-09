<template>
    <card class="nova-horizon">
        <div :class="darkMode()">
        <div class="px-6 py-6">
            <h3 class="mb-3 text-sm font-bold">Jobs</h3>

            <p class="text-4xl mb-3">
                {{ stats.jobsPerMinute ? stats.jobsPerMinute.toLocaleString() : 0 }}
            </p>

            <p class="text-sm">Per Minute</p>
        </div>
        </div>
    </card>
</template>

<script>
import CardWithStats from '../../templates/CardWithStats';

export default {
    extends: CardWithStats,
}
</script>
