<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;

use App\WebsiteSetting;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $socmeds = WebsiteSetting::where('key', 'LIKE', 'socmed.%')->get();

        $keyed = $socmeds->mapWithKeys(function ($setting) {
            $soc = str_replace('socmed.', '', $setting->key);
            return [$soc => $setting->value];
        });

        View::share('socmeds', $keyed->all());
    }
}
