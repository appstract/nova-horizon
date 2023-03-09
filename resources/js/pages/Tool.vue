<template>
    <div class="grid md:grid-cols-12 gap-6">
        <component class="md:col-span-12" v-for="component in components" :is="component" :key="component" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            components: [
                'nova-horizon-card-stats',
                'nova-horizon-card-workload',
                'nova-horizon-card-pending-jobs',
                'nova-horizon-card-failed-jobs',
                'nova-horizon-card-completed-jobs',
            ]
        }
    },
}
</script>
