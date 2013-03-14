 <!-- 	* BeamStream
		*
		* Author                : Aswathy P.R (aswathy@toobler.com)
		* Company               : Toobler
		* Email:                : info@toobler.com
		* Web site              : http://www.toobler.com
		* Created               : 07/March/2013
		* Description           : Templates questions page
		* ==============================================================================================
		* Change History:
		* ----------------------------------------------------------------------------------------------
		* Sl.No.  Date   Author   Description
		* -
  -->
  
<div class="stream-wrapper">
          <div class="question-info">
            <div class="question-sort">
              <h5>SORT BY</h5>
              <div class="btn-group dropdown-outer">
                <button class="btn normal-dropdown" id="sortBy-select" >Most Recent</button>
                <button class="btn blue-button " data-toggle="dropdown"> <span class="caret sort-caret"></span></button>
                <ul class="dropdown-menu display-sub" id="sortBy-list" >
                  <li><a href="#" name="most-recent" >Most Recent</a></li>
                  <li><a href="#" name="highest-rated" >Highest Rated</a></li>
                  <li><a href="#" name="most-shared" >Most Shared </a></li>
                </ul>
              </div>
              
               <div class="btn-group dropdown-outer">
                <button class="btn normal-dropdown " id="date-sort-select">This Week</button>
                <button class="btn blue-button " data-toggle="dropdown"> <span class="caret sort-caret"></span></button>
                <ul class="dropdown-menu display-sub" id="date-sort-list">
                  <li><a href="#">Today</a></li>
                  <li><a href="#">This Week</a></li>
                  <li><a href="#">This Month </a></li>
 				  <li><a href="#">All Dates </a></li>

                </ul>
              </div>
              
              <form class="all-search">
                <input type="text" id="sortQ_by_key" class="quest-search" placeholder="Search Questions">
              </form>
              <input id="upload-files-area" name="upload-files-area" type="file" style="display:none;" >
              <a href="#" class="unanswerd active-text">20 Unanswered</a> <a href="#" class="unanswerd">12 Answered</a> </div>
            <div class="clear"></div>
          </div>
          <div class="ask-outer">
            <div class="ask-content">
              <div class="follw-left">
                  <div class="ask-img"><img id="main-photo" src=""></div>
              </div>
              <div  class="ask-info">
                <div class="ask-comment ask-type-area ">
                  <div class="ask-left">
                    <form class="question-ask">
                      <textarea id="Q-area" placeholder="Ask your own question here....." onfocus="this.placeholder = ''" onblur="this.placeholder = 'Ask your own question here.....'" class="question-ask-search" rows="" cols="" name=""></textarea>
                    </form>
                    <ul id="pollArea" class="answer" style="display:none">
                      <li>
                        <input name="Answer Is Yes" type="text" id="option1"  placeholder="Add 1st Poll Option">
                      <li>
                        <input name="Add Option" type="text" id="option2" placeholder="Add 2nd Poll Option">
                      </li>
                      <a href="#" class="add-option">Another Poll Option</a>
                    </ul>
                     <ul id="uploded-file" class="answer" style="display:none; font-style: italic;">
                       
                    </ul>
                  </div>
                  <a  id="post-question"  class="ask-button">ASK</a> 
<div id="file-upload-loader" style="display :none;">  
							<!--<img src ="images/loading.gif"> -->
        		</div></div>
                <div class="ask-iconinfo">
				   <div class="btn-group attach-drop">
              		<button  id="upload-files" data-original-title="Upload Files" class="btn attach-drop-bg drag-rectangle"></button>
             		 <button data-original-title="Upload Files" class="btn attach-drop-button drag-rectangle" data-toggle="dropdown"> <span class="caret sort-caret1 attach-caret"></span></button>
            		  <ul id="question-file-upload" class="dropdown-menu">
              		   <li><a href="#">Class Document</a></li>
                      <li><a href="#">Assignment</a></li>
                      <li><a href="#">Homework </a></li>
						<li><a href="#">Notes</a></li>
                      <li><a href="#">Project</a></li>
                      <li><a href="#">Lecture </a></li>
					 <li><a href="#">Reference Material</a></li>
                      <li><a href="#">Tutorial</a></li>
                      <li><a href="#">EdTech Tool </a></li>
						<li><a href="#">Amusement</a></li>
						<input type="text" placeholder="+Add a new category">
              		</ul>
           		 </div>
          		        <ul class="icons-ask">
                  
                    <li class="tag"></li>
                  </ul>
                  <label class="checkbox private-chaeck">
                    <input  id="private-to" type="checkbox"  checked="checked">
                    Pivate to:</label>
                  <div class="btn-group class-dropdown">
                    <button class="btn class-dropdown-bg" id="select-privateTo" >Class</button>
                    <button class="btn class-dropdown-button " data-toggle="dropdown"> <span class="caret sort-caret"></span></button>
                    <ul class="dropdown-menu" id="private-to-list">
                       
                    </ul>
                  </div>
                  <a href="#" class="add-poll ">Add Poll</a>
                  <ul  id="share-discussions" class="social-icons">
					<span>Share On:</span>
                    <li name="email" class="google-plus"><a href="#">Google plus</a></li>
                    <li name="plus" class="plus"><a href="#">p</a></li>
                    <li  name="twitter" class="twitter"> <a href="#">Twitter</a></li>
                    <li name="facebook" class="facebook"><a href="#"> face book</a></li>
                    <li name="linkedin" class="in"><a href="#"> in</a></li>

                  </ul>
                </div>
              </div>
            </div>
            <div class="clear"></div>
          </div>
          
</div>

 