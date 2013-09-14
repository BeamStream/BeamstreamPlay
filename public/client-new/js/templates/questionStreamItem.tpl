<div class="question-post">
    <img src="img/alina.jpg" class="profile-picture"></img>
    <div class="username-info">
        <a class="username" href="#">{{question.firstNameofQuestionAsker}} {{question.lastNameofQuestionAsker}}</a>
        <div class="follow-user">FOLLOW</div>
    </div>

    <div class="delete-post"></div>

    <div class="post-info">
        <div class="post-date">{{question.creationDate}}</div>
        <div class="post-type">Public</div>
    </div>

    <div class="question-txt">
        <p>{{question.questionBody}}</p>
    </div>
    <div class="post-interact">
        <div class="rock-icon"></div>
        <div class="rock-ammount">{{question.rockers.length}} Rocks</div>
        <div class="comment">Comment</div>
        <div class="answer">Answer</div>
    </div>
</div>