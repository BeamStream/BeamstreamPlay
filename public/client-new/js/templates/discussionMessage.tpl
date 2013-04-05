<!-- 	* BeamStream
		*
		* Author                : Aswathy P.R (aswathy@toobler.com)
		* Company               : Toobler
		* Email:                : info@toobler.com
		* Web site              : http://www.toobler.com
		* Created               : 15/March/2013
		* Description           : Templates Discussion page messages
		* ==============================================================================================
		* Change History:
		* ----------------------------------------------------------------------------------------------
		* Sl.No.  Date   Author   Description
		* -
  -->

{{#each .}}
<!-- For messages with images -->
{{#ifequal message.messageType.name "Image"}}

<div id= "{{message.id.id}}" class="ask-outer follow-container" name ="{{message.userId.id}}">
            <div class="ask-content">
              <div class="follw-left">
             
              <div  class="ask-img"><img id="{{message.id.id}}-img" src="{{profilePic}}"></div>
              <a href="#"  id="{{message.userId.id}}" class="follow-button follow-user">follow</a> 
		
              </div>
              <div  class="ask-info">
                <div class="ask-comment">
                  <div class="follow-names">
                    <ul class="follow-name-left ">
                      <li><span id="{{userId.id}}" >@{{message.firstNameofMsgPoster}} {{message.lastNameofMsgPoster}} </span> -  {{message.timeCreated}}  -  {{message.messageAccess.name}}</li>
                    </ul>
                    <div class="follow-right"><a id="{{message.id.id}}-follow" href="#" class="follow-button follow-message">follow</a></div>
                  </div>
				  {{#if docDescription}}
                  <p id="{{message.id.id}}-id" >{{docDescription}}</p> 
                  {{/if}}
                  
                  <!-- start doc section -->
                  <div id="Docs" class="doc">
                  
                  <div  class="item">  
					  <div id="{{message.docIdIfAny.id}}"   name="single-doc">
					<div class="image-wrapper hovereffect" >
					  <div class="hover-div"><img class="filmedia-picture" src="{{message.anyPreviewImageUrl}}">
					    <div class="hover-text">               
					     <div class="comment-wrapper" id="{{message.docIdIfAny.id}}">                                
					     <div id="media-{{message.docIdIfAny.id}}">
					      <h4 id="name-{{message.docIdIfAny.id}}" >{{#if docName}}{{docName}}{{else}}No Media Name{{/if}}</h4>                                
					      <div class="description-info">      
					         <div class="gallery"></div>
						 <div class="gallery hrtxt">
					           <a href="{{message.anyPreviewImageUrl}}" style="text-decoration: none" rel="prettyPhoto[gallery2]">
					              <div class="description-left photo-popup">   
					              <p class="google_doc doc-description" id="description-{{message.docIdIfAny.id}}"><input type="hidden" id="id-{{message.docIdIfAny.id}}" value="doc.url">{{#if docDescription}}{{docDescription}}{{else}}No Media Description{{/if}}</p>
						    </div>
					           </a>
						 </div>     
					    
					      <div id="{{message.docIdIfAny.id}}" class="comment-wrapper2">
					      <a href="#" class="tag-icon" data-original-title="Search by Users"></a><a href="#" class="hand-icon rock_media"></a>
					      <a href="#" class="message-icon"></a><a href="#" class="share-icon"></a>
					      </div></div></div>
					      
					      <div class="edit-title-div">
							
					      <h5 class="editMediaTitle" id="{{message.docIdIfAny.id}}"><span><img src="beamstream-new/images/title-plus.png"></span>Edit Title & Description</h5>
					      
					      </div>        
					     <div class="dateinfo"><span class="state">{{message.messageAccess.name}}</span><span class="date">{{datVal}}</span></div>
					    </div>
					   </div>
					  </div>
					</div>  
					
					</div>
			</div>

                  </div>
                  <!-- End doc section -->
                  
                  
                  <div class="follow-bottom">
                    <ul class="follow-name-left show-all-block">
                   
                      <li><a class="rock-message" href="#">Rock</a></li>
                      <li ><a class="add-comment" href="#"> Comment</a></li>
                      <li><a class="comment-icon" href="#"></a></li>
                      <li><a id="" href="#" class="delete_msg drag-rectangle" data-original-title="Flag this"></a></li> 
                    </ul>
					
                  </div>
                  <div id="{{message.id.id}}-addComments" class="follow-comment">
				     <textarea id="{{message.id.id}}-msgComment" class="add-message-comment" rows="" cols="" placeholder="Add Comments.."  onfocus="this.placeholder = ''" onblur="this.placeholder = 'Add Comments..'"></textarea>
				   </div>   
                <a id="{{message.id.id}}" data-original-title="Delete" href="#" class="delete_post drag-rectangle" ></a>
                </div>
                <div class="answer-info">
                  <div class="answer-conatiner">
                    <div class="button-block">
                      <ul class="follow-name-left show-all-block">
                        <li><a href="#" id="{{message.id.id}}-msgRockCount" class="rocks-message uprocks-message"><span>{{message.rocks}}</span></a></li>
                        <a class="btn grey-buttons who-rocked-it" href="#">Who Rocked It?</a><a class="btn grey-buttons show-all-comments" href="#"> <span id="{{message.id.id}}-totalComment" >0</span> Comments</a>
						<a id="{{message.id.id}}-show-hide" class="btn grey-buttons  show-all" href="#">Show All</a>
                      </ul>
                       
                      </div>
                      <div id="{{message.id.id}}-allComments" class="comment-wrapper commentList">
                      	{{#each comments}}
                      
                       <div class="answer-description"  id="{{id.id}}">
                        <div class="follw-left">          
                            <div class="ask-img"><img id="{{id.id}}-image" src=""></div>                      
                        </div>
                        <div class="answer-description-info">
                          <div class="follow-names">
                            <ul class="follow-name-left show-all-block">
                              <li><span>@{{firstNameofCommentPoster}} {{lastNameofCommentPoster}} </span> -  {{timeCreated}}  -  Public</li>
                              <li ><a href="#" class="rock-comments" >Rock</a></li>
                              <li><a class="comment-icon" href="#"></a></li>
                                 <li class="rocks-small"><a id="{{{id.id}}-mrockCount" href="#">{{{rocks}}</a></li>
                            </ul>
                          </div>
                          <p>{{this.commentBody}}</p>
                          <a id="{{id}}" href="#" data-username={{userId.id}} data-original-title="Delete" class="delete_comment drag-rectangle" ></a>
                        </div>
                        <div class="clear"></div>
                      </div>
                      
                      
                      {{/each}}
                      
                      </div>
					  <div id="{{message.id.id}}-newCommentList" class="comment-wrapper commentList" style="display: none;">
                      </div>
					 <div id="{{message.id.id}}-msgRockers" class="comment-wrapper" style="display: none;">
                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="clear"></div>

          </div>
{{/ifequal}}

<!-- for messages with Document -->
{{#ifequal message.messageType.name "Document"}}
<div id= "{{message.id.id}}" class="ask-outer follow-container" name ="{{message.userId.id}}">
            <div class="ask-content">
              <div class="follw-left">
               <div class="ask-img" ><img id="{{message.id.id}}-img" src=""></div>
					
                  <a id="{{message.userId.id}}"  href="#" class="follow-button follow-user">follow</a>  
					
				
              </div>
              <div  class="ask-info">
                <div class="ask-comment">
                  <div class="follow-names">
                    <ul class="follow-name-left">
                      <li><span id="{{message.userId.id}}" >@{{message.firstNameofMsgPoster}} {{message.lastNameofMsgPoster}} </span> -  {{message.timeCreated}}  -  {{message.messageAccess.name}}</li>
                    </ul>
                    <div class="follow-right"><a id="{{message.id.id}}-follow" href="#" class="follow-button follow-message">follow</a></div>
                  </div>
                 <!-- <p id="{{message.id.id}}-id" >{{message.messageBody}}</p> -->
                  
                   <!-- start doc section -->
                  <div id="Docs" class="doc">
                  
                  <div class="item">  
				  <div    name="single-doc">
				 <div class="image-wrapper hovereffect" >
				  <div class="hover-div">
				   <div class="doc-image">
                  		{{#if commenImage }}
                 			 <img  src="{{previewImage}}" class="cover-picture" /> <h3 class="common-doctext" >{{extension}}</h3>
                 		{{else}}
                 			<img  src="{{previewImage}}" class="cover-picture" /> 
                         {{/if}}
                  	</div>
				    <div class="hover-text">               
				     <div class="comment-wrapper" id="{{message.docIdIfAny.id}}">                                
				     <div id="media-{{message.docIdIfAny.id}}">
				      <h4 id="name-{{message.docIdIfAny.id}}" >{{#if docName}}{{docName}}{{else}}No Document Name{{/if}}</h4>                                
				      <div  class="description-info "><div name={{type}}  class="description-left mediapopup drag-rectangle" id="{{message.docIdIfAny.id}}">
				        <input type="hidden" id="id-{{message.docIdIfAny.id}}"  value="{{message.messageBody}}">      
				        <p class="doc-description" id="description-{{datas.message.docIdIfAny.id}}" >{{#if docDescription}}{{docDescription}}{{else}}No Document Description..{{/if}}</p>
				      </div>
				      <div id="{{message.docIdIfAny.id}}" class="comment-wrapper2">
				      <a href="#" class="tag-icon" data-original-title="Search by Users"></a><a href="#" class="hand-icon rock_documents"></a>
				      <a href="#" class="message-icon"></a><a href="#" class="share-icon"></a>
				      </div></div></div>
						
					      <div class="edit-title-div">
						{{#if owner}}
				     	 <h5 class="editDocTitle"   id="{{message.docIdIfAny.id}}"><span><img src="images/title-plus.png"></span>Edit Title & Description</h5>
							{{/if}}         
                    	  </div>
						
				     <div class="dateinfo"><span class="state">{{message.messageAccess.name}}</span><span class="date">{{datVal}}</span></div>
				    </div>
				   </div>
				  </div>
				 </div>
				
				   <div id="{{message.docIdIfAny.id}}-docRockers-list" class="docRockers_popup"></div>
				   </div>  
				</div> 

                   
                  </div>
                  <!-- End doc section -->
                  
                  <div class="follow-bottom">
                    <ul class="follow-name-left show-all-block">
                   
                      <li><a class="rock-message" href="#">Rock</a></li>
                      <li ><a class="add-comment" href="#"> Comment</a></li>
                      <li><a class="comment-icon" href="#"></a></li>
                      <li><a id="" href="#" class="delete_msg drag-rectangle" data-original-title="Flag this"></a>  </li>
                    </ul>
					
                  </div>
                  <div id="{{message.id.id}}-addComments" class="follow-comment">
					<textarea id="{{message.id.id}}-msgComment" class="add-message-comment" rows="" cols="" placeholder="Add Comments.." onfocus="this.placeholder = ''" onblur="this.placeholder = 'Add Comments..'" ></textarea>
				 </div>
				 <a id="{{message.id.id}}" href="#" data-original-title="Delete" href="#" class="delete_post drag-rectangle"></a>
                </div>
                <div class="answer-info">
                  <div class="answer-conatiner">
                    <div class="button-block">
                      <ul class="follow-name-left show-all-block">
                        <li><a href="#" id="{{message.id.id}}-msgRockCount" class="rocks-message uprocks-message"><span>{{message.rocks}}</span></a></li>
                        <a class="btn grey-buttons who-rocked-it" href="#">Who Rocked It?</a><a class="btn grey-buttons show-all-comments" href="#"> <span id="{{datas.message.id.id}}-totalComment" >0</span> Comments</a>
						<a id="{{message.id.id}}-show-hide" class="btn grey-buttons  show-all" href="#">Show All</a>
                      </ul>
                       
                      </div>
                      <div id="{{message.id.id}}-allComments" class="comment-wrapper commentList">
                      
                      	{{#each comments}}
                      
                       <div class="answer-description"  id="{{id.id}}">
                        <div class="follw-left">          
                            <div class="ask-img"><img id="{{id.id}}-image" src=""></div>                      
                        </div>
                        <div class="answer-description-info">
                          <div class="follow-names">
                            <ul class="follow-name-left show-all-block">
                              <li><span>@{{firstNameofCommentPoster}} {{lastNameofCommentPoster}} </span> -  {{timeCreated}}  -  Public</li>
                              <li ><a href="#" class="rock-comments" >Rock</a></li>
                              <li><a class="comment-icon" href="#"></a></li>
                                 <li class="rocks-small"><a id="{{{id.id}}-mrockCount" href="#">{{{rocks}}</a></li>
                            </ul>
                          </div>
                          <p>{{this.commentBody}}</p>
                          <a id="{{id}}" href="#" data-username={{userId.id}} data-original-title="Delete" class="delete_comment drag-rectangle" ></a>
                        </div>
                        <div class="clear"></div>
                      </div>
                      
                      
                      {{/each}}
                      </div>
					  <div id="{{message.id.id}}-newCommentList" class="comment-wrapper commentList" style="display: none;">
                      </div>
 					 <div id="{{message.id.id}}-msgRockers" class="comment-wrapper" style="display: none;">
                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="clear"></div>

          </div>
{{/ifequal}}


<!-- for messages with video -->
{{#ifequal message.messageType.name "Video"}}

<div id= "{{message.id.id}}" class="ask-outer follow-container" name ="{{message.userId.id}}">
            <div class="ask-content">
              <div class="follw-left">
             
              <div  class="ask-img"><img id="{{message.id.id}}-img" src="{{profilePic}}"></div>
              <a href="#"  id="{{message.userId.id}}" class="follow-button follow-user">follow</a> 
		
              </div>
              <div  class="ask-info">
                <div class="ask-comment">
                  <div class="follow-names">
                    <ul class="follow-name-left ">
                      <li><span id="{{userId.id}}" >@{{message.firstNameofMsgPoster}} {{message.lastNameofMsgPoster}} </span> -  {{message.timeCreated}}  -  {{message.messageAccess.name}}</li>
                    </ul>
                    <div class="follow-right"><a id="{{message.id.id}}-follow" href="#" class="follow-button follow-message">follow</a></div>
                  </div>
				  {{#if docDescription}}
                  <p id="{{message.id.id}}-id" >{{docDescription}}</p> 
                  {{/if}}
                  
                  <!-- start doc section -->
                  <div id="Docs" class="doc">
                  
                  <div  class="item">  
					  <div id="{{message.docIdIfAny.id}}"   name="single-doc">
					<div class="image-wrapper hovereffect" >
					  <div class="hover-div"><img class="filmedia-picture" src="{{message.anyPreviewImageUrl}}">
					    <div class="hover-text">               
					     <div class="comment-wrapper" id="{{message.docIdIfAny.id}}">                                
					     <div id="media-{{message.docIdIfAny.id}}">
					      <h4 id="name-{{message.docIdIfAny.id}}" >{{#if docName}}{{docName}}{{else}}No Media Name{{/if}}</h4>                                
					      <div class="description-info">      
					         <div class="gallery"></div>
						 <div class="gallery hrtxt">
					           <a href="{{message.anyPreviewImageUrl}}" style="text-decoration: none" rel="prettyPhoto[gallery2]">
					              <div class="description-left photo-popup">   
					              <p class="google_doc doc-description" id="description-{{message.docIdIfAny.id}}"><input type="hidden" id="id-{{message.docIdIfAny.id}}" value="doc.url">{{#if docDescription}}{{docDescription}}{{else}}No Media Description{{/if}}</p>
						    </div>
					           </a>
						 </div>     
					    
					      <div id="{{message.docIdIfAny.id}}" class="comment-wrapper2">
					      <a href="#" class="tag-icon" data-original-title="Search by Users"></a><a href="#" class="hand-icon rock_media"></a>
					      <a href="#" class="message-icon"></a><a href="#" class="share-icon"></a>
					      </div></div></div>
					      
					      <div class="edit-title-div">
							
					      <h5 class="editMediaTitle" id="{{message.docIdIfAny.id}}"><span><img src="beamstream-new/images/title-plus.png"></span>Edit Title & Description</h5>
					      
					      </div>        
					     <div class="dateinfo"><span class="state">{{message.messageAccess.name}}</span><span class="date">{{datVal}}</span></div>
					    </div>
					   </div>
					  </div>
					</div>  
					
					</div>
			</div>

                  </div>
                  <!-- End doc section -->
                  
                  
                  <div class="follow-bottom">
                    <ul class="follow-name-left show-all-block">
                   
                      <li><a class="rock-message" href="#">Rock</a></li>
                      <li ><a class="add-comment" href="#"> Comment</a></li>
                      <li><a class="comment-icon" href="#"></a></li>
                      <li><a id="" href="#" class="delete_msg drag-rectangle" data-original-title="Flag this"></a></li> 
                    </ul>
					
                  </div>
                  <div id="{{message.id.id}}-addComments" class="follow-comment">
				     <textarea id="{{message.id.id}}-msgComment" class="add-message-comment" rows="" cols="" placeholder="Add Comments.."  onfocus="this.placeholder = ''" onblur="this.placeholder = 'Add Comments..'"></textarea>
				   </div>   
                <a id="{{message.id.id}}" data-original-title="Delete" href="#" class="delete_post drag-rectangle" ></a>
                </div>
                <div class="answer-info">
                  <div class="answer-conatiner">
                    <div class="button-block">
                      <ul class="follow-name-left show-all-block">
                        <li><a href="#" id="{{message.id.id}}-msgRockCount" class="rocks-message uprocks-message"><span>{{message.rocks}}</span></a></li>
                        <a class="btn grey-buttons who-rocked-it" href="#">Who Rocked It?</a><a class="btn grey-buttons show-all-comments" href="#"> <span id="{{message.id.id}}-totalComment" >0</span> Comments</a>
						<a id="{{message.id.id}}-show-hide" class="btn grey-buttons  show-all" href="#">Show All</a>
                      </ul>
                       
                      </div>
                      <div id="{{message.id.id}}-allComments" class="comment-wrapper commentList">
                      	{{#each comments}}
                      
                       <div class="answer-description"  id="{{id.id}}">
                        <div class="follw-left">          
                            <div class="ask-img"><img id="{{id.id}}-image" src=""></div>                      
                        </div>
                        <div class="answer-description-info">
                          <div class="follow-names">
                            <ul class="follow-name-left show-all-block">
                              <li><span>@{{firstNameofCommentPoster}} {{lastNameofCommentPoster}} </span> -  {{timeCreated}}  -  Public</li>
                              <li ><a href="#" class="rock-comments" >Rock</a></li>
                              <li><a class="comment-icon" href="#"></a></li>
                                 <li class="rocks-small"><a id="{{{id.id}}-mrockCount" href="#">{{{rocks}}</a></li>
                            </ul>
                          </div>
                          <p>{{this.commentBody}}</p>
                          <a id="{{id}}" href="#" data-username={{userId.id}} data-original-title="Delete" class="delete_comment drag-rectangle" ></a>
                        </div>
                        <div class="clear"></div>
                      </div>
                      
                      
                      {{/each}}
                      </div>
					  <div id="{{message.id.id}}-newCommentList" class="comment-wrapper commentList" style="display: none;">
                      </div>
					 <div id="{{message.id.id}}-msgRockers" class="comment-wrapper" style="display: none;">
                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="clear"></div>

          </div>
{{/ifequal}}

<!-- For text messages -->
{{#ifequal message.messageType.name "Text"}}
<div id= "{{message.id.id}}" class="ask-outer follow-container" name ="{{message.userId.id}}">
            <div class="ask-content">
              <div class="follw-left">
               
                  <div  class="ask-img"><img id="{{message.id.id}}-img" src="{{profilePic}}"></div>
					{{#if owner}}
						
                    {{else}}
               		   <a href="#" id="{{message.userId.id}}" class="follow-button follow-user">follow</a>
					{{/if}}
              
              </div>
              <div  class="ask-info">
                <div class="ask-comment">
                  <div class="follow-names">
                    <ul class="follow-name-left ">
                      <li><span id="{{message.userId.id}}" >@{{message.firstNameofMsgPoster}} {{message.lastNameofMsgPoster}} </span> -  {{message.timeCreated}}  -  {{message.messageAccess.name}}</li>
                    </ul>
                    <div class="follow-right"><a id="{{message.id.id}}-follow" href="#" class="follow-button follow-message">follow</a></div>
                  </div>
                  <p id="{{message.id.id}}-id" >{{message.messageBody}}</p>
                  <div class="follow-bottom">
                    <ul class="follow-name-left show-all-block">
                   
                      <li><a class="rock-message" href="#">Rock</a></li>
                      <li ><a class="add-comment" href="#"> Comment</a></li>
                      <li><a class="comment-icon" href="#"></a></li>
                      <li><a id="" href="#" class="delete_msg drag-rectangle" data-original-title="Flag this"></a></li>
                    </ul>
                    
                  </div>
                  <div id="{{message.id.id}}-addComments" class="follow-comment">
					<textarea id="{{message.id.id}}-msgComment" class="add-message-comment" rows="" cols="" placeholder="Add Comments.." onfocus="this.placeholder = ''" onblur="this.placeholder = 'Add Comments..'" ></textarea>
				 </div>
				 <a id="{{message.id.id}}" href="#" data-original-title="Delete" href="#" class="delete_post drag-rectangle" ></a>
                </div>
                <div class="answer-info">
                  <div class="answer-conatiner">
                    <div class="button-block">
                      <ul class="follow-name-left show-all-block">
                        <li><a href="#" id="{{message.id.id}}-msgRockCount" class="rocks-message uprocks-message"><span>{{message.rocks}}</span></a></li>
                        <a class="btn grey-buttons who-rocked-it" href="#">Who Rocked It?</a><a class="btn grey-buttons show-all-comments" href="#"> <span id="{{message.id.id}}-totalComment" >{{comments.length}}</span> Comments</a>
						<a id="{{message.id.id}}-show-hide" class="btn grey-buttons  show-all" href="#">Show All</a>
                      </ul>
                       
                      </div>
                      <div id="{{message.id.id}}-allComments" class="comment-wrapper commentList" >
                      
                      {{#each comments}}
                      
                       <div class="answer-description"  id="{{id.id}}">
                        <div class="follw-left">          
                            <div class="ask-img"><img id="{{id.id}}-image" src=""></div>                      
                        </div>
                        <div class="answer-description-info">
                          <div class="follow-names">
                            <ul class="follow-name-left show-all-block">
                              <li><span>@{{firstNameofCommentPoster}} {{lastNameofCommentPoster}} </span> -  {{timeCreated}}  -  Public</li>
                              <li ><a href="#" class="rock-comments" >Rock</a></li>
                              <li><a class="comment-icon" href="#"></a></li>
                                 <li class="rocks-small"><a id="{{{id.id}}-mrockCount" href="#">{{{rocks}}</a></li>
                            </ul>
                          </div>
                          <p>{{this.commentBody}}</p>
                          <a id="{{id}}" href="#" data-username={{userId.id}} data-original-title="Delete" class="delete_comment drag-rectangle" ></a>
                        </div>
                        <div class="clear"></div>
                      </div>
                      
                      
                      {{/each}}
                      
                      </div>
					  <div id="{{message.id.id}}-newCommentList" class="comment-wrapper" style="display: none;">
                      </div>
                       <div id="{{message.id.id}}-msgRockers" class="comment-wrapper" style="display: none;">
                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="clear"></div>

          </div>
   {{/ifequal}}
  {{/each}}