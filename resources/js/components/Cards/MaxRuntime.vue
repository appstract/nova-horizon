<template>
    <card class="nova-horizon">
        <div class="px-6 py-6" :class="darkModeClass()">
            <h3 class="mb-3 text-sm font-bold">Max Runtime</h3>

            <p class="text-4xl">
                {{ stats.queueWithMaxRuntime ? stats.queueWithMaxRuntime : '-' }}
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
