<!-- 	* BeamStream
		*
		* Author                : Aswathy P.R (aswathy@toobler.com)
		* Company               : Toobler
		* Email:                : info@toobler.com
		* Web site              : http://www.toobler.com
		* Created               : 15/March/2013
		* Description           : Templates for Discussion page Comments
		* ==============================================================================================
		* Change History:
		* ----------------------------------------------------------------------------------------------
		* Sl.No.  Date   Author   Description
		* -
  -->

{{#each .}}
<div class="answer-description"  id="{{id.id}}">
    <div class="follw-left">          
        <div class="ask-img"><img id="{{id.id}}-image" src=""></div>                      
    </div>
    <div class="answer-description-info">
      <div class="follow-names">
        <ul class="follow-name-left show-all-block">
          <li><span>@{{firstNameofCommentPoster}} {{lastNameofCommentPoster}} </span> -  {{timeCreated}}  -  Public</li>
          <li ><a href="#" class="rock-comments" >Rock</a></li>
          <li><a class="comment-icon" href="#"></a></li>
             <li class="rocks-small"><a id="{{{id.id}}-mrockCount" href="#">{{{rocks}}</a></li>
        </ul>
      </div>
      <p>{{commentBody}}</p>
      <a id="{{id.id}}" href="#" data-username={{userId.id}} data-original-title="Delete" class="delete_comment drag-rectangle" ></a>
    </div>
    <div class="clear"></div>
  </div>
  {{/each}}