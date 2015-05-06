"use strict";

L.Control.Geocoder.Photon = L.Class.extend({
	options: {
		serviceUrl: '//photon.komoot.de/api/'
	},

	initialize: function(options) {
		L.setOptions(this, options);
	},

	geocode: function(query, cb, context) {
		var params = L.extend({
			q: query,
		}, this.options.geocodingQueryParams);

		L.Control.Geocoder.getJSON(this.options.serviceUrl, params, function(data) {
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
						bbox: bbox
					});
				}
			}

			cb.call(context, results);
		});
	},

	suggest: function(query, cb, context) {
		return this.geocode(query, cb, context);
	},

	reverse: function(latLng, cb, context) {
		// Not yet implemented in Photon
		// https://github.com/komoot/photon/issues/19
		cb.call(context, []);
	}
});

L.Control.Geocoder.photon = function(options) {
	return new L.Control.Geocoder.Photon(options);
};
