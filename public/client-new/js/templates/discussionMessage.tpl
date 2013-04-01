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
                      <div id="{{message.id.id}}-allComments" class="comment-wrapper" >
                      
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
  {{/each}}