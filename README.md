# Laravel Stock

[![Latest Version on Packagist](https://img.shields.io/packagist/v/appstract/nova-horizon.svg?style=flat-square)](https://packagist.org/packages/appstract/nova-horizon)
[![Total Downloads](https://img.shields.io/packagist/dt/appstract/nova-horizon.svg?style=flat-square)](https://packagist.org/packages/appstract/nova-horizon)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

Add Horizon statistics to your Nova dashboard.

![dashboard](https://appstract.github.io/nova-horizon/docs/dashboard.png)

## Installation

You can install the package via composer:

``` bash
composer require appstract/nova-horizon
```

## Usage

There are two ways to use this package. One is to enable the Horizon dashboard in your application's `NovaServiceProvider`. This will add a new dashboard to Nova, shown in the screenshot above.

```php
class NovaServiceProvider extends NovaApplicationServiceProvider
{
    protected function dashboards()
    {
        return [
            new \Appstract\NovaHorizon\Dashboard,
        ];
    }
}
```

Second way is by adding cards to your own dashboard(s).

```php
class NovaServiceProvider extends NovaApplicationServiceProvider
{
    protected function dashboards()
    {
        return [
            // Like the dashboard
            new \Appstract\NovaHorizon\Cards\Stats,
            new \Appstract\NovaHorizon\Cards\RecentJobs,
            new \Appstract\NovaHorizon\Cards\Workload,
            new \Appstract\NovaHorizon\Cards\FailedJobs,

            // Stats as seperate cards
            new \Appstract\NovaHorizon\Cards\JobsPerMinute,
            new \Appstract\NovaHorizon\Cards\RecentJobsCount,
            new \Appstract\NovaHorizon\Cards\FailedJobsCount,
            new \Appstract\NovaHorizon\Cards\Status,
            new \Appstract\NovaHorizon\Cards\TotalProcesses,
            new \Appstract\NovaHorizon\Cards\MaxWaitTime,
            new \Appstract\NovaHorizon\Cards\MaxRuntime,
            new \Appstract\NovaHorizon\Cards\MaxThroughput,
        ];
    }
}
```

## Contributing

Contributions are welcome, [thanks to y'all](https://github.com/appstract/nova-horizon/graphs/contributors) :)

## About Appstract

Appstract is a small team from The Netherlands. We create (open source) tools for Web Developers and write about related subjects on [Medium](https://medium.com/appstract). You can [follow us on Twitter](https://twitter.com/appstractnl), [buy us a beer](https://www.paypal.me/appstract/10) or [support us on Patreon](https://www.patreon.com/appstract).

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
