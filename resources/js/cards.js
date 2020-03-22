import VueJsonPretty from 'vue-json-pretty';

window.NovaHorizon = {
    basePath: '/horizon',
}

Nova.booting((Vue, router, store) => {
    Vue.component('nova-horizon-card-stats', require('./components/Cards/Stats'));
    Vue.component('nova-horizon-card-workload', require('./components/Cards/Workload'));
    Vue.component('nova-horizon-card-pending-jobs', require('./components/Cards/PendingJobs'));
    Vue.component('nova-horizon-card-completed-jobs', require('./components/Cards/CompletedJobs'));
    Vue.component('nova-horizon-card-failed-jobs', require('./components/Cards/FailedJobs'));

    Vue.component('nova-horizon-card-jobs-per-minute', require('./components/Cards/JobsPerMinute'));
    Vue.component('nova-horizon-card-recent-jobs-count', require('./components/Cards/RecentJobsCount'));
    Vue.component('nova-horizon-card-failed-jobs-count', require('./components/Cards/FailedJobsCount'));
    Vue.component('nova-horizon-card-status', require('./components/Cards/Status'));
    Vue.component('nova-horizon-card-total-processes', require('./components/Cards/TotalProcesses'));
    Vue.component('nova-horizon-card-max-wait-time', require('./components/Cards/MaxWaitTime'));
    Vue.component('nova-horizon-card-max-runtime', require('./components/Cards/maxRuntime'));
    Vue.component('nova-horizon-card-max-throughput', require('./components/Cards/MaxThroughput'));

    Vue.component('nova-horizon-stack-trace', require('./components/StackTrace'));
    Vue.component('nova-horizon-json-pretty', VueJsonPretty);
});
