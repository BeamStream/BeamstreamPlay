Handlebars.registerHelper('pluralize', function(number, item){
	if (number === 1){
		return number + ' ' + item;
	} else {
		return number + ' ' + item + 's';
	}
});