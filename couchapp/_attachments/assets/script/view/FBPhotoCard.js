/** @file FBPhotoCard.js
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
    var headerTemplate = require('text!../../template/user_header.html');
    var photoTemplate = require('text!../../template/photo.html');
    var locationTemplate = require('text!../../template/location.html');

    return Backbone.View.extend({
    	headerTemplate: headerTemplate,
    	photoTemplate: photoTemplate,
    	locationTemplate: locationTemplate,
        events: {

        },
        initialize: function() {
        	this.collection.on('add', this.render, this);
        },
        render: function(model) {
        	var $cardContainer = $('<div></div>');
        	$cardContainer.addClass('card-container');

        	// insert from newest to oldest,
        	// inserting into dom as the models are added

        	this.$el.append($cardContainer);
        }
    });
});