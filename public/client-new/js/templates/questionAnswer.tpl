
<div class="answer-description"  id="{{data.id.id}}">
    <div class="follw-left">          
        <div class="ask-img"><img id="{{data.id.id}}-image" src="{{#if profileImage}}{{profileImage}}{{else}}/beamstream-new/images/profile-upload.png{{/if}}"></div>                      
    </div>
    <div class="answer-description-info">
      <div class="follow-names">
        <ul class="follow-name-left show-all-block">
          <li><span>@{{data.firstNameofCommentPoster}} {{data.lastNameofCommentPoster}} </span> -  {{data.timeCreated}}  -  Private to Class</li>
          <li ><a href="#" class="rock-answers">Nice!</a></li>
          <li class="rocks-small-answer"><a id="{{{data.id.id}}-mrockCount" href="#">{{{data.rocks}}</a></li>
          <!--li><a class="comment-icon" href="#"></a></li-->
             
        </ul>
      </div>
      <p>{{data.commentBody}}</p>
      <a id="{{data.id.id}}" href="#" data-username={{data.userId.id}} data-original-title="Delete" class="delete_answer drag-rectangle" ></a>
    </div>
    <div class="clear"></div>
  </div>