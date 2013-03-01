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
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
*/

define(['view/baseView','../../lib/jquery.mCustomScrollbar','../../lib/jquery.mousewheel.min','../../lib/jquery.simplyscroll','../../lib/bootstrap'], function(BaseView,mCustomScrollbar,mousewheel,simplyscroll,bootstrap){
            var onlineUserView;
	onlineUserView = BaseView.extend({
		objName: 'onlineUserView',

                onAfterInit: function(){
			this.data.reset();
                        console.log("test");
                        this.Scrollbar();
//                        this.slider();
//                        this.lider();
                    	


		},
                
                      /**
                * NEW THEME- method to display scroller in onlineusers box
                */
            Scrollbar :function(eventName){
                console.log("scroll bar");
                
//                    this.fetch();
//                      var test=this.getModel();
//               console.log(test);

//                      this.data.fetch({
//                   success: function(data){
////                       console.log(data);
//                   }
//               });
                
//               this.data.models[0].set({"san":"5"});
                
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