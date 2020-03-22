<?php

namespace Appstract\NovaHorizon;

use Appstract\NovaHorizon\Cards\CompletedJobs;
use Appstract\NovaHorizon\Cards\FailedJobs;
use Appstract\NovaHorizon\Cards\PendingJobs;
use Appstract\NovaHorizon\Cards\Stats;
use Appstract\NovaHorizon\Cards\Workload;
use Laravel\Nova\Dashboard as NovaDashboard;

class Dashboard extends NovaDashboard
{
    /**
     * Get the cards for the dashboard.
     *
     * @return array
     */
    public function cards()
    {
        return [
            new Stats,
            new Workload,
            new PendingJobs,
            new FailedJobs,
            new CompletedJobs,
        ];
    }

    public static function label()
    {
        return 'Horizon';
    }

    /**
     * Get the URI key for the dashboard.
     *
     * @return string
     */
    public static function uriKey()
    {
        return 'horizon';
    }
}
