<?php

namespace Appstract\NovaHorizon;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Laravel\Nova\Events\ServingNova;
use Laravel\Nova\Nova;

class NovaHorizonServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'nova-horizon-tool');

        $this->app->booted(function () {
            $this->routes();
        });

        Nova::serving(function (ServingNova $event) {
            Nova::provideToScript([
                'novaHorizon' => [
                    'basePath' => config('horizon.path'),
                ]
            ]);

            Nova::script('nova-horizon-cards', __DIR__.'/../dist/js/cards.js');
            Nova::style('nova-horizon-cards', __DIR__.'/../dist/css/cards.css');
        });
    }

    /**
     * Register the card's routes.
     *
     * @return void
     */
    protected function routes()
    {
        if ($this->app->routesAreCached()) {
            return;
        }

        // Cards
        Route::middleware(['nova'])
            ->prefix('nova-vendor/nova-horizon')
            ->group(__DIR__.'/../routes/api.php');

        // Tool
        Route::middleware(['nova', Authorize::class])
            ->prefix('nova-vendor/nova-horizon')
            ->group(__DIR__.'/../routes/authorized.php');
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
