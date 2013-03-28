define(['baseView',
        'text!templates/newStreamList.tpl',
        'text!templates/streamSlider.tpl',
        'text!templates/streamTitle.tpl',
        'text!templates/privateToList.tpl',
        '../../lib/jquery.simplyscroll'
        ],function(BaseView, NewStreamTpl,StreamList,StreamTitle, PrivateToList, simplyscroll){
	
    var streamSliderView; 
    streamSliderView = BaseView.extend({
    	
        objName: 'streamSliderView',
        streamId: null,
        events:{
        	 'click .close-btn' : 'closeStreamTab',
			 'click .cancel-btn' : 'closeRemoveOption',
			 'click .sortable li' : 'renderRightContenetsOfSelectedStream',
//			 'click .sortable li': 'setStreamId'
		},
                
        onAfterInit: function(){
        	
            this.data.reset();
            this.activeDiv = '<div class="active-curve"></div>';
            
        },
        
        /**
         * after render set scrolling effect
         */
        onAfterRender: function(){
        	this.slider();
        	$('#sortable4 li:first').addClass('active');
        	$('#sortable4 li:first').append(this.activeDiv);
        	
        	
        	/* render the stream title and description view based on selected stream */
        	$('.stream-header-left').attr('data-value',$('.sortable li.active').attr('id') );
        	
        	var streamName = $('.sortable li.active').attr('name');
        	var userCount =$('.sortable li.active').attr('data-userCount');
        	$('#select-privateTo').text(streamName);
        	$('#Q-privateTo-select').text(streamName);
        	
        	
        	var compiledTemplate = Handlebars.compile(StreamTitle);
			$('.stream-header-left').html(compiledTemplate({streamName: streamName ,userCount:userCount }));
			
			
			this.streamId = (this.data.models[0])?this.data.models[0].get('stream').id.id:null;
			this.myStreams = (this.data)?this.data:null;
		},
		
        /**
         * if there is no streams for a user then show another view
         */
        displayNoResult: function(callback){
			
			var compiledTemplate = Handlebars.compile(NewStreamTpl);
			this.$(".content").html(compiledTemplate);
			
		},
		
		/**
         * if there is a streams then add to the stream list
         */
		displayPage: function(callback){
			
			/* for the private to list section on Discussion and Question page */ 
			var listTemplate = Handlebars.compile(PrivateToList);
			$('.stream-list').html( listTemplate({data: this.data.toJSON()}));
//			$('#Q-privatelist').html(listTemplate({data: this.data.toJSON()}));
			
			/* render the left stream list */
			var compiledTemplate = Handlebars.compile(StreamList);
			this.$(".content").html( compiledTemplate(this.data.toJSON()));
			
		},
		setStreamId: function(e){
//			this.streamId = e.target.id;
		},
                     
        /**
        * slider effect for stream list
        */
        slider: function(){
        	
            var activeDiv = '<div class="active-curve"><img src="/beamstream-new/images/active-curve.png" width="20" height="58"></div>';
            $('span.close-btn').hide();     
            $('div.drag-icon').hide();
            $(".scroller").simplyScroll({
                    customClass: 'vert',
                    orientation: 'vertical',
                    auto: false,
                    manualMode: 'end',
                    frameRate: 20,
                    speed: 8,
            });		            
            var activeStream = '';            
            $(".done").toggle(function () {         
                    $('a.done').text('DONE');	
                    $('a.done').attr('data-value','inActive');
                    activeStream =  $('.sortable li.active').attr('id');
                    $('.sortable li.active').find('div.active-curve').remove();
                    $('.sortable li.active').removeClass('active');	      		     
                    $('.menu-count').hide();
                    $('span.close-btn').show();
                    $('div.drag-icon').show();
                    $('#sortable1, #sortable2').sortable();
                        $('#sortable3').sortable({
                                items: ':not(.disabled)'
                        });
                        $('#sortable-with-handles').sortable({
                            handle: '.handle'
                        });
                        $('#sortable4, #sortable5').sortable({
                            connectWith: '.connected'
                        });
		    },function () { 
		    	
                 $('a.done').text('EDIT');  
                 $('a.done').attr('data-value','active');
                 
                 $('.sortable li#'+activeStream).addClass('active');
     		     $('.sortable li.active').append(activeDiv);
     		     
                 $('span.close-btn').hide(); 
                 $('div.drag-icon').hide();
                 
                 $('.menu-count').show();
                 $('#sortable1').remove(); 
                 $('#sortable4, #sortable5').sortable('destroy');
                 $('li').removeAttr('draggable');
                 
                 /* remove if any red actvated stream li */
                 $("#sortable4 li").each(function(n) {
                    var streamId = $(this).attr('id');
                    var StreamName = $(this).attr('name');
                    var userCount = $(this).attr('data-userCount');
 	     	    	 if($(this).hasClass('red-active'))
 	     	    	 {
 	     	    		 
 	     	    		var removeOption = '<a  id ="'+streamId+'" name ="'+StreamName+'"  href="#" class="icon1">'+StreamName+'</a>'
 	     	    		+'<div class="drag-icon drag-rectangle" data-original-title="Drag To Rearrange" style="display: none;">'
 	     	    		+'<img src="images/menu-left-icon.png">'
 	     	    		+'</div>'
 	     	    		+'<span class="menu-count" > '+userCount+'</span>'
 	     	    		+'<span class="close-btn drag-rectangle" data-original-title="Delete" style="display: none;">'
 	     	    		+'<img src="images/close.png">'
 	     	    		+'</span>';
 	     	    		 
 	     	    		if(streamId == activeStream )
 	     	    		{
 	     	    			removeOption+= '<div class="active-curve">'
 	     	    				       +'<img width="20" height="58" src="images/active-curve.png">'
 	     	    				       +'</div>';
 	     	    		}
 	     	    		 
 	     	    		
 	     	    		$(this).removeClass("icon1 red-active");
 	     	    		$(this).html(removeOption);
 		     	    	$('.drag-rectangle').tooltip()	

 	     	    		 
 	     	    	 }
                 });
            });		            
            $('.drag-rectangle').tooltip()		
        },
                
        /**
	     * open a close option below the stream name tab (left side container)  to close that stream 
	     */
	    closeStreamTab :function(eventName){
	    	eventName.preventDefault();
	    	var self = this;
	    	var streamId = $(eventName.target).parents('li').attr('id');
	    	var StreamName = $(eventName.target).parents('li').attr('name');
	    	
	    	// set new style for li
            var removeOption = '<a href="#" class="red-active-icon1">'+StreamName+' </a>'
            				   +'<div class="drag-icon drag-rectangle" data-original-title="Drag To Rearrange"></div>'
            				   +'<span class="remove-btn"><a href="#">Remove</a></span> <span class="remove-btn cancel-btn "><a href="#">Cancel</a></span>';
	    	
	    	$(eventName.target).parents('li').addClass("icon1 red-active");
	    	$(eventName.target).parents('li').html(removeOption);
	    	$('.tooltip').remove();
	    	
	    	
	    },
    	    
	    /**
	     * close the remove option 
	     */
	    closeRemoveOption: function(eventName){
	    	eventName.preventDefault();
	    	var self = this;
	    	var streamId = $(eventName.target).parents('li').attr('id');
	    	var StreamName = $(eventName.target).parents('li').attr('name');
	    	var userCount = $(eventName.target).parents('li').attr('data-userCount');
	    	
	    	// set previous style for li
	    	var removeOption = '<a  id ="'+streamId+'" name ="'+StreamName+'"  href="#" class="icon1">'+StreamName+'</a>'
			                   +'<div class="drag-icon drag-rectangle" data-original-title="Drag To Rearrange"></div>'
			                   +'<span class="menu-count" style="display:none;"> '+userCount+'</span>'
			                   +'<span class="close-btn drag-rectangle" data-original-title="Delete"></span>';

 	    	$(eventName.target).parents('li').removeClass("icon1 red-active");
	    	$(eventName.target).parents('li').html(removeOption);
	    	$('.drag-rectangle').tooltip()		
	        
	    	
	    },
    	    
	    /**
	     * render right contenets of a selected stream
	     */
	    renderRightContenetsOfSelectedStream: function(eventName){
	    	
	    	eventName.preventDefault();
	    	this.streamId = eventName.target.id;
	    	// disable the content rendering when the stream list is on edit 
	    	if($('a.done').attr('data-value') == "inActive")
	    		return;
	    	
		    var id = eventName.target.id;
		    if(!id)
		    	return;
		    var streamName = eventName.target.name;
		      
		    streamName = $('#'+id+'').attr('name');
		    
		
		    // set active style for stream 
		    $('.sortable li.active').find('div.active-curve').remove();
		    $('.sortable li.active').removeClass('active');
		   
		    $('.sortable li#'+id).addClass('active');
		    $('.sortable li.active').append(this.activeDiv);
		    var userCount = $('.sortable li.active').attr('data-userCount');
		    
		    var compiledTemplate = Handlebars.compile(StreamTitle);
		    $('.stream-header-left').html(compiledTemplate({streamName: streamName ,userCount:userCount }));
		    

	    	
	    }
	  
    })
            
    return streamSliderView;
    
});

