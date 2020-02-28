window.NovaHorizon = {
    basePath: '/horizon',
}

Nova.booting((Vue, router, store) => {
    router.addRoutes([
        {
          name: 'nova-horizon',
          path: '/horizon',
          component: require('./components/Tool'),
        },
    ])
});
