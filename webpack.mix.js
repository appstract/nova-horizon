let mix = require('laravel-mix')

require('./nova.mix')

require('laravel-mix-tailwind');

mix
  .setPublicPath('dist')
  .js('resources/js/tool.js', 'js')
  .js('resources/js/cards.js', 'js')
  .vue({ version: 3 })
  .sass('resources/sass/tool.scss', 'css/tool.css')
  .sass('resources/sass/cards.scss', 'css/cards.css')
  .nova('appstract/nova-horizon')
  .tailwind()
