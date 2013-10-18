/** @file app.js
 *  @fileOverview App initialization.
 *  @author cs_brandt
 *  @date 01/26/2013 
 */

define(function(require)
{
   "use strict";
   // dependencies
   var _ = require('lodash');
   var Backbone = require('backbone');
   var MainView = require('view/Main'); 

   return {

      initialize: function()
      {
         // app starts here
         this.mainView = new MainView({
            el: 'body'
         });
      }

   };

});
