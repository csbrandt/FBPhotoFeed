/** @file Main.js
 *  @fileOverview
 *  @author cs_brandt
 *  @date 10/16/2013
 */


define(function(require) {
   "use strict";
   // dependencies
   var $ = require('jquery');
   var _ = require('lodash');
   var Backbone = require('backbone');
   var Handlebars = require('handlebars');
   var mainTemplate = require('text!../../template/main.html');

   return Backbone.View.extend({
      events: {

      },
      mainTemplate: mainTemplate,
      initialize: function() {
         this.render();
      },
      render: function() {
         var mainTemplate = Handlebars.compile(this.mainTemplate);

         this.$el.html(mainTemplate());
      }

   });

 });
