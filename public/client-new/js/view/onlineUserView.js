/***
	 * BeamStream
	 *
	 * Author                : Cuckoo Anna (cuckoo@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 20/September/2012
	 * Description           : Backbone view for main stream page
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * SlNo.   Date          Author         Description
	 * ----------------------------------------------------------------------------------------------
	 * 1.      27March2013   Aswathy.P.R    added showOrHideWidget() 
	 * 
	 * 
*/

define(['baseView',
        'text!templates/onlineUsers.tpl',
        '../../lib/jquery.mCustomScrollbar',
        '../../lib/jquery.mousewheel.min',
        '../../lib/jquery.simplyscroll',
        '../../lib/bootstrap',
        ], function(BaseView,OnlineUsers,mCustomScrollbar,mousewheel,simplyscroll,bootstrap){
	
    var onlineUserView;
	onlineUserView = BaseView.extend({
		objName: 'onlineUserView',

		 events:{
        	 'click #chat-status' : 'showOrHideWidget',
		},
		
        onAfterInit: function(){
        	this.data.reset();
		},		

		/**
		 * show/hide the online users list
		 */
		showOrHideWidget: function(){
			$('#user-online').toggle('slow');
		},
		
		/**
         * if there is no other online users 
         */
		displayNoResult: function(callback){
			
			var compiledTemplate = Handlebars.compile(OnlineUsers);
			this.$(".content").html( compiledTemplate(this.data.toJSON()));			
		},

		/**
         * if other online users 
         */
		displayPage: function(){
			_.each(this.data.models[0].attributes.onlineUsers, function(model) {
				var profileImageUrl = '';
				if(model.profileImageUrl){

					profileImageUrl = model.profileImageUrl;

				}else{

					profileImageUrl = '/beamstream-new/images/profile-upload.png';
				}
				
		        if(model.id.id == localStorage["loggedUserId"])
		        {
		        	var template = 	'<a href="#"><img src="'+profileImageUrl+'" width="30" height="28"> '
		        					+'<span>Me</span> <span class="online-chat">Online</span></a>';
		        			
		        	$('#me').html(template);		
		        }
		        else
		        {
		        	
		        	var template = '<li> <a href="#">'
						        	+'<img width="30" height="28" src="'+profileImageUrl+'">'
						        	+'<span>'+model.firstName+'</span> <span class="offline-chat">'
						        	+'<img width="12" height="13" src="img/online-icon.png"></span></a> </li>';
		        	$('#onlinechatbox').append(template);

		        }
				
        	});
		},

		onAfterRender: function(){
			this.scroll();
		},
		
		/**
        *  method to provide scrolling functionality in onlineusers box
        */
		scroll :function(eventName){
			
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
		},
           
                
     })
	return onlineUserView;
});