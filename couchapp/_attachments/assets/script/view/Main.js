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
    require('facebook');
    var FBPhotoCard = require('view/FBPhotoCard');

    return Backbone.View.extend({
        events: {

        },
        mainTemplate: mainTemplate,
        initialize: function() {
            this.friends = new Backbone.Collection();
            this.posts = new Backbone.Collection();
            this.photoLocationPosts = new Backbone.Collection();

            this.render();

            this.photoCardView = new FBPhotoCard({
                el: '#content',
                collection: this.photoLocationPosts
            });

            // init the FB JS SDK
            FB.init({
                appId: '607189369343109', // App ID from the app dashboard
                channelUrl: '//csbrandt.cloudant.com/photofeed/_design/couchapp/channel.html', // Channel file for x-domain comms
                status: true, // Check Facebook Login status
                xfbml: true // Look for social plugins on the page
            });

            // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
            // for any authentication related change, such as login, logout or session refresh. This means that
            // whenever someone who was previously logged out tries to log in again, the correct case below 
            // will be handled. 
            FB.Event.subscribe('auth.authResponseChange', function(response) {
                // Here we specify what we do with the response anytime this event occurs. 
                if (response.status === 'connected') {
                    // The response object is returned with a status field that lets the app know the current
                    // login status of the person. In this case, we're handling the situation where they 
                    // have logged in to the app.

                    FB.getLoginStatus(function(response) {
                        console.log(response);
                    });

                    FB.api('/me/permissions', function(response) {
                        console.log(response);
                    });

                    this.getGraphData();

                } else if (response.status === 'not_authorized') {
                    // In this case, the person is logged into Facebook, but not into the app, so we call
                    // FB.login() to prompt them to do so. 
                    // In real-life usage, you wouldn't want to immediately prompt someone to login 
                    // like this, for two reasons:
                    // (1) JavaScript created popup windows are blocked by most browsers unless they 
                    // result from direct interaction from people using the app (such as a mouse click)
                    // (2) it is a bad experience to be continually prompted to login upon page load.
                    FB.login(function(response) {

                    }, 
                    {
                        scope: 'read_stream'
                    });
                } else {
                    // In this case, the person is not logged into Facebook, so we call the login() 
                    // function to prompt them to do so. Note that at this stage there is no indication
                    // of whether they are logged into the app. If they aren't then they'll see the Login
                    // dialog right after they log in to Facebook. 
                    // The same caveats as above apply to the FB.login() call here.
                    FB.login(function(response) {

                    }, 
                    {
                        scope: 'read_stream'
                    });
                }
            }.bind(this));

        },
        render: function() {
            var mainTemplate = Handlebars.compile(this.mainTemplate);

            this.$el.append(mainTemplate());
        },
        getGraphData: function() {
            // * get friends
            FB.api('/me/friends', function(response) {
                this.friends.reset(response.data);
            }.bind(this));
            // * get feed for each friend
            this.friends.on('reset', this.getFeeds, this);
            // - Why do we get each friend's feed and not our own?
            // - Limited amount of objects containing a location object to geolocate.
            // -- If we go through each friends feed and only get what has location,
            // -- then we have enough to build a resonable feed.
            // * find all objects with location
            this.posts.on('add', this.addPhotoLocationPost, this);
        },
        getFeeds: function(friends) {
            friends.each(function(friend, index, list) {
                FB.api('/' + friend.get('id') + '/feed', function(response) {
                    this.posts.add(response.data);
                }.bind(this));
            }.bind(this));
        },
        addPhotoLocationPost: function(post) {
            if (post.get('place') && post.get('type') === 'photo') {
                this.photoLocationPosts.add(post);
            }
        }

    });

});