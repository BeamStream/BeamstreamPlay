define(['view/formView'], function(FormView){
	var PersonView;
	PersonView = FormView.extend({
		objName: 'PersonView',
		events : {
			'click #save' : 'SaveData',
			'click #singleFieldValidation' : 'validateSingleField',
			'click #setField' : 'setSingleField',
			'click #setCollection': 'setCollection'
			
		},
		
		onAfterInit: function(){
			
			//this.data.reset();
		},
		/**
		 * save form data
		 */
		SaveData: function(){
//			dataToSave.isValid(true)
//			console.log(this.getModel());
			this.saveForm();
		},
		
		/**
		 * @TODO how to validate single field ?
		 */
		validateSingleField: function(){
			alert("validate Single Field");
		},
		
		/**
		 * @TODO how to set an attribute to model
		 * like http://documentcloud.github.com/backbone/#Model-set
		 */
		setSingleField: function(){
			this.data.models[0].set('firstName', "Viet");
			this.render();
			console.log(this.data.models[0])
		},
		setCollection: function(){
			this.set({firstName: 'John', lastName: 'Doe'});
			console.log(this.data.models[0])
		}
	})
	return PersonView;
});