<!-- 	* Description           : Templates Discussion page messages -->

<div id= "{{data.message.id.id}}" class="ask-outer follow-container" name ="{{data.message.userId.id}}">
	<div class="ask-content">
  	<div class="follw-left">
			<div  class="ask-img">
				<img id="{{data.message.id.id}}-img" src="{{#if data.profilePic}}{{data.profilePic}}{{else}}/beamstream-new/images/profile-upload.png{{/if}}">
			</div>
      	{{#ifequal data.followerOfMessagePoster false}}
      <a href="#" id="{{data.message.userId.id}}" class="follow-button follow-user" data-value="follow" style="visibility:hidden;">follow</a>
				{{else}}
			<a href="#" id="{{data.message.userId.id}}" class="follow-button follow-user" data-value="unfollow" style="visibility:hidden;">unfollow</a>
				{{/ifequal}}
		</div>
    <div  class="ask-info">
    	<div class="ask-comment">
      	<div class="follow-right" style="display: none;"> 
   					{{#ifequal data.followed false}}
	    		<a id="{{data.message.id.id}}-follow" href="#" class="follow-button follow-message" data-value="follow">follow</a>
	      		{{else}}
	      	<a id="{{data.message.id.id}}-follow" href="#" class="follow-button follow-message" data-value="unfollow">unfollow</a>
          	{{/ifequal}}
      	</div>
					{{#ifequal data.message.messageType.name "Text"}}
        <p id="{{data.message.id.id}}-id" >{{data.message.messageBody}}</p>
        	{{/ifequal}}
                  
<!-- start doc section -->
                   
          {{#ifequal contentType "docs"}}
		    <div id="Docs" class="doc">
					<div class="item">
						<div name="single-doc">
							<div class="image-wrapper hovereffect">
						 		<h4 id=""></h4>
								<span id="name-{{data.message.docIdIfAny.id}}">{{#if data.docName}}{{data.docName}}{{else}}No Document Name{{/if}}</span>
						  		<div class="hover-div">
						  				{{#if commenImage}}
						  			<div class="doc-image">
		          				<img  src="{{previewImage}}" class="cover-picture" id="document-cover-img"/> 
												<h3 class="common-doctext" >{{extension}}</h3>
		          			</div>
	              				{{else}}
											<img src="{{previewImage}}" class="filmedia-picture"/> 
													{{/if}}
												<div class="hover-text">               
						    					<div class="comment-wrapper" id="{{data.message.docIdIfAny.id}}">                                
						     						<div id="media-{{data.message.docIdIfAny.id}}">
						     		 					<div class="description-info">
																<div name={{type}} class="description-left mediapopup drag-rectangle" id="{{data.message.docIdIfAny.id}}">
						        							<input type="hidden" id="id-{{data.message.docIdIfAny.id}}"  value="{{data.message.messageBody}}">      
						        								<p class="doc-description" id="description-{{data.message.docIdIfAny.id}}" >
																			{{#if data.docDescription}}{{data.docDescription}}{{/if}}
																		</p>
									    							<div class="dateinfo">
																			<span class="date date-btn">{{data.message.timeCreated}}</span>
																			<span class="state">{{data.message.messageAccess.name}}</span>
																		</div>
						      							</div>
																<form id="{{data.message.docIdIfAny.id}}" class="comment-wrapper2">
																	<button id="document-rock-button">Rock Up</button>
																	<button id="document-comment-button">Comment</button>
																	<button id="document-share-button">Share</button>
																</form>
															</div>
														</div>
							      				<div class="edit-title-div" style="display: none">
								 		 						{{#ifequal loggedUserId data.message.userId.id }}
						     	 						<h5 class="editMediaTitle"   id="{{data.message.docIdIfAny.id}}">
															<span><img src="/beamstream-new/images/title-plus.png"></span>Title & Description</h5>
																{{/ifequal}}
		                				</div>
						  						</div>
						 	 				 	</div>
										</div>
						 		 </div>
								 <div id="{{data.message.docIdIfAny.id}}-docRockers-list" class="docRockers_popup">
								 </div>
						</div>  
					</div> 
				</div>

<!-- shows the documents contents in a frame -->

			  <div id="document-{{data.message.docIdIfAny.id}}"  class="modal hide fade white-modal-block doc-modal" tabindex="-1"
			   role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="box-shadow:none !important;border:none !important">
			
				<div id="googleDocPopupCloseBtn" class="close-icon close" aria-hidden="true" data-dismiss="modal" style="margin: 20px 0px 0px 0px;">
						<img width="22" height="22" src="/beamstream-new/images/close-pop.png">
					</div>
					
				
				<div class="modal-header" style="background:#fff;margin-top: 45px;">
				
						  		<input type="button" onclick="download()">
      							<div class="downloadbutton"><button class="btn btn-mini download" type="button">Download</button>
      							 <div class="current-date">{{data.message.timeCreated}}</div>
      							</div>
     							 <h3></h3>
							</div>
							<div class="modal-body" style="overflow:scroll;background:#fff;"> 

							<h4>{{data.docName}}</h4>
								<input type="hidden" id="dwnload-url" value="" >
						  		<p>
								  	<iframe id ="iframe-{{data.message.docIdIfAny.id}}" src="" scrolling="NO"  width="963" height="500" style="border: none">
										<p>Your browser does not support iframes.</p>
									</iframe> 
								</p>	
							</div>
						</div>



		                  
                  {{/ifequal}}
                   <!-- End doc section -->
                  
                  
                  <!-- start Image / video section -->
                  
                  {{#ifequal contentType "media"}}
	                  <div id="Docs" class="doc">
	                  
	                  <div  class="item">  
						  <div id="{{data.message.docIdIfAny.id}}"   name="single-doc">
						<div class="image-wrapper hovereffect" >
						<h4 id=""></h4>
								<span id="name-{{data.message.docIdIfAny.id}}">{{#if data.docName}}{{data.docName}}{{else}}No Media Name{{/if}}</span>
						  <div class="hover-div"><img class="filmedia-picture" src="{{data.message.anyPreviewImageUrl}}">
						    <div class="hover-text">               
						     <div class="comment-wrapper" id="{{data.message.docIdIfAny.id}}">                                
						     <div id="media-{{data.message.docIdIfAny.id}}">                               
						      <div class="description-info">      
						         <div class="gallery"></div>
						         
						         <!-- image preview -->
						         {{#ifequal data.message.messageType.name "Image"}}
								    <div class="gallery">
							           <a href="{{data.message.anyPreviewImageUrl}}" style="text-decoration: none" rel="prettyPhoto[gallery2]">
							              <div class="description-left photo-popup">   
							              <p class="google_doc doc-description" id="description-{{data.message.docIdIfAny.id}}">
							              <input type="hidden" id="id-{{data.message.docIdIfAny.id}}" value="doc.url">
							              {{#if data.docDescription}}{{data.docDescription}}{{/if}}</p>
								        </div>
							           </a>
								   </div>  
							   {{/ifequal}} 
							   
							   <!-- Video preview -->
					           {{#ifequal data.message.messageType.name "Video"}}  
			            		 <div class="gallery hrtxt">
					           		<a href="{{data.message.messageBody}}" style="text-decoration: none" rel="prettyPhoto[gallery1]">
					              		<div class="description-left photo-popup">   
					              			<p class="google_doc doc-description" id="description-{{data.message.docIdIfAny.id}}">
					              			<input type="hidden" id="id-{{data.message.docIdIfAny.id}}" value="doc.url">
					              			{{#if data.docDescription}}{{data.docDescription}}{{/if}}</p>
						   				 </div>
					          		 </a>
								 </div> 
						       {{/ifequal}} 
						    
						      <div id="{{data.message.docIdIfAny.id}}" class="comment-wrapper2">
						      <a href="#" class="tag-icon" data-original-title="Search by Users"></a>
						      <a href="#" class="hand-icon rock_media"></a>
						      <a href="#" class="message-icon"></a><a href="#" class="share-icon"></a>
						      </div></div></div>
						     <div class="dateinfo">
						       <span class="date media-date-btn">{{data.message.timeCreated}}</span>
						     <span class="media-state">{{data.message.messageAccess.name}}</span>
						     
						      <form id="{{data.message.docIdIfAny.id}}" class="comment-wrapper2">
								<button id="media-document-rock-button">Rock Up</button>
								<button id="media-document-comment-button">Comment</button>
								<button id="media-document-share-button">Share</button>
							</form>
						     </div>
						    
						    </div>
						   </div>
						  </div>
						</div>  
						
						</div>
					</div>
	
	                  </div>
	                  
	               {{/ifequal}}
                  <!-- End Image / video section -->
                  
                  
                  
                  
                  <div class="follow-bottom">
                     <ul class="follow-name-left show-all-block" id="comment-rock">
                   	  <li>
                        	<a href="#" id="{{data.message.id.id}}-msgRockCount"  {{#ifequal data.rocked false}} class="rocks-message uprocks-message" {{else}} class="rocks-message downrocks-message" {{/ifequal}} >
                        		<span>{{data.message.rocks}}</span>
                        	</a>
                    	</li>
                      <li><a class="rock-message clickElement" href="#">+ Nice!</a></li>
                      <li ><a class="add-comment clickElement" href="#">+ Comment</a></li>  
					  <!--li><a class="comment-icon" href="#"></a></li-->                 
                     </ul>
	                   <div class="follow-names" id="username-message-date">
	                   	<ul class="follow-name-left ">
	                    	<li><span id="{{data.message.userId.id}}" >@{{data.message.firstNameofMsgPoster}} {{data.message.lastNameofMsgPoster}} </span> -  {{data.message.timeCreated}}  -  {{data.message.messageAccess.name}}</li>
	                   	</ul>
										 </div>
                     <a id="" href="#" class="delete_msg drag-rectangle" data-original-title="Flag this" style="visibility:hidden;"></a>
                  </div>
                  <div id="{{data.message.id.id}}-addComments" class="follow-comment">
					<textarea id="{{data.message.id.id}}-msgComment" class="add-message-comment" rows="" cols="" placeholder="Add Comments.." onfocus="this.placeholder = ''" onblur="this.placeholder = 'Add Comments..'" style="overflow:hidden"></textarea>
					<div class="message-comment-button" id="message-comment-post-button">POST</div>
				 </div>
				 {{#ifequal loggedUserId data.message.userId.id }}
					<a id="{{data.message.id.id}}" href="#" data-original-title="Delete" href="#" class="delete_post drag-rectangle" ></a>
					{{else}}					
					 {{#ifequal streamCreatorId loggedUserId }}
					<a id="{{data.message.id.id}}" href="#" data-original-title="Delete" href="#" class="delete_post drag-rectangle" ></a>
				 {{/ifequal}}
				 {{/ifequal}}
                </div>
								
                
                
                <div class="answer-info">
                  <div class="answer-conatiner">
                    <div class="button-block">
                      <ul class="follow-name-left show-all-block">
                        
                        <a id="rockedIt-{{data.message.id.id}}" class="btn grey-buttons who-rocked-it" href="#">Who Rocked It?</a><a class="btn grey-buttons show-all-comments" href="#"> <span id="{{data.message.id.id}}-totalComment" >{{data.comments}}</span> Comments</a>
						<a id="{{data.message.id.id}}-show-hide" class="btn grey-buttons  show-all" href="#">Show All</a>
                      </ul>
                       
                      </div>
                      <div id="{{data.message.id.id}}-allComments" class="comment-wrapper commentList" >
                      
                      

                      
                      </div>
					  <div id="{{data.message.id.id}}-newCommentList" class="comment-wrapper" style="display: none;">
                      </div>
                       <div id="{{data.message.id.id}}-msgRockers" class="comment-wrapper" style="display: none;">


                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="clear"></div>

          </div>
          
          
          
          
          
          