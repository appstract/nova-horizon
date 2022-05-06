window.NovaHorizon = {
    basePath: '/horizon',
}

Nova.booting((Vue) => {
    Nova.inertia('NovaHorizonDashboard', require('./components/Tool').default)
})
