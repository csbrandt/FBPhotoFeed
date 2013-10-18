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

            var appendTemplates = function(modelJSON) {
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
            $.when(this.getProfilePicture(this.model.toJSON())).then(this.getPhotoSrc).done(appendTemplates);
            
            // todo
            // insert from newest to oldest,
            // inserting into dom as the models are added

        },
        getProfilePicture: function(currentModelJSON) {
            var deferred = new $.Deferred();

            FB.api(currentModelJSON.from.id + '?fields=picture', function(response) {
                currentModelJSON.userProfilePictureSrc = response.picture.data.url;
                deferred.resolve(currentModelJSON);
            }.bind(this));

            return deferred.promise();
        },
        getPhotoSrc: function(currentModelJSON) {
            var deferred = new $.Deferred();

            FB.api(currentModelJSON.object_id, function(response) {
                if (!response.error) {
                   currentModelJSON.photoSrc = response.source;
                   deferred.resolve(currentModelJSON);
                }
                else {
                   deferred.reject(response.error);
                }
            }.bind(this));

            return deferred.promise();
        }
    });
});