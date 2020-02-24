<script>
    export default {
        /**
         * The component's data.
         */
        data() {
            return {
                searchQuery: '',
                searchTimeout: null,
                ready: false,
                loadingNewEntries: false,
                hasNewEntries: false,
                page: 1,
                perPage: 50,
                totalPages: 1,
                jobs: [],
                retryingJobs: [],
            };
        },

        /**
         * Prepare the component.
         */
        mounted() {
            this.loadJobs();

            this.refreshJobsPeriodically();
        },

        /**
         * Clean after the component is destroyed.
         */
        destroyed() {
            clearInterval(this.interval);
        },


        /**
         * Watch these properties for changes.
         */
        watch: {
            '$route'() {
                this.page = 1;

                this.loadJobs();
            },

            searchQuery() {
                clearTimeout(this.searchTimeout);
                clearInterval(this.interval);

                this.searchTimeout = setTimeout(() => {
                    this.loadJobs();
                    this.refreshJobsPeriodically();
                }, 500);
            }
        },


        methods: {
            /**
             * Load the jobs of the given tag.
             */
            loadJobs(starting = 0, refreshing = false) {
                if (!refreshing) {
                    this.ready = false;
                }

                var tagQuery = this.searchQuery ? 'tag=' + this.searchQuery + '&' : '';

                Nova.request().get(NovaHorizon.basePath + '/api/jobs/failed?' + tagQuery + 'starting_at=' + starting)
                    .then(response => {
                        if (!this.$root.autoLoadsNewEntries && refreshing && !response.data.jobs.length) {
                            return;
                        }


                        if (!this.$root.autoLoadsNewEntries && refreshing && this.jobs.length && _.first(response.data.jobs).id !== _.first(this.jobs).id) {
                            this.hasNewEntries = true;
                        } else {
                            this.jobs = response.data.jobs;

                            this.totalPages = Math.ceil(response.data.total / this.perPage);
                        }

                        this.ready = true;
                    });
            },


            loadNewEntries() {
                this.jobs = [];

                this.loadJobs(0, false);

                this.hasNewEntries = false;
            },


            /**
             * Retry the given failed job.
             */
            retry(id) {
                if (this.isRetrying(id)) {
                    return;
                }

                this.retryingJobs.push(id);

                Nova.request().get(NovaHorizon.basePath + '/api/jobs/retry/' + id)
                    .then((response) => {
                        setTimeout(() => {
                            this.retryingJobs = _.reject(this.retryingJobs, job => job == id);
                        }, 5000);
                    });
            },


            /**
             * Determine if the given job is currently retrying.
             */
            isRetrying(id) {
                return _.includes(this.retryingJobs, id);
            },


            /**
             * Determine if the given job has completed.
             */
            hasCompleted(job) {
                return _.find(job.retried_by, retry => retry.status == 'completed');
            },


            /**
             * Refresh the jobs every period of time.
             */
            refreshJobsPeriodically() {
                this.interval = setInterval(() => {
                    this.loadJobs((this.page - 1) * this.perPage, true);
                }, 3000);
            },

            /**
             * Extract the job base name.
             */
            jobBaseName(name) {
                if (!name.includes('\\')) return name;

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
             * Load the jobs for the previous page.
             */
            previous() {
                this.loadJobs(
                    (this.page - 2) * this.perPage
                );

                this.page -= 1;

                this.hasNewEntries = false;
            },


            /**
             * Load the jobs for the next page.
             */
            next() {
                this.loadJobs(
                    this.page * this.perPage
                );

                this.page += 1;

                this.hasNewEntries = false;
            }
        }
    }
</script>

<template>
    <card>
        <div class="flex items-center justify-between p-3">
            <h5 class="text-base text-80 font-bold">Failed Jobs</h5>
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Search Tags"
                style="width: 200px"
                class="form-control form-input form-input-bordered"
            >
        </div>

        <div v-if="!ready" class="d-flex align-items-center justify-content-center card-bg-secondary p-5 bottom-radius">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="icon spin mr-2 fill-text-color">
                <path d="M12 10a2 2 0 0 1-3.41 1.41A2 2 0 0 1 10 8V0a9.97 9.97 0 0 1 10 10h-8zm7.9 1.41A10 10 0 1 1 8.59.1v2.03a8 8 0 1 0 9.29 9.29h2.02zm-4.07 0a6 6 0 1 1-7.25-7.25v2.1a3.99 3.99 0 0 0-1.4 6.57 4 4 0 0 0 6.56-1.42h2.1z"></path>
            </svg>

            <span>Loading...</span>
        </div>


        <div v-if="ready && jobs.length == 0" class="d-flex flex-column align-items-center justify-content-center card-bg-secondary p-5 bottom-radius">
            <span>There aren't any failed jobs.</span>
        </div>

        <div class="overflow-hidden overflow-x-auto relative" v-if="jobs.length">
            <table class="table w-full">
                <thead>
                    <tr>
                        <th class="text-left">Job</th>
                        <th class="text-left">Runtime</th>
                        <th class="text-left">Failed At</th>
                        <th class="text-right">Retry</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-if="hasNewEntries" key="newEntries" class="dontanimate">
                        <td colspan="100" class="text-center card-bg-secondary py-1">
                            <small><a href="#" v-on:click.prevent="loadNewEntries" v-if="!loadingNewEntries">Load New Entries</a></small>

                            <small v-if="loadingNewEntries">Loading...</small>
                        </td>
                    </tr>

                    <tr v-for="job in jobs" :key="job.id">
                        <td>
                            <span v-if="job.status != 'failed'" :title="job.name">{{jobBaseName(job.name)}}</span>
                            <router-link v-if="job.status === 'failed'" :title="job.name" :to="{ name: 'failed-jobs-preview', params: { jobId: job.id }}">
                                {{ jobBaseName(job.name) }}
                            </router-link>
                            <br>

                            <small class="text-muted">
                                Queue: {{job.queue}}
                                <span v-if="job.payload && job.payload.tags.length">
                                    | Tags: {{ job.payload.tags && job.payload.tags.length ? job.payload.tags.join(', ') : '' }}
                                </span>
                            </small>
                        </td>

                        <td class="table-fit">
                            <span>{{ job.failed_at ? String((job.failed_at - job.reserved_at).toFixed(2))+'s' : '-' }}</span>
                        </td>

                        <td class="table-fit">
                            {{ readableTimestamp(job.failed_at) }}
                        </td>

                        <td class="text-right table-fit">
                            <a href="#" @click.prevent="retry(job.id)" v-if="!hasCompleted(job)">
                                <svg class="fill-primary" viewBox="0 0 20 20" style="width: 1.5rem; height: 1.5rem;" :class="{spin: isRetrying(job.id)}">
                                    <path d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"/>
                                </svg>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="ready && jobs.length" class="flex justify-between p-3">
            <button @click="previous" class="btn btn-secondary btn-md" :disabled="page==1">Previous</button>
            <button @click="next" class="btn btn-secondary btn-md" :disabled="page>=totalPages">Next</button>
        </div>
    </card>
</template>