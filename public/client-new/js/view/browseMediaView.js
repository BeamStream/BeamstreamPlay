define(['pageView',
		'view/filesOverView'

        ],function(PageView,FilesOverView){
	
	var BrowseMediaView;
	BrowseMediaView = PageView.extend({
		objName: 'BrowseMediaView',
		events:{
			'click #view-by-list li' : 'selectViewByAll',
	      	'click #view-by-date-list' : 'selectViewByDate',
	      	'click #view-files-byrock-list' : 'selectViewByRock',
	      	'click #category-list li' :'sortBycategory',
	      	'click .browse-right a' :'selectViewStyle',
          'click .downloadbutton' :'download'
		},

	  	/**
       	*  view files 
       	*/
	 	selectViewByAll: function(eventName){

         	eventName.preventDefault();
         	$('#view-by-select').text($(eventName.target).text());
	        $('#view-by-select').attr('value',$(eventName.target).attr('value'));
	        // filesOverView = new FilesOverView({el: $('#grid')});
	        // if($(eventName.target).attr('value') == "docType"){
	        // 	$('#grid').attr('name','overPage');
         //        filesOverView.data.url = '/recentMedia';
                
	        // }
	        // if($(eventName.target).attr('value') == "all"){
	        	
	        // 	$('#grid').attr('name','allFiles');
         //        filesOverView.data.url = '/AllFilesForAUser';
                
         //    }


      	},

  	 	/**
      	*  view files by date 
      	*/
      	selectViewByDate: function(eventName){
    	 	eventName.preventDefault();
         	$('#view-by-date-select').text($(eventName.target).text());
      	}, 

      	/**
       	* view files 
       	*/
      	selectViewByRock: function(eventName){
         	eventName.preventDefault();
         	$('#view-files-byrock-select').text($(eventName.target).text());
      	},
           
  	 	/**
       	*sort files by category
       	*/
      	sortBycategory: function(eventName){
    	 	eventName.preventDefault();
         	$('#category-list-select').text($(eventName.target).text());
      	},

      	/**
       	* select files view style
       	*/
      	selectViewStyle: function(eventName){
         	eventName.preventDefault();
         	$('.browse-right a.activebtn').removeClass('activebtn');
         	$(eventName.target).parents('a').addClass('activebtn');
      	},

        /**
         * function to download files
        */
         
         download:function(eventName){
          
            eventName.preventDefault();           
            window.location = $('#dwnload-url').attr('value');  
         },
	});
	return BrowseMediaView
});