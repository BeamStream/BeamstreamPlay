/***
	 * BeamStream
	 *
	 * Author                : Cuckoo Anna (cuckoo@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 20/September/2012
	 * Description           : Backbone view for side bar 
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
*/
define(['view/baseView',
        'text!templates/newStreamList.tpl',
        'text!templates/streamSlider.tpl',
        'text!templates/streamTitle.tpl',
        '../../lib/jquery.simplyscroll',
        '../../lib/bootstrap'
        ],function(BaseView, NewStreamTpl,StreamList,StreamTitle, simplyscroll,bootstrap){
	
    var streamSliderView; 
    streamSliderView = BaseView.extend({
    	
        objName: 'streamSliderView',
        
        events:{
        	 'click .close-btn' : 'closeStreamTab',
			 'click .cancel-btn' : 'closeRemoveOption',
			 'click .sortable li' : 'renderRightContenetsOfSelectedStream',
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
        	var compiledTemplate = Handlebars.compile(StreamTitle);
			$('.stream-header-left').html(compiledTemplate({data: this.data.toJSON()[0]}));
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
			var compiledTemplate = Handlebars.compile(StreamList);
			this.$(".content").html( compiledTemplate({data: this.data.toJSON()}));
			
		},
                     
        /**
        * slider effectfor stream list
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
	    	if($('a.done').text() == 'DONE')
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
		    
		    // dynamic details for top stream submenus 
//			var topMenuDetails = {
//					 streamName : streamName,
//			}
//			
//			var currentlyActiveSubMenu = $('.stream-tab a.active').attr('id');
//			 
//			
//			/* render right container contents corresponds to each streams*/
//	        rightContentSource = $("#tpl-stream-right-container").html();
//	        rightContentTemplate = Handlebars.compile(rightContentSource);
//	        $('.right-container').html(rightContentTemplate(topMenuDetails));
//	        
//	        //render middle contents
//	        this.renderMiddleContents(currentlyActiveSubMenu);
	    	
	    },
    })
            
    return streamSliderView;
    
});

