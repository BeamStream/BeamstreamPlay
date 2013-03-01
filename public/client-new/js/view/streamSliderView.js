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
        '../../lib/jquery.simplyscroll',
        '../../lib/bootstrap'
        ],function(BaseView,simplyscroll,bootstrap){
	
    var streamSliderView;
    streamSliderView = BaseView.extend({
    	
        objName: 'streamSliderView',
                
        onAfterInit: function(){
            this.data.reset({'title':'slider'});
//            console.log(this.data.model[0]);
        },
            
                
                     
        /*
        * slider for stream list
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
//	 	     	    	 if($(this).hasClass('red-active'))
//	 	     	    	 {
//	 	     	    		 
//	 	     	    		var removeOption = '<a  id ="'+streamId+'" name ="'+StreamName+'"  href="#" class="icon1">'+StreamName+'</a>'
//	 	     	    		+'<div class="drag-icon drag-rectangle" data-original-title="Drag To Rearrange" style="display: none;">'
//	 	     	    		+'<img src="images/menu-left-icon.png">'
//	 	     	    		+'</div>'
//	 	     	    		+'<span class="menu-count" > '+userCount+'</span>'
//	 	     	    		+'<span class="close-btn drag-rectangle" data-original-title="Delete" style="display: none;">'
//	 	     	    		+'<img src="images/close.png">'
//	 	     	    		+'</span>';
//	 	     	    		 
//	 	     	    		if(streamId == activeStream )
//	 	     	    		{
//	 	     	    			removeOption+= '<div class="active-curve">'
//	 	     	    				       +'<img width="20" height="58" src="images/active-curve.png">'
//	 	     	    				       +'</div>';
//	 	     	    		}
//	 	     	    		 
//	 	     	    		
//	 	     	    		$(this).removeClass("icon1 red-active");
//	 	     	    		$(this).html(removeOption);
//	 		     	    	$('.drag-rectangle').tooltip()	
//
//	 	     	    		 
//	 	     	    	 }
	                 });
	            });		            
	            $('.drag-rectangle').tooltip()		
                }
            })
                return streamSliderView;
    
    });

