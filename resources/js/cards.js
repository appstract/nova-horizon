import VueJsonPretty from 'vue-json-pretty';

window.moment = require('moment')

window.NovaHorizon = {
    basePath: '/horizon',
}

Nova.booting((Vue, router, store) => {
    Vue.component('nova-horizon-card-stats', require('./components/Cards/Stats').default);
    Vue.component('nova-horizon-card-workload', require('./components/Cards/Workload').default);
    Vue.component('nova-horizon-card-pending-jobs', require('./components/Cards/PendingJobs').default);
    Vue.component('nova-horizon-card-completed-jobs', require('./components/Cards/CompletedJobs').default);
    Vue.component('nova-horizon-card-failed-jobs', require('./components/Cards/FailedJobs').default);

    Vue.component('nova-horizon-card-jobs-per-minute', require('./components/Cards/JobsPerMinute').default);
    Vue.component('nova-horizon-card-recent-jobs-count', require('./components/Cards/RecentJobsCount').default);
    Vue.component('nova-horizon-card-failed-jobs-count', require('./components/Cards/FailedJobsCount').default);
    Vue.component('nova-horizon-card-status', require('./components/Cards/Status').default);
    Vue.component('nova-horizon-card-total-processes', require('./components/Cards/TotalProcesses').default);
    Vue.component('nova-horizon-card-max-wait-time', require('./components/Cards/MaxWaitTime').default);
    Vue.component('nova-horizon-card-max-runtime', require('./components/Cards/maxRuntime').default);
    Vue.component('nova-horizon-card-max-throughput', require('./components/Cards/MaxThroughput').default);

    Vue.component('nova-horizon-stack-trace', require('./components/StackTrace').default);
    Vue.component('nova-horizon-json-pretty', VueJsonPretty);
});
