'use strict';

L.Control.Geocoder.AddOk = L.Class.extend({
	options: {
		serviceUrl: 'http://api-adresse.data.gouv.fr',
		limit: 6,
		htmlTemplate: function(r) {
			var parts = [];

			/* some available classes:
				leaflet-control-geocoder-address-detail
				leaflet-control-geocoder-address-context
			*/
			parts.push('{label}');
			parts.push('<span class="' + (parts.length > 0 ? 'leaflet-control-geocoder-address-detail' : '') +
					'">{type}: {postcode} {city}</span>');

			return L.Control.Geocoder.template(parts.join('<br/>'), r, true);
		}

	},

	initialize: function(options) {
		L.setOptions(this, options);
	},

	geocode: function(query, cb, context) {

		var params = L.extend({
			q: query,
			limit: this.options.limit
		}, this.options.geocodingQueryParams);
		var that = this ;
		L.Control.Geocoder.getJSON(this.options.serviceUrl+'/search/', params, function(data) {
			var results = [],
				i,
				f,
				c,
				latLng,
				extent,
				bbox;
			if (data && data.features) {
				for (i = 0; i < data.features.length; i++) {
					f = data.features[i];
					c = f.geometry.coordinates;
					latLng = L.latLng(c[1], c[0]);
					extent = f.properties.extent;

					if (extent) {
						bbox = L.latLngBounds([extent[1], extent[0]], [extent[3], extent[2]]);
					} else {
						bbox = L.latLngBounds(latLng, latLng);
					}

					results.push({
						name: f.properties.name,
						center: latLng,
						bbox: bbox,
						html: that.options.htmlTemplate ?
							that.options.htmlTemplate(f.properties)
							: undefined
					});
				}
			}

			cb.call(context, results);
		});
	},

	suggest: function(query, cb, context) {
		return this.geocode(query, cb, context);
	},

	reverse: function(location, scale, cb, context) {
		var params = L.extend({
			lat: location.lat,
			lon: location.lng
		}, this.options.reverseQueryParams);
		var that = this ;
		L.Control.Geocoder.getJSON(this.options.serviceUrl+'/reverse/', params, function(data) {
			var results = [],
				i,
				f,
				c,
				latLng,
				extent,
				bbox;
			if (data && data.features) {
				for (i = 0; i < data.features.length; i++) {
					f = data.features[i];
					c = f.geometry.coordinates;
					latLng = L.latLng(c[1], c[0]);
					extent = f.properties.extent;

					if (extent) {
						bbox = L.latLngBounds([extent[1], extent[0]], [extent[3], extent[2]]);
					} else {
						bbox = L.latLngBounds(latLng, latLng);
					}

					results.push({
						name: f.properties.name,
						center: latLng,
						bbox: bbox,
						html: that.options.htmlTemplate ?
							that.options.htmlTemplate(f.properties)
							: undefined
					});
				}
			}

			cb.call(context, results);
		});
	}
});

L.Control.Geocoder.addok = function(options) {
	return new L.Control.Geocoder.AddOk(options);
};
