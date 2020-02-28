<template>
    <tr>
        <td>
            <modal v-if="visibleModal(job)">
                <div class="bg-white rounded-lg shadow-lg overflow-hidden" style="width: 900px">
                    <div class="bg-30 p-4 flex items-center justify-between">
                        <div class="font-bold">
                            {{ modal.name }} (#{{ modal.id }})
                        </div>

                        <button
                            @click.prevent="closeModal"
                            class="btn btn-default btn-danger"
                        >
                            Close
                        </button>
                    </div>

                    <div class="p-4" v-if="modal.status == 'failed'">
                        <nova-horizon-stack-trace :trace="modal.exception.split('\n')"></nova-horizon-stack-trace>
                    </div>

                    <div class="bg-30 p-4 flex items-center justify-between" v-if="modal.status == 'failed'">
                        <span class="font-bold">Data</span>
                    </div>

                    <div class="p-4 bg-black text-white">
                        <nova-horizon-json-pretty :data="prettyPrintJob(modal.payload.data)"></nova-horizon-json-pretty>
                    </div>
                </div>
            </modal>

            <a class="no-underline dim text-primary font-bold" :title="job.name" href="#" @click.prevent="openModal(job)">
                {{ jobBaseName(job.name) }}
            </a>

            (#{{ job.id }})

            <small
                class="p-2 fill-info"
                v-tooltip:top="`Delayed for ${delayed}`"
                v-if="delayed && (job.status == 'reserved' || job.status == 'pending')"
            >
                Delayed
            </small>

            <br>

            <small class="text-muted">
                Queue: {{job.queue}}

                <span v-if="job.payload.tags.length">
                    | Tags: {{ job.payload.tags && job.payload.tags.length ? job.payload.tags.slice(0,3).join(', ') : '' }}<span v-if="job.payload.tags.length > 3"> ({{ job.payload.tags.length - 3 }} more)</span>
                </span>
            </small>
        </td>

        <td>
            {{ readableTimestamp(job.payload.pushedAt) }}
        </td>

        <td>
            <span>
                {{ job.completed_at ? (job.completed_at - job.reserved_at).toFixed(2)+'s' : '-' }}
            </span>
        </td>

        <td class="text-right">
            <svg v-if="job.status == 'completed'" class="fill-success" viewBox="0 0 20 20" style="width: 1.5rem; height: 1.5rem;">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"></path>
            </svg>

            <svg v-if="job.status == 'reserved' || job.status == 'pending'" class="fill-warning" viewBox="0 0 20 20" style="width: 1.5rem; height: 1.5rem;">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM7 6h2v8H7V6zm4 0h2v8h-2V6z"/>
            </svg>

            <svg v-if="job.status == 'failed'" class="fill-danger" viewBox="0 0 20 20" style="width: 1.5rem; height: 1.5rem;">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z"/>
            </svg>
        </td>
    </tr>
</template>

<script>
    import phpunserialize from 'phpunserialize'

    export default {
        props: {
            job: {
                type: Object,
                required: true
            }
        },

        data: function() {
            return {
                modal: true,
            }
        },

        methods: {
            /**
             * Extract the job base name.
             */
            jobBaseName(name) {
                if (! name.includes('\\')) return name;

                var parts = name.split('\\');

                return parts[parts.length - 1];
            },

            /**
             * Format the given date with respect to timezone.
             */
            formatDate(unixTime) {
                return moment(unixTime * 1000).add(new Date().getTimezoneOffset() / 60);
            },

            /**
             * Convert to human readable timestamp.
             */
            readableTimestamp(timestamp) {
                return this.formatDate(timestamp).format('YYYY-MM-DD HH:mm:ss');
            },

            /**
             * Checks if a modal needs to be open.
             */
            visibleModal(job) {
                return this.modal && this.modal.id == job.id;
            },

            /**
             * Open a modal.
             */
            openModal(job) {
                this.modal = job;
            },

            /**
             * Close a modal.
             */
            closeModal() {
                this.modal = null;
            },

            /**
             * Pretty print serialized job.
             *
             * @param data
             * @returns {string}
             */
            prettyPrintJob(data) {
                return data.command && ! data.command.includes('CallQueuedClosure')
                    ? phpunserialize(data.command)
                    : data;
            }
        },

        computed: {
            unserialized() {
                return phpunserialize(this.job.payload.data.command);
            },

            delayed() {
                if (this.unserialized && this.unserialized.delay){
                    return moment.utc(this.unserialized.delay.date).fromNow(true);
                }

                return null;
            },
        },
    }
</script>
