<div class="question-post">
    <img src="{{profilePic}}" class="profile-picture"></img>
    <div class="username-info">
        <a class="username" href="#">{{question.firstNameofQuestionAsker}} {{question.lastNameofQuestionAsker}}</a>
        <div class="follow-question">FOLLOW</div>
    </div>

    <div class="delete-post"></div>

    <div class="post-info">
        <div class="post-date">{{question.creationDate}}</div>
        <div class="post-type">{{question.questionAccess.name}}</div>
    </div>

    <div class="question-txt">
        <p>{{question.questionBody}}</p>
    </div>
    <div class="post-interact">
        <div class="rock-icon"></div>
        <div class="rock-ammount">{{question.rockers.length}} Rocks</div>
        <div class="qs-comment-link">Comment</div>
        <div class="qs-answer-link">Answer</div>
        <div class="question-stats">
        <div class="comment-amount">{{question.comments.length}} Comments</div>
        <div class="answer-amount">{{question.answers.length}} Answers</div>
        </div>
        <form>
        <input class="qs-answer question-stream-hide">
        </input>
        <input class="qs-comment question-stream-hide">
        </input>
        </form>
    </div>
</div>