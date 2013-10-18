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
    require('facebook');
    require('timeago');
    var headerTemplate = require('text!../../template/user_header.html');
    var photoTemplate = require('text!../../template/photo.html');
    var locationTemplate = require('text!../../template/location.html');
    var cardTemplate = require('text!../../template/card.html');

    return Backbone.View.extend({
        headerTemplate: headerTemplate,
        photoTemplate: photoTemplate,
        locationTemplate: locationTemplate,
        cardTemplate: cardTemplate,
        events: {

        },
        initialize: function() {
            this.collection.on('add', this.render, this);
        },
        render: function(model) {
            var $cardContainer = $(this.cardTemplate);
            this.model = model;
            this.model.set('timeago', $.timeago(this.model.get('created_time')));
            var headerTemplate = Handlebars.compile(this.headerTemplate);
            var photoTemplate = Handlebars.compile(this.photoTemplate);
            var locationTemplate = Handlebars.compile(this.locationTemplate);

            if (this.model.get('likes')) {
            	this.model.set('numLikes', this.model.get('likes').data.length);
            }
            else {
            	this.model.set('numLikes', 0);
            }

            if (this.model.get('comments')) {
            	this.model.set('numComments', this.model.get('comments').data.length);
            }
            else {
            	this.model.set('numComments', 0);
            }

            var appendTemplates = function() {
            	var modelJSON = this.model.toJSON();

            	$cardContainer.append(headerTemplate(modelJSON));
            	$cardContainer.append(photoTemplate(modelJSON));
            	$cardContainer.append(locationTemplate(modelJSON));

                this.$el.append($cardContainer);
            }.bind(this);

            // get
            // user profile pic
            // photo
            // static maps
            // then render the card
            $.when(this.getProfilePicture(this.model.get('from').id),
                //this.getStaticMapSrc,
                this.getPhotoSrc(this.model.get('object_id'))).then().done(appendTemplates);

            // insert from newest to oldest,
            // inserting into dom as the models are added


        },
        getProfilePicture: function(id) {
            var deferred = $.Deferred();

            FB.api(id + '?fields=picture', function(response) {
                this.model.set('userProfilePictureSrc', response.picture.data.url);
                deferred.resolve();
            }.bind(this));

            return deferred;
        },
        getStaticMapSrc: function() {
            var deferred = $.Deferred();

            return deferred;
        },
        getPhotoSrc: function(object_id) {
            var deferred = $.Deferred();

            FB.api(object_id, function(response) {
            	this.model.set('photoSrc', response.source);
            	this
            	deferred.resolve();
            }.bind(this));

            return deferred;
        }
    });
});