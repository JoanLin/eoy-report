"use strict";

const THREE = require("three");

const addPointsToPathOrShape = require("./add-points-to-path-or-shape.js");

module.exports = function addPolygonsToShape(shape) {
	return function(polygon, index) {
		if (!index) {
			polygon.forEach(addPointsToPathOrShape(shape));
		} else {
			const path = new THREE.Path(polygon.map((point) => new THREE.Vector2(point[0], point[1])));
			//polygon.forEach(addPointsToPathOrShape(path));

			shape.holes.push(path);
		}
	};
};
