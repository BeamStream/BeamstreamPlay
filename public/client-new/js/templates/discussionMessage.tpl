<div id= "{{data.message.id.id}}" class="ask-outer follow-container" name ="{{data.message.userId.id}}">
            <div class="ask-content">
              <div class="follw-left">
               
                  <div  class="ask-img"><img id="{{data.message.id.id}}-img" src="{{data.profilePic}}"></div>
					{{#if owner}}
						
                    {{else}}
               		   <a href="#" id="{{data.message.userId.id}}" class="follow-button follow-user">follow</a>
					{{/if}}
              
              </div>
              <div  class="ask-info">
                <div class="ask-comment">
                  <div class="follow-names">
                    <ul class="follow-name-left ">
                      <li><span id="{{data.message.userId.id}}" >@{{data.message.firstNameofMsgPoster}} {{data.message.lastNameofMsgPoster}} </span> -  {{data.message.timeCreated}}  -  {{data.message.messageAccess.name}}</li>
                    </ul>
                    <div class="follow-right"><a id="{{data.message.id.id}}-follow" href="#" class="follow-button follow-message">follow</a></div>
                  </div>
                  <p id="{{data.message.id.id}}-id" >{{data.message.messageBody}}</p>
                  <div class="follow-bottom">
                    <ul class="follow-name-left show-all-block">
                   
                      <li><a class="rock-message" href="#">Rock</a></li>
                      <li ><a class="add-comment" href="#"> Comment</a></li>
                      <li><a class="comment-icon" href="#"></a></li>
                      <li><a id="" href="#" class="delete_msg drag-rectangle" data-original-title="Flag this"></a></li>
                    </ul>
                    
                  </div>
                  <div id="{{data.message.id.id}}-addComments" class="follow-comment">
					<textarea id="{{data.message.id.id}}-msgComment" class="add-message-comment" rows="" cols="" placeholder="Add Comments.." onfocus="this.placeholder = ''" onblur="this.placeholder = 'Add Comments..'" ></textarea>
				 </div>
				 <a id="{{data.message.id.id}}" href="#" data-original-title="Delete" href="#" class="delete_post drag-rectangle" ></a>
                </div>
                <div class="answer-info">
                  <div class="answer-conatiner">
                    <div class="button-block">
                      <ul class="follow-name-left show-all-block">
                        <li><a href="#" id="{{data.message.id.id}}-msgRockCount" class="rocks-message uprocks-message"><span>{{data.message.rocks}}</span></a></li>
                        <a class="btn grey-buttons who-rocked-it" href="#">Who Rocked It?</a><a class="btn grey-buttons show-all-comments" href="#"> <span id="{{data.message.id.id}}-totalComment" >0</span> Comments</a>
						<a id="{{data.message.id.id}}-show-hide" class="btn grey-buttons  show-all" href="#">Show All</a>
                      </ul>
                       
                      </div>
                      <div id="{{data.message.id.id}}-allComments" class="comment-wrapper">
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