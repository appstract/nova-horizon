<template>
    <card class="nova-horizon">
        <div class="px-6 py-6">
            <h3 class="mb-3 text-sm font-bold">Max Throughput</h3>

            <p class="text-4xl">
                {{ stats.queueWithMaxThroughput ? stats.queueWithMaxThroughput : '-' }}
            </p>
        </div>
    </card>
</template>

<script>
import CardWithStats from '../../templates/CardWithStats';

export default {
    extends: CardWithStats,
}
</script>
