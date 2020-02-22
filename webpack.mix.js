let mix = require('laravel-mix')

// Cards

mix
  .setPublicPath('dist')
  .js('resources/js/cards.js', 'js')
  .sass('resources/sass/cards.scss', 'css');

// Tool

mix
  .setPublicPath('dist')
  .js('resources/js/tool.js', 'js')
  .sass('resources/sass/tool.scss', 'css');