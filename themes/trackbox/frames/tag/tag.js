function getTagCategories() {
	var categories = [];
	for (var i = 0; i < listings.tags.length; i++) {
		if (categories.indexOf(listings.tags[i].category) == -1) {
			categories.push(listings.tags[i].category);
		}
	}
	return categories;
}
function getTagNamesByCategory(categoryName) {
	var names = [];
	var population = [];
	for (var i = 0; i < listings.tags.length; i++) {
		if (listings.tags[i].category == categoryName) {
			names.push(listings.tags[i].name);
			population.push(listings.tags[i].population);
		}
	}
	var tags = {};
	tags.names = names;
	tags.population = population;
	return tags;
}