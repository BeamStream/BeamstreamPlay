BS.Option = Backbone.Model.extend({
 
	idAttribute: "_id",
	defaults: {
    	
		optionId:null,
		optionData:null,
         
    },
});

BS.OptionCollection = Backbone.Collection.extend({
    model: BS.Option,
});
