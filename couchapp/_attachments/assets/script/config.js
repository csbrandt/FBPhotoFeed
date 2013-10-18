/** @file config.js
 *  @fileOverview Program driver. Configures path aliases and calls app.initialize()
 *  @author cs_brandt
 *  @date 10/16/2013
 */


require.config(
{
   paths: 
   {
      text: '../vendor/text/text',
      jquery: '../vendor/jquery/jquery-2.0.3.min',
      lodash: '../vendor/lodash/lodash.min',
      backbone: '../vendor/backbone/backbone-min',
      handlebars: '../vendor/handlebars/handlebars',
      ink: '../vendor/ink-2.2.1/js/ink.min',
      facebook: '//connect.facebook.net/en_US/all'
   },
   shim:
   {
      backbone: 
      {
         deps: ['underscore', 'jquery'],
         exports: 'Backbone'
      },
      lodash:
      {
         exports: "_"
      },
      handlebars: 
      {
         exports: 'Handlebars'
      },
      facebook : 
      {
         exports: 'FB'
      }

   },
   map: 
   {
      '*': 
      {
         'underscore': 'lodash'
      } 
   }

});

require(['app'], function(app)
{
   app.initialize();

});