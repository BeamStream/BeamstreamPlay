

                      
                       <div class="answer-description"  id="{{value.id.id}}">
                        <div class="follw-left">          
                            <div class="ask-img"><img id="{{value.id.id}}-image" src="{{#if profilePic}}{{profilePic}}{{else}}/beamstream-new/images/profile-upload.png{{/if}}"></div>                      
                        </div>
                        <div class="answer-description-info">
                          <div class="follow-names">
                            <ul class="follow-name-left show-all-block">
                              <li><span>@{{value.firstNameofCommentPoster}} {{value.lastNameofCommentPoster}} </span> -  {{value.timeCreated}}  -  Public</li>
                              <li ><a href="#" class="rock-comments" >Rock</a></li>
                              <li class="rocks-small"><a id="{{value.id.id}}-mrockCount" href="#">{{value.rocks}}</a></li>
                              <!--li><a class="comment-icon" href="#"></a></li-->
                                 
                            </ul>
                          </div>
                          <p>{{value.commentBody}}</p>
                          <a id="{{value.id.id}}" href="#" data-username={{value.userId.id}} data-original-title="Delete" class="delete_comment drag-rectangle" ></a>
                        </div>
                        <div class="clear"></div>
                      </div>
                      
                      
          
