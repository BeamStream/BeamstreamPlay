/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 28/February/2013
* Description           : View for Message List on discussion page
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['view/formView',
        'text!templates/discussionMessage.tpl'
        ],function(FormView ,DiscussionMessage){
	
	var messageListView;
	messageListView = FormView.extend({
		objName: 'messageListView',
		messagesPerPage: 10,
		pageNo: 0,
		
		events:{
		},

		onAfterInit: function(){	
			this.data.reset();
			this.urlRegex2 =  /^((http|https|ftp):\/\/)/,
            this.urlRegex1 = /(https?:\/\/[^\s]+)/g,
            this.urlRegex = /(http\:\/\/|https\:\/\/)?([a-z0-9][a-z0-9\-]*\.)+[a-z0-9][a-z0-9\-\./]*$/i ;
        },
        
        onAfterRender: function(){
        	$('.commentList').hide();
        	
        },

		
        displayPage: function(callback){
        	
            var self = this;
            var trueurl='';
            var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
            
			/* render the left stream list */
        	_.each(this.data.models, function(model) {
        		var model = model.toJSON();
        		
				var messageType ='';
				var msgBody = model.message.messageBody;
                                                
				//var links =  msgBody.match(BS.urlRegex); 
                var msgUrl=  msgBody.replace(self.urlRegex1, function(msgUrlw) {
                	trueurl= msgUrlw;    
                    return msgUrlw;
                });
                
                //to get the extension of the uploaded file 
                if(trueurl)
                	var extension = (trueurl).match(pattern);  
                
                if(model.message.messageType.name == "Text")
                {    
                    	 
                     //to check whether the url is a google doc url or not
                     if(msgBody.match(/^(https:\/\/docs.google.com\/)/)) 
                     {
                    	 messageType = "googleDocs";
                     }
                     else
                     {
                    	 messageType = "messageOnly";
                         var linkTag =  msgBody.replace(self.urlRegex1, function(url) {
                               return '<a target="_blank" href="' + url + '">' + url + '</a>';
                         });
                     }
                }
                else
                {          
                     // set first letter of extension in capital letter  
                	  if(extension)
                	  {
                		  extension = extension[1].toLowerCase().replace(/\b[a-z]/g, function(letter) {
                			  return letter.toUpperCase();
  	                	  }); 
                	  }
                }
                
                var datVal =  formatDateVal(model.message.timeCreated);
                
				var datas = {
				 	 "data" : model,
				 	 "datVal":datVal,
			    }
               
				if(messageType == "googleDocs")
				{
					var datas = {
					    "data" : model,
	                    "datVal" :datVal,
	                    "previewImage" : "/beamstream-new/images/google_docs_image.png",
	                    "type" : "googleDoc",
                    	
					}	
				}
				else if(messageType == "messageOnly")
				{
					var datas = {
						 	 "data" : model,
						 	 "datVal":datVal,
				    }
				}
				else
				{
					if(model.message.messageType.name == "Image" || model.message.messageType.name == "Video" )
					{
						var datas = {
						 	 "data" : model,
						 	 "datVal":datVal,
					    }  						
					}
					else
					{
						var previewImage = '';
						var commenImage ="";
						var type = "";
						 
						if(extension == 'Ppt')
						{
                            previewImage= "/beamstream-new/images/presentations_image.png";
                            type = "ppt";
                            
						}
						else if(extension == 'Doc')
						{
							previewImage= "/beamstream-new/images/docs_image.png";
							type = "doc";
							 	
						}
						else if(extension == 'Pdf')
						{
							 
							previewImage= model.anyPreviewImageUrl;
							type = "pdf";
						}
						else
						{
							previewImage= "/beamstream-new/images/textimage.png";
							commenImage = "true";
							type = "doc";
							
						}
						
						var datas = {
							    "data" : model,
                                "datVal" :datVal,
                                "previewImage" :previewImage,
                                "extension" : extension,
                                "commenImage" : commenImage,
                                "type" : type,
                                
				        }	
				  }
						
				}
				
        		compiledTemplate = Handlebars.compile(DiscussionMessage);
        		$('#messageListView div.content').append( compiledTemplate(datas));
        		
        	});
        	
		},
		
		
        displayNoResult : function(callback) {
			this.animate.effect = "fade";
			this.$(".content").html("");
		},
		
        
       
	})
	return messageListView;
});