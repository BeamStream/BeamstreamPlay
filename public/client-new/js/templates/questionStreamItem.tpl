<div class="question-post">
    <img src="{{profilePic}}" class="profile-picture"></img>
    <div class="username-info">
        <a class="username" href="#">{{question.firstNameofQuestionAsker}} {{question.lastNameofQuestionAsker}}</a>
        <div class="follow-question">FOLLOW</div>
    </div>

    <div class="btn-group stream-dropdown">
        <button class="btn" data-toggle="dropdown"> <span class="caret display-caret"></span></button>
            <ul class="dropdown-menu pull-right">
            <li class="mark-answered"><a href="#">Mark As Answered</a></li>
            <li class="delete-question"><a href="#">Delete Question</a></li>
        </ul>
    </div>
    <div class="post-info">
        <div class="post-date">{{question.creationDate}}</div>
        <div class="post-type">{{question.questionAccess.name}}</div>
    </div>

    <div class="question-txt">
        <p>{{question.questionBody}}</p>
    </div>
    <div class="post-interact">
        {{#if onlineUserRocked}}
        <div class="already-rocked"></div>
        {{else}}
        <div class="rock-icon"></div>
        {{/if}}
        <div class="rock-ammount">{{pluralize question.rockers.length 'Rock'}}</div>
        <div class="qs-comment-link">+ Comment</div>
        <div class="qs-answer-link">+ Answer</div>
        <div class="question-stats">
        <div class="comment-amount">{{pluralize question.comments.length 'Comment'}}</div>
        <div class="answer-amount">{{pluralize question.answers.length 'Answer'}}</div>
        </div>
        <form>
        <input class="qs-answer question-stream-hide">
        </input>
        <input class="qs-comment question-stream-hide">
        </input>
        </form>
    </div>
</div>