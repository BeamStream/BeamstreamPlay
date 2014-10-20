<div id="{{data.question.id.id}}" class="ask-outer follow-container" name ="{{data.question.userId.id}}">

    <div class="ask-content">
              <div class="follw-left">
                  <div class="ask-img"><img  id="{{data.question.id.id}}-img" src="{{#if data.profilePic}}{{data.profilePic}}{{else}}/beamstream-new/images/profile-upload.png{{/if}}"></div>

                  {{#ifequal data.followerOfQuestionPoster false}}
                     <a href="#" id="{{data.question.userId.id}}" class="follow-button follow-user" data-value="follow" style="visibility:hidden;">follow</a>
                  {{else}}
                    <a href="#" id="{{data.question.userId.id}}" class="follow-button follow-user" data-value="unfollow" style="visibility:hidden;">unfollow</a>
                  {{/ifequal}}

       
              </div>
              <div  class="ask-info">
                <div class="ask-comment">
                  <div class="follow-names">
                    <ul class="follow-name-left">
                      <li><span>@{{data.question.firstNameofQuestionAsker}} {{data.question.lastNameofQuestionAsker}} </span> -  {{data.question.creationDate}}  - {{data.question.questionAccess.name}}</li>
                    </ul>
                    <div class="follow-right" style="visibility:hidden;">

                      {{#ifequal data.followed false}}
                        <a id="{{data.question.id.id}}-follow" href="#" class="follow-button follow-question" data-value="follow">follow
                        </a>
                      {{else}}
                        <a id="{{data.question.id.id}}-follow" href="#" class="follow-button follow-question" data-value="unfollow">unfollow
                        </a>
                      {{/ifequal}}

 

                    </div>
                  </div>
                  {{#ifequal data.question.questionType.name "Text"}}
                    <p id="{{data.question.id.id}}-id" >{{data.question.questionBody}}</p>
                  {{/ifequal}}
                  <div id="{{data.question.id.id}}-poll-Option-area">

                    {{#ifequal data.polls.length 0}}
                    {{else}}
                        <div class="comment-nofication" >
                          <div class="comment-nofication-left" id="{{data.question.id.id}}-pollOptions">
                            
                            {{#each data.polls}}
                              <fieldset>  
                                 <input type="radio" id="{{id.id}}" value="{{id.id}}" name="{{../data.question.id.id}}" class="regular-radio option{{@index}}"  />
                                 <label id="{{id.id}}" for="{{id.id}}" value="{{color}}"></label>
                                 <label>{{name}}</label>
                                 <input type="hidden" id="{{id.id}}-voteCount" class="{{../data.question.id.id}}-polls" value="{{voters.length}}" >
                               </fieldset>
                            {{/each}}
                          </div>
                        <div class="chart">
                          <div id="{{data.question.id.id}}-piechart" class="chart-round"> 
                          </div>
                       </div>
                     </div>
                    {{/ifequal}}


 
                  </div>

                   <!-- start doc section -->
                   
                   {{#ifequal contentType "docs"}}
                      <div id="Docs" class="doc">
                      
                      <div class="item">  
              <div    name="single-doc">
             <div class="image-wrapper hovereffect" >
              <div class="hover-div">
              
                  
                          {{#if commenImage}}
                           <div class="doc-image">
                           <img  src="{{previewImage}}" class="cover-picture" /> <h3 class="common-doctext" >
                           </div>
                           {{extension}}</h3>
                        {{else}}
                          <img  src="{{previewImage}}" class="filmedia-picture" /> 
                             {{/if}}
                        
                <div class="hover-text">     
								 <div id="hover-img-background"></div>          
                 <div class="comment-wrapper" id="{{data.question.docIdIfAny.id}}">                                
                 <div id="media-{{data.question.docIdIfAny.id}}">
                  <h4 id="name-{{data.question.docIdIfAny.id}}" >{{#if data.docName}}{{data.docName}}{{else}}No Document Name{{/if}}</h4>                                
                  <div  class="description-info "><div name={{type}}  class="description-left mediapopup drag-rectangle" id="{{data.question.docIdIfAny.id}}">
                    <input type="hidden" id="id-{{data.question.docIdIfAny.id}}"  value="{{data.question.messageBody}}">      
                    <p class="doc-description" id="description-{{data.question.docIdIfAny.id}}" >{{#if data.docDescription}}{{data.docDescription}}{{else}}No Document Description..{{/if}}</p>
                  </div>
                  <div id="{{data.question.docIdIfAny.id}}" class="comment-wrapper2">
                  <a href="#" class="tag-icon" data-original-title="Search by Users"></a><a href="#" class="hand-icon rock_documents"></a>
                  <a href="#" class="message-icon"></a><a href="#" class="share-icon"></a>
                  </div></div></div>
                
                    <div class="edit-title-div">
                 {{#ifequal loggedUserId data.question.userId.id }}
                    <h5 class="editMediaTitle"   id="{{data.question.docIdIfAny.id}}"><span><img src="/beamstream-new/images/title-plus.png"></span>Title & Description</h5>
                  {{/ifequal}}
                            </div>
                
                 <div class="dateinfo"><span class="state">{{data.question.messageAccess.name}}</span><span class="date date-btn">{{datVal}}</span></div>
                </div>
               </div>
              </div>
             </div>
            
               <div id="{{data.question.docIdIfAny.id}}-docRockers-list" class="docRockers_popup"></div>
               </div>  
            </div> 
    
                       
                      </div>



                    <!-- shows the documents contents in a frame -->
            <div id="document-{{data.question.docIdIfAny.id}}" class="modal hide fade white-modal-block doc-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
              <div class="modal-header">
                  <a class="close" data-dismiss="modal">×</a>
              </div>
              <div class="modal-body" style="max-height:none !important;"> 

              <h4>{{data.docName}}</h4>
                  <p>
                    <iframe id ="iframe-{{data.question.docIdIfAny.id}}" src="" scrolling="NO"  width="963" height="500" style="border: none">
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
              <div id="{{data.question.docIdIfAny.id}}"   name="single-doc">
            <div class="image-wrapper hovereffect" >
              <div class="hover-div"><img class="filmedia-picture" src="{{data.question.anyPreviewImageUrl}}">
                <div class="hover-text">               
                 <div class="comment-wrapper" id="{{data.question.docIdIfAny.id}}">                                
                 <div id="media-{{data.question.docIdIfAny.id}}">
                  <h4 id="name-{{data.question.docIdIfAny.id}}" >{{#if data.docName}}{{data.docName}}{{else}}No Media Name{{/if}}</h4>                                
                  <div class="description-info">      
                     <div class="gallery"></div>
                     
                     <!-- image preview -->
                     {{#ifequal data.question.questionType.name "Image"}}
                    <div class="gallery">
                         <a href="{{data.question.anyPreviewImageUrl}}" style="text-decoration: none" rel="prettyPhoto[gallery2]">
                            <div class="description-left photo-popup">   
                            <p class="google_doc doc-description" id="description-{{data.question.docIdIfAny.id}}"><input type="hidden" id="id-{{data.question.docIdIfAny.id}}" value="doc.url">{{#if data.docDescription}}{{data.docDescription}}{{else}}No Media Description{{/if}}</p>
                        </div>
                         </a>
                   </div>  
                 {{/ifequal}} 
                 
                 <!-- Video preview -->
                     {{#ifequal data.question.questionType.name "Video"}}  
                       <div class="gallery hrtxt">
                        <a href="{{data.question.messageBody}}" style="text-decoration: none" rel="prettyPhoto[gallery1]">
                            <div class="description-left photo-popup">   
                              <p class="google_doc doc-description" id="description-{{data.question.docIdIfAny.id}}"><input type="hidden" id="id-{{data.question.docIdIfAny.id}}" value="doc.url">{{#if data.docDescription}}{{data.docDescription}}{{else}}No Media Description{{/if}}</p>
                       </div>
                         </a>
                 </div> 
                   {{/ifequal}} 
                
                  <div id="{{data.question.docIdIfAny.id}}" class="comment-wrapper2">
                  <a href="#" class="tag-icon" data-original-title="Search by Users"></a><a href="#" class="hand-icon rock_media"></a>
                  <a href="#" class="message-icon"></a><a href="#" class="share-icon"></a>
                  </div></div></div>
                  
                  <div class="edit-title-div">
                {{#ifequal loggedUserId data.question.userId.id }}
                      <h5 class="editMediaTitle" id="{{data.question.docIdIfAny.id}}"><span><img src="beamstream-new/images/title-plus.png"></span>Title & Description</h5>
                    {{/ifequal}}
                  </div>        
                 <div class="dateinfo"><span class="state">{{data.question.questionAccess.name}}</span><span class="date date-btn">{{datVal}}</span></div>
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
                    <ul class="follow-name-left show-all-block">
                      <li>

                          <a href="#" id="{{data.question.id.id}}-qstRockCount" {{#ifequal data.rocked false}} class="rocks-question uprocks-message" {{else}} class="rocks-question downrocks-message" {{/ifequal}}>
                          <span>{{data.question.rockers.length}}</span></a>

                        </li>
                      <li>
                        <a class="rocks-question" href="#">+ Nice!</a>
                      </li>
                      
                      <li><a href="#" class="add-answer">+ Answer</a></li>                      
                      
                      <li><a href="#" class="add-comment" >+ Comment</a></li>
                      
                      
                      <!--li><a class="comment-icon" href="#"></a></li-->
             <a id=" " href="#" class="delete_msg drag-rectangle" data-original-title="Flag this" style="visibility:hidden;"></a> 
                    </ul>
                   
                    </div>
                    
                    <div id= "{{data.question.id.id}}-comment-ans-area" class="comment-ans" ></div>

                    <div id="{{data.question.id.id}}-addComments" class="follow-comment" style="display:none;">
                     <textarea id="{{data.question.id.id}}-questionComment" class="add-question-comment" placeholder="Add Comments.."  onblur="this.placeholder = 'Add Comments..'" onfocus="this.placeholder = ''" placeholder="" cols="" rows="" style="overflow:hidden"></textarea>
                    <div class="message-comment-button" id="question-comment-post-button">Post</div>
                    </div>
                    
                    <div id="{{data.question.id.id}}-addAnswer" class="follow-comment" style="display:none;">
                    <textarea id="{{data.question.id.id}}-questionsAnswer" class="add-question-answer" placeholder="Add Answers.."  onblur="this.placeholder = 'Add Answers..'" onfocus="this.placeholder = ''" placeholder="" cols="" rows="" style="overflow:hidden"></textarea>
                    <div class="message-comment-button" id="question-answer-post-button">Post</div>
                    </div>  
                    
        			{{#ifequal loggedUserId data.question.userId.id }}
						<a id="{{data.question.id.id}}" href="#" data-original-title="Delete" class="delete_post drag-rectangle" ></a>
				 	{{/ifequal}}
        
                </div>




                <div class="answer-info">
                  <div class="answer-conatiner">
                    <div class="button-block">
                      <ul class="follow-name-left show-all-block">
                        
                        <a id="rockedIt-{{data.question.id.id}}" class="btn grey-buttons who-rocked-it" href="#">Who Rocked It?</a> 
                        
                        
                        <a class="btn grey-buttons show-all-comments"  href="#">
                        <span id="{{data.question.id.id}}-totalComment" >{{data.comments}}</span>
                         Comments</a> 
                        
                        
                        <a class="btn grey-buttons show-all-Answers" href="#">
                         <span id="{{data.question.id.id}}-totalAnswer">{{data.answers}}</span>
                          Answers</a>
            
            			<a  class="btn grey-buttons  show-all" id="{{data.question.id.id}}-show-hide" href="#">
            			Show All</a>
                      </ul>
                       
                  </div>
                  
                  <div id="{{data.question.id.id}}-allComments" class="comment-wrapper commentList">

                   
                  </div>
                  
                  
                  
                    <div id="{{data.question.id.id}}-allAnswers" class="comment-wrapper commentList">
							     
							   
                    
                  </div>
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
          <div id="{{data.question.id.id}}-newCommentList" class="comment-wrapper" style="display: none;">
                  </div>
           <div id="{{data.question.id.id}}-newAnswerList" class="comment-wrapper" style="display: none;">
                  </div>
           
          <div id="{{data.question.id.id}}-questionRockers" class="comment-wrapper" style="display: none;">

           
                      
                  </div>
                </div>
              </div>
            </div>
            <div class="clear"></div>
          </div>

          </div>