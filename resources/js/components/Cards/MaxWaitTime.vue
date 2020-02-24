<template>
    <card class="px-6 py-6">
        <h3 class="mr-3 mb-3 text-base text-80 font-bold">Max Wait Time</h3>

        <p class="text-4xl mb-3">
            {{ stats.max_wait_time ? humanTime(stats.max_wait_time) : '-' }}
        </p>
    </card>
</template>

<script>
import StatsCard from '../../templates/StatsCard';

export default {
    extends: StatsCard,

    methods: {
        humanTime(time) {
            return moment.duration(time, "seconds").humanize().replace(/^(.)|\s+(.)/g, function ($1) {
                return $1.toUpperCase();
            });
        },
    }
}
</script>