


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
        <button class="btn dropdown-toggle seetings-toggle" data-toggle="dropdown"> <span><img src="/beamstream-new/images/SettingsIcon.jpg"</span></button>
            <ul class="dropdown-menu pull-right" >
            <li class="mark-answered"><a href="#">Mark As Answered</a></li>
            <li class="delete-question"><a href="#">Delete Question</a></li>
        </ul>
    </div>
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
        <div class="already-rocked"></div>
        {{else}}
        <div class="rock-icon"></div>
        {{/if}}
        <div class="rock-ammount">{{pluralize question.rockers.length 'Rock'}}</div>
        <div class="qs-comment-link">Comment</div>
        <div class="qs-answer-link">Answer</div>
        <div class="question-stats">
        <div class="answer-amount">{{question.answers.length ''}}</div>
        <div class="comment-amount">{{question.comments.length '' }}</div>
        
        </div>
       </div>
        <form>
        <input class="qs-answer question-stream-hide">
        </input>
        <input class="qs-comment question-stream-hide">
        </input>
        </form>
       
    </div>
</div>