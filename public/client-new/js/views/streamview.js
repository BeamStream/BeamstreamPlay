 /***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 12/September/2012
	 * Description           : Backbone view for main stream page
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.StreamView = Backbone.View.extend({
	
		 events :{
			 
			 /* For new design work  */
			 "click .close-btn" : "closeStreamTab",
			 "click .cancel-btn " : "closeRemoveOption",
			 "click .stream-tab a" : "renderSubMenuPages",
			 "click #chat-status" : "openOnlineUsersWindow",
			 "click .sortable li" : "renderRightContenetsOfSelectedStream",

			
	//		 "click .ask-button" :"askQuestions",
	//		 "click .add-poll " : "displayOptionsEntry",
	//		 "click #add_more_options" :"addMoreOptions"
	 
	           
		 },
		 
	//	 /**
	//	  * New - Design --Ask Questions 
	//	  * 
	//	  */
	//	 askQuestions : function(eventName){
	//		 eventName.preventDefault();
	//		 var questionText = $('#question').val();
	//		 var options = new BS.OptionCollection();
	//		 
	//		 for(var i=1 ; i <= BS.options ; i++)
	//		 {
	//			 var option = new BS.Option();
	//			 var optionData = $('#option'+i).val();
	//			 option.set({optionId:i ,optionData:optionData});
	//			 options.add(option);
	//		 }
	////		 var optionInfo = JSON.stringify(options);
	//		 var question = new BS.Question();
	//		 question.set({id:1 ,question:questionText ,options:options});
	//		 var questionInfo = JSON.stringify(question);
	//		 console.log("---"  + questionInfo);
	//		 BS.options = 0;
	//		 data = {
	//				 question : question2,
	//				 pollsOptions : optionInfo
	//		 }
	//		 console.log(data);
			 
			 /* post profile page details */
	//         $.ajax({
	//             type: 'POST',
	//             data:{data: questionInfo},
	//             url: BS.newQuestion,
	//             cache: false,
	//             dataType : "json",
	//             success: function(data){
	//            	 
	//             }
	//         }); 
	//		  
	//	 },
	//	 /**
	//	  * New -Design -- display option entry fields 
	//	  */
	//	 displayOptionsEntry : function (eventName){
	//		 eventName.preventDefault();
	//		 BS.options = 2;
	//		  
	//		 $('.answer').css('display', 'block');
	//	 },
	//	 
	//	 /**
	//	  * New-Design --- Add more options 
	//	  */
	//	 addMoreOptions : function(eventName){
	//		 eventName.preventDefault();
	//		 var options =' <li> <input type="text" id="option'+BS.options+'" placeholder="Add an Option"></li>';
	//		 var parent = $('#add_more_options').parents('li');
	//		 $(parent).before(options);
	//		 console.log(parent);
	//		 
	//	 },
	
	    initialize:function () {
	    	
	    	console.log('Initializing Stream View');
	     	BS.urlRegex1 = /(https?:\/\/[^\s]+)/g;
	     	BS.urlRegex = /(http\:\/\/|https\:\/\/)?([a-z0-9][a-z0-9\-]*\.)+[a-z0-9][a-z0-9\-\./]*$/i ;
	     	BS.urlRegex2 =  /^((http|https|ftp):\/\/)/;
	     	
    		this.source = $("#tpl-main-stream").html();
    		this.template = Handlebars.compile(this.source);
	    		
    		// for pagination in message feed
			BS.pageForKeyword = 1;
			BS.pageLimit = 10;
         
	    },
	 
	    /**
	     * render view
	     */
	    render:function (eventName) {
	    	
	       this.getStreams();
	       $(this.el).html(this.template({"data":this.model.toJSON(),"schools" : BS.mySchools}));
	       return this;
	    },
	    
	    /**
	     * NEW THEME - get all streams
	     */
	    getStreams :function(){
	    	 
	    	 var self =this;
	    	  
	        /* get all streams  */
			 $.ajax({
					type : 'GET',
					url : BS.allStreamsForAUser,
					dataType : "json",
					success : function(datas) {
						 var streams ='';
						 var classStreams ='';
						 _.each(datas, function(data) {
							 
							 streams+='<li id ="'+data.id.id+'" name="'+data.streamName+'" ><a  id ="'+data.id.id+'" name ="'+data.streamName+'"  href="#" class="icon1">'+data.streamName+'</a>'
			                        +'<div class="drag-icon drag-rectangle" data-original-title="Drag To Rearrange"><img src="images/menu-left-icon.png"></div>'
			                        +'<span class="close-btn drag-rectangle" data-original-title="Delete"><img  src="images/close.png"></span>'
			                        +'</li>';
							    
						 });
						  
						 
						 $('#sortable4').html(streams);
						 self.slider();
						 
						 // make first li as active li
						 $('#sortable4 li:first').addClass('active');
						 var streamName = $('#sortable4 li.active a').attr('name');
						 
						 // dynamic details for top stream submenus 
						 var topMenuDetails = {
								 streamName : streamName,
						 }
						 
						 /* render right container contents corresponds to each streams*/
				         rightContentSource = $("#tpl-stream-right-container").html();
				         rightContentTemplate = Handlebars.compile(rightContentSource);
			    	     $('.right-container').html(rightContentTemplate(topMenuDetails));
				    	   
				    	   
			    	     /* render discussion middle contents corresponds to each streams*/
			    	     middleContentSource = $("#tpl-overview-middle-contents").html();
			    	     middleContentTemplate = Handlebars.compile(middleContentSource);
			    	     $('#common-middle-contents').html(middleContentTemplate);
			    	     
					}
			 });
	    },
	    
	    /**
	     * NEW THEME- open a close option below the stream name tab (left side container)  to close that stream 
	     */
	    closeStreamTab :function(eventName){
	    	eventName.preventDefault();
	    	var self = this;
	    	var streamId = $(eventName.target).parents('li').attr('id');
	    	var StreamName = $(eventName.target).parents('li').attr('name');
	    	
	    	// set new style for li
             
            var removeOption = '<a href="#" class="red-active-icon1">'+StreamName+' </a>'
            				   +'<div class="drag-icon drag-rectangle" data-original-title="Drag To Rearrange"><img src="images/menu-left-icon.png"></div>'
            				   +'<span class="remove-btn"><a href="#">Remove</a></span> <span class="remove-btn cancel-btn "><a href="#">Cancel</a></span>';
	    	
	    	$(eventName.target).parents('li').addClass("icon1 red-active");
	    	$(eventName.target).parents('li').html(removeOption);
	    	$('.tooltip').remove();
	    	
	    	
	    },
	    
	    /**
	     *  NEW THEME- close the remove option 
	     */
	    closeRemoveOption: function(eventName){
	    	eventName.preventDefault();
	    	var self = this;
	    	var streamId = $(eventName.target).parents('li').attr('id');
	    	var StreamName = $(eventName.target).parents('li').attr('name');
	    	
	    	// set previous style for li
	    	var removeOption = '<a  id ="'+streamId+'" name ="'+StreamName+'"  href="#" class="icon1">'+StreamName+'</a>'
			                   +'<div class="drag-icon drag-rectangle" data-original-title="Drag To Rearrange"><img src="images/menu-left-icon.png"></div>'
			                   +'<span class="close-btn drag-rectangle" data-original-title="Delete"><img  src="images/close.png"></span>';

 	    	$(eventName.target).parents('li').removeClass("icon1 red-active");
	    	$(eventName.target).parents('li').html(removeOption);
	    	$('.drag-rectangle').tooltip()		
	        
	    	
	    },
	    /**
	     *  NEW THEME-set active class for stream sub menu and render corresponding middle contents 
	     */
	    renderSubMenuPages: function(eventName){
	    	eventName.preventDefault();
	    	var id = eventName.target.id;
	    	 
		    //render middle contents
		    this.renderMiddleContents(id);
	    },
	    
	    /**
	     * NEW THEME - opne online users window
	     */
	    openOnlineUsersWindow: function(eventName){
	    	 $('#user-online').toggle('slow');
	    },
	    
	    
	    /**
	     * NEW THEME - render right contenets of a selected stream
	     */
	    renderRightContenetsOfSelectedStream: function(eventName){
	    	eventName.preventDefault();
		    var id = eventName.target.id;
		    if(!id)
		    	return;
		    var streamName = eventName.target.name;
		      
		    streamName = $('#'+id+'').text();
		
		    $('.sortable li.active').removeClass('active');
		    $('.sortable li#'+id).addClass('active');
		    
		    // dynamic details for top stream submenus 
			var topMenuDetails = {
					 streamName : streamName,
			}
			
			var currentlyActiveSubMenu = $('.stream-tab a.active').attr('id');
			 
			
			/* render right container contents corresponds to each streams*/
	        rightContentSource = $("#tpl-stream-right-container").html();
	        rightContentTemplate = Handlebars.compile(rightContentSource);
	        $('.right-container').html(rightContentTemplate(topMenuDetails));
	        
	        //render middle contents
	        this.renderMiddleContents(currentlyActiveSubMenu);
	    	
	    },
	    
	    /**
	     * NEW THEME - renderMiddle Contents of stream page
	     */
	    renderMiddleContents: function(subMenu){
	    	
	    	var self = this;
	    	$('.stream-tab a.active').removeClass('active');
		    $('#'+subMenu).addClass('active');
		    var streamId =  $('.sortable li.active').attr('id');
		    
	    	
	    	if(subMenu == "calendar_tab")
		    {
		    	BS.calendarView = new BS.CalendarView();
				BS.calendarView.render();
  				$('#common-middle-contents').html(BS.calendarView.el);
			   	
		    }
		    else if(subMenu == "discussion_tab")
		    {
		    	 
				BS.discussionView = new BS.DiscussionView();
				BS.discussionView.render();
  				$('#common-middle-contents').html(BS.discussionView.el);
  				$('.page-loader').hide();
  				
  				// get all messages
  				BS.pagenum =1;  
                if(streamId)
                	BS.discussionView.getAllMessages(streamId,BS.pagenum,BS.pageLimit);
  				
		    }
		    else if(subMenu == "question_tab")
		    {
		    	
				BS.questionView = new BS.QuestionView();
				BS.questionView.render();
  				$('#common-middle-contents').html(BS.questionView.el);
  			    $('.page-loader').hide();
		    }
		    else if(subMenu == "deadline_tab")
		    {
		    	 BS.deadlineView = new BS.DeadlineView();
				 BS.deadlineView.render();
		    	 $('#common-middle-contents').html(BS.deadlineView.el);
		    }
		    else
		    {
		    	BS.overView = new BS.OverView();
				BS.overView.render();
  				$('#common-middle-contents').html(BS.overView.el);
		    }
		    $('#main-photo').attr("src",BS.profileImageUrl);
	    	
	    },
	    
	  /*
	  * slider for stream list
	   */
	   slider: function(){
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
	            $(".done").toggle(function () {         
	                  $('a.done').text('DONE');
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
	                 $('span.close-btn').hide(); 
	                 $('div.drag-icon').hide();
	                 $('#sortable1').remove(); 
	                 $('#sortable4, #sortable5').sortable('destroy');
	                 $('li').removeAttr('draggable');
	                 
	                 /* remove if any red actvated stream li */
	                 $("#sortable4 li").each(function(n) {
	                	 var streamId = $(this).attr('id');
	 	     	    	 var StreamName = $(this).attr('name');
	 	     	    	 if($(this).hasClass('red-active'))
	 	     	    	 {
	 	     	    		var removeOption = '<a  id ="'+streamId+'" name ="'+StreamName+'"  href="#" class="icon1">'+StreamName+'</a>';
	 	     	    		$(this).removeClass("icon1 red-active");
	 	     	    		$(this).html(removeOption);
	 		     	    	$('.drag-rectangle').tooltip()	

	 	     	    		 
	 	     	    	 }
	                 });
	                 
	                 
	            });		
	//	$(window).load(function(){		
	            $('.drag-rectangle').tooltip()		
	            $("#user-online").mCustomScrollbar({
	                set_width:false, /*optional element width: boolean, pixels, percentage*/
	                set_height:false, /*optional element height: boolean, pixels, percentage*/
	                horizontalScroll:false, /*scroll horizontally: boolean*/
	                scrollInertia:550, /*scrolling inertia: integer (milliseconds)*/
	                scrollEasing:"easeOutCirc", /*scrolling easing: string*/
	                mouseWheel:"auto", /*mousewheel support and velocity: boolean, "auto", integer*/
	                autoDraggerLength:true, /*auto-adjust scrollbar dragger length: boolean*/
	                scrollButtons:{ /*scroll buttons*/
	                    enable:false, /*scroll buttons support: boolean*/
	                    scrollType:"continuous", /*scroll buttons scrolling type: "continuous", "pixels"*/
	                    scrollSpeed:20, /*scroll buttons continuous scrolling speed: integer*/
	                    scrollAmount:40 /*scroll buttons pixels scroll amount: integer (pixels)*/
	                    },
	                advanced:{
	                    updateOnBrowserResize:true, /*update scrollbars on browser resize (for layouts based on percentages): boolean*/
	                    updateOnContentResize:false, /*auto-update scrollbars on content resize (for dynamic content): boolean*/
	                    autoExpandHorizontalScroll:false /*auto expand width for horizontal scrolling: boolean*/
	                    },
	                callbacks:{
	                    onScroll:function(){}, /*user custom callback function on scroll event*/
	                    onTotalScroll:function(){}, /*user custom callback function on bottom reached event*/
	                    onTotalScrollOffset:0 /*bottom reached offset: integer (pixels)*/
	                    }                   
	                });
	   }
	   
	});
