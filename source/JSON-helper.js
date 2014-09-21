tb.copyJSON = function (JSONToCopy) {
	// Ugly hack to avoid refrence passing of Arrays and JSON Object
	return $.parseJSON(JSON.stringify(JSONToCopy));
};
