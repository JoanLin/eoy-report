"use strict";

const State = require("ampersand-state");
const moment = require("moment");
require("moment-duration-format");
const numeral = require("numeral");

module.exports = State.extend({
	props: {
		title: {
			type: "string"
		},
		value: {
			type: "any"
		},
		value_type: {
			type: "string"
		},
		alt_text: {
			type: "string"
		},
		date: {
			type: "string"
		}
	},
	derived: {
		value_formatted: {
			deps: ["value", "value_type"],
			fn: function() {
				
				let formattedValue = this.value;
				let duration = null;
				
				switch (this.value_type) {
					case "m":
					case "km":
						//formattedValue = this.value;
						formattedValue = numeral(this.value).format('0,0[.]00');
						break;
					case "min":
					case "mins":
					case "minute":
					case "minutes":
						duration = moment.duration(this.value, "minutes");
						formattedValue = duration.format("m:ss");
						break;
					case "h":
					case "hr":
					case "hrs":
					case "hours":
						duration = moment.duration(this.value, "hours");
						formattedValue = duration.format("h:mm");
						break;
					default:
					
						if (!isNaN(this.value)) {
							formattedValue = numeral(this.value).format('0,0[.]00');
						} else {
							formattedValue = formattedValue.toString();
						}
				}
				
				return formattedValue;
			}
		},
		date_formatted: {
			deps: ["date"],
			fn: function() {
				if (!this.date) {
					return "";
				}
				
				return moment(this.date).format("LL");
			}
		}
	}
});

