<template>
    <card class="px-6 py-6">
        <h3 class="mr-3 mb-3 text-base text-80 font-bold">Max Runtime</h3>

        <p class="text-4xl mb-3">
            {{ stats.queueWithMaxRuntime ? stats.queueWithMaxRuntime : '-' }}
        </p>
    </card>
</template>

<script>
import StatsCard from '../../templates/StatsCard';

export default {
    extends: StatsCard,
}
</script>