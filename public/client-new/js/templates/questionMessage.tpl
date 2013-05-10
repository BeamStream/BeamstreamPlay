<div id="{{data.question.id.id}}" class="ask-outer follow-container" name ="{{data.question.userId.id}}">

    <div class="ask-content">
              <div class="follw-left">
                  <div class="ask-img"><img  id="{{data.question.id.id}}-img" src="{{data.profilePic}}"></div>

                  {{#ifequal data.followerOfQuestionPoster false}}
                     <a href="#" id="{{data.question.userId.id}}" class="follow-button follow-user" data-value="follow">follow</a>
                  {{else}}
                    <a href="#" id="{{data.question.userId.id}}" class="follow-button follow-user" data-value="unfollow">unfollow</a>
                  {{/ifequal}}

       
              </div>
              <div  class="ask-info">
                <div class="ask-comment">
                  <div class="follow-names">
                    <ul class="follow-name-left">
                      <li><span>@{{data.question.firstNameofQuestionAsker}} {{data.question.lastNameofQuestionAsker}} </span> -  {{data.question.creationDate}}  - {{data.question.questionAccess.name}}</li>
                    </ul>
                    <div class="follow-right">

                      {{#ifequal data.followed false}}
                        <a id="{{data.question.id.id}}-follow" href="#" class="follow-button follow-question" data-value="follow">follow
                        </a>
                      {{else}}
                        <a id="{{data.question.id.id}}-follow" href="#" class="follow-button follow-question" data-value="unfollow">unfollow
                        </a>
                      {{/ifequal}}

 

                    </div>
                  </div>
                  <p id="{{data.question.id.id}}-id" >{{data.question.questionBody}}</p>
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
                  <div class="follow-bottom">
                    <ul class="follow-name-left show-all-block">
                      <li>
                        <a class="rocks-question" href="#">Rock</a>
                      </li>
                      <li  id="{{data.question.id.id}}-Answer" >
                        <a href="#" class="add-answer"> Answer</a>
                      </li>
                      <li><a href="#" class="add-comment" > Comment</a></li>
                      <li><a class="comment-icon" href="#"></a></li>
             <a id=" " href="#" class="delete_msg drag-rectangle" data-original-title="Flag this"></a> 
                    </ul>
                   
                    </div>
                    <div id= "{{data.question.id.id}}-comment-ans-area" class="comment-ans" ></div>

                    <div id="{{data.question.id.id}}-addComments" class="follow-comment" style="display:none;">
                     <textarea id="{{data.question.id.id}}-questionComment" class="add-question-comment add-question-comment" placeholder="Add Comments.."  onblur="this.placeholder = 'Add Comments..'" onfocus="this.placeholder = ''" placeholder="" cols="" rows=""></textarea>
                    </div>
                    <div id="{{data.question.id.id}}-addAnswer" class="follow-comment" style="display:none;">
                        <textarea id="{{data.question.id.id}}-questionsAnswer" class="add-question-comment add-question-comment" placeholder="Add Answers.."  onblur="this.placeholder = 'Add Answers..'" onfocus="this.placeholder = ''" placeholder="" cols="" rows=""></textarea>
                    </div>  
        <a id="{{data.question.id.id}}" href="#" data-original-title="Delete" class="delete_post drag-rectangle" ></a>
                </div>

                <div class="answer-info">
                  <div class="answer-conatiner">
                    <div class="button-block">
                      <ul class="follow-name-left show-all-block">
                        <li>

                          <a href="#" id="{{data.question.id.id}}-qstRockCount" {{#ifequal data.rocked false}} class="rocks-question uprocks-message" {{else}} class="rocks-question downrocks-message" {{/ifequal}}><span>{{rocks}}</span></a>

                        </li>
                        <a class="btn grey-buttons who-rocked-it" href="#">Who Rocked It?</a> <a class="btn grey-buttons show-all-comments"  href="#"><span id="{{data.question.id.id}}-totalComment" >{{data.comments.length}}</span> Comments</a> <a id="{{data.question.id.id}}-Answerbutton" class="btn grey-buttons " href="#"> <span>0</span> Answers</a>
            <a  class="btn grey-buttons  show-all" id="{{data.question.id.id}}-show-hide" href="#">Show All</a>
                      </ul>
                       
                  </div>
                  
                  <div id="{{data.question.id.id}}-allComments" class="comment-wrapper commentList">

                    {{#each data.comments}}
                      
                       <div class="answer-description"  id="{{comment.id.id}}">
                        <div class="follw-left">          
                            <div class="ask-img"><img id="{{comment.id.id}}-image" src="{{profilePic}}"></div>                      
                        </div>
                        <div class="answer-description-info">
                          <div class="follow-names">
                            <ul class="follow-name-left show-all-block">
                              <li><span>@{{comment.firstNameofCommentPoster}} {{comment.lastNameofCommentPoster}} </span> -  {{comment.timeCreated}}  -  Public</li>
                              <li ><a href="#" class="rock-comments" >Rock</a></li>
                              <li><a class="comment-icon" href="#"></a></li>
                                 <li class="rocks-small"><a id="{{comment.id.id}}-mrockCount" href="#">{{comment.rocks}}</a></li>
                            </ul>
                          </div>
                          <p>{{comment.commentBody}}</p>
                          <a id="{{comment.id.id}}" href="#" data-username={{comment.userId.id}} data-original-title="Delete" class="delete_comment drag-rectangle" ></a>
                        </div>
                        <div class="clear"></div>
                      </div>
                      
                      
                      {{/each}}
                  </div>
          <div id="{{data.question.id.id}}-newCommentList" class="comment-wrapper" style="display: none;">
                  </div>
          <div id="{{data.question.id.id}}-questionRockers" class="comment-wrapper" style="display: none;">
                  </div>
                </div>
              </div>
            </div>
            <div class="clear"></div>
          </div>

          </div>