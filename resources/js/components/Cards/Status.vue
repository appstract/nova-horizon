<template>
    <card class="px-6 py-6">
        <h3 class="mr-3 mb-3 text-base text-80 font-bold">Status</h3>

        <div class="flex items-center mt-4">
            <svg v-if="stats.status == 'running'" class="fill-success" viewBox="0 0 20 20" style="width: 1.7rem; height: 1.7rem;">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"></path>
            </svg>

            <svg v-if="stats.status == 'paused'" class="fill-warning" viewBox="0 0 20 20" style="width: 1.7rem; height: 1.7rem;">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM7 6h2v8H7V6zm4 0h2v8h-2V6z"/>
            </svg>

            <svg v-if="stats.status == 'inactive'" class="fill-danger" viewBox="0 0 20 20" style=" width: 1.7rem; height: 1.7rem;">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z"/>
            </svg>

            <p class="mb-0 ml-2 text-4xl">
                {{ {
                    running: 'Active',
                    paused: 'Paused',
                    inactive:'Inactive'
                }[stats.status] }}
            </p>
        </div>
    </card>
</template>

<script>
import StatsCard from '../../templates/StatsCard';

export default {
    extends: StatsCard,
}
</script>