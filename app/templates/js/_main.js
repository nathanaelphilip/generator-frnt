'use strict';

var $ = jQuery;

window.APP = {
	init: function(){},
	data: {
		views: {
			drawer: {},
			poem: {}
		},
		collections: {}
	},
	state: {},
	events: {},
	backbone: {
		models: {},
		collections: {},
		views: {
			home: {},
			drawer: {},
			poem: {},
			popup: {},
			browse: {},
			submit: {}
		},
		routers: {}
	},
	mixins: {
		views: {
			assign : function (view, selector) {
	    		view.setElement(this.$(selector)).render();
			},
			validateEmail: function (email) {
			    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			    return re.test(email);
			}
		}
	}
}

// set up events so we can trigger things
_.extend(APP.events, Backbone.Events);
