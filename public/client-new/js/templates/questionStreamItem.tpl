<div id="{{question.id.id}}" class="side-question">
<div class="question-post">
    {{#if profilePic.length}}
    <img src="{{profilePic}}" class="profile-picture"></img>
    {{else}}
    <img src="/beamstream-new/images/profile-upload.png" class="profile-picture"></img>
    {{/if}}
    <div class="username-info">
        <a class="username" href="#">{{question.firstNameofQuestionAsker}} {{question.lastNameofQuestionAsker}}</a>
       
    </div>
    	 <div class="follow-question">FOLLOW</div>
   
    {{#if onlineUserAsked}}
    <div class="btn-group stream-dropdown question-setting">
        <button class="btn dropdown-toggle seetings-toggle" data-toggle="dropdown"> 
					<span id="questions-edit-gear-icon"></span>
				</button>
            <ul class="dropdown-menu pull-right" >
            <li class="mark-answered"><a href="#">Mark As Answered</a></li>
            <li class="delete-question"><a href="#">Delete Question</a></li>
        </ul>
    </div>
   {{else}}
   {{#if StreamOwner}}
   <div class="btn-group stream-dropdown question-setting">
        <button class="btn dropdown-toggle seetings-toggle" data-toggle="dropdown"> 
					<span id="questions-edit-gear-icon"></span>
				</button>
            <ul class="dropdown-menu pull-right" >
            <li class="mark-answered"><a href="#">Mark As Answered</a></li>
            <li class="delete-question"><a href="#">Delete Question</a></li>
        </ul>
    </div>
   {{/if}}
    {{/if}}
    
    
   
    
    <div class="post-info">
        <div class="post-date">{{question.creationDate}}</div>
        <div class="post-type">{{question.questionAccess.name}}</div>
    </div>

    <div class="question-txt">
        <p>{{question.questionBody}}</p>
    </div>	
    <div class="post-interact">
       <div class="post-interact-wrapper">
        {{#if onlineUserRocked}}
        <div id="{{question.id.id}}-rockicon" class="already-rocked"></div>
        {{else}}
        <div id="{{question.id.id}}-rockicon" class="rock-icon"></div>
        {{/if}}
        <div class="rock-ammount" id="{{question.id.id}}-totalrocksidebar"><span>{{question.rockers.length}}</span></div>
        <div class="qs-comment-link">Comment</div>
        <div class="qs-answer-link">Answer</div>
        <div class="question-stats" id="{{question.id.id}}">
        <div  id="{{question.id.id}}-totalanswersidebar" class="answer-amount">{{question.answers.length}}</div>
        <div id="{{question.id.id}}-totalcommentsidebar" class="comment-amount">{{question.comments.length}}</div>
        
        </div>
       </div>
       
       
    </div>
    
     <form action="#" class="questioAnswersComments">
        <div class="answerinputField">
        <input class="qs-answer question-stream-hide" placeholder="Answer">
        <div class="answer-button" id="answer-button-sidestream">POST</div>
       </div>
        <div class="commentinputField">
        <input class="qs-comment question-stream-hide" placeholder="Comment">
        <div class="answer-button" id="comment-button-sidestream">POST</div>
    	 </div>
        </form>
</div>
</div>
