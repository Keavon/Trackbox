tb.copyJSON = function (JSONToCopy) {
	// Ugly hack to avoid refrence passing of Arrays and JSON Object
	if(JSONToCopy !== undefined) {
		return $.parseJSON(JSON.stringify(JSONToCopy));
	} else {
		return {};
	}
};
