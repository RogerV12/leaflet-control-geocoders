'use strict';

L.Control.Geocoder.Mapbox = L.Class.extend({
	options: {
		service_url: 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places-v1/'
	},

	initialize: function(access_token) {
		this._access_token = access_token;
	},

	geocode: function(query, cb, context) {
		L.Control.Geocoder.getJSON(this.options.service_url + encodeURIComponent(query) + '.json', {
			access_token: this._access_token,
		}, function(data) {
			var results = [],
			loc,
			latLng,
			latLngBounds;
			if (data.features && data.features.length) {
				for (var i = 0; i <= data.features.length - 1; i++) {
					loc = data.features[i];
					latLng = L.latLng(loc.center.reverse());
					if(loc.hasOwnProperty('bbox'))
					{
						latLngBounds = L.latLngBounds(L.latLng(loc.bbox.slice(0, 2).reverse()), L.latLng(loc.bbox.slice(2, 4).reverse()));
					}
					else
					{
						latLngBounds = L.latLngBounds(latLng, latLng);
					}
					results[i] = {
						name: loc.place_name,
						bbox: latLngBounds,
						center: latLng
					};
				}
			}

			cb.call(context, results);
		});
	},

	suggest: function(query, cb, context) {
		return this.geocode(query, cb, context);
	},

	reverse: function(location, scale, cb, context) {
		L.Control.Geocoder.getJSON(this.options.service_url + encodeURIComponent(location.lng) + ',' + encodeURIComponent(location.lat) + '.json', {
			access_token: this._access_token,
		}, function(data) {
			var results = [],
			loc,
			latLng,
			latLngBounds;
			if (data.features && data.features.length) {
				for (var i = 0; i <= data.features.length - 1; i++) {
					loc = data.features[i];
					latLng = L.latLng(loc.center.reverse());
					if(loc.hasOwnProperty('bbox'))
					{
						latLngBounds = L.latLngBounds(L.latLng(loc.bbox.slice(0, 2).reverse()), L.latLng(loc.bbox.slice(2, 4).reverse()));
					}
					else
					{
						latLngBounds = L.latLngBounds(latLng, latLng);
					}
					results[i] = {
						name: loc.place_name,
						bbox: latLngBounds,
						center: latLng
					};
				}
			}

			cb.call(context, results);
		});
	}
});

L.Control.Geocoder.mapbox = function(access_token) {
		return new L.Control.Geocoder.Mapbox(access_token);
};
