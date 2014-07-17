

                      
                       <div class="answer-description"  id="{{value.comment.id.id}}">
                        <div class="follw-left">          
                            <div class="ask-img"><img id="{{value.comment.id.id}}-image" src="{{#if profilePic}}{{profilePic}}{{else}}/beamstream-new/images/profile-upload.png{{/if}}"></div>                      
                        </div>
                        <div class="answer-description-info">
                          <div class="follow-names">
                            <ul class="follow-name-left show-all-block">
                              <li><span>@{{value.comment.firstNameofCommentPoster}} {{value.comment.lastNameofCommentPoster}} </span> -  {{value.comment.timeCreated}}  -  Private to Class</li>
                              <li ><a href="#" class="rock-comments" >Rock</a></li>
                              <li class="rocks-small"><a id="{{value.comment.id.id}}-mrockCount" href="#">{{value.comment.rocks}}</a></li>
                              <!--li><a class="comment-icon" href="#"></a></li-->
                                 
                            </ul>
                          </div>
                          <p>{{value.comment.commentBody}}</p>
                          <a id="{{value.comment.id.id}}" href="#" data-username={{value.comment.userId.id}} data-original-title="Delete" class="delete_comment drag-rectangle" ></a>
                        </div>
                        <div class="clear"></div>
                      </div>
                      
                      
          
