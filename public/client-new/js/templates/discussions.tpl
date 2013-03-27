 <!-- 	* BeamStream
		*
		* Author                : Aswathy P.R (aswathy@toobler.com)
		* Company               : Toobler
		* Email:                : info@toobler.com
		* Web site              : http://www.toobler.com
		* Created               : 07/March/2013
		* Description           : Templates discussion page
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
                  <li><a href="#" name="most-recent" value="date">Most Recent</a></li>
                  <li><a href="#" name="highest-rated" value="rock">Highest Rated</a></li>
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
                <input type="text" id="sort_by_key" class="quest-search" placeholder="Search Discussions">
              </form>
              
              
            </div>
            <div class="clear"></div>
          </div>
          <div class="ask-outer">
            <div class="ask-content">
              <div class="follw-left">
                  <div class="ask-img"><img id="main-photo" src=""></div>
              </div>
              
              
              <div  class="ask-info">
                <div class="ask-comment">
                  <div class="ask-left">
                    <form class="question-ask ask-disccution">
                      <textarea id="msg-area" name="" cols="" rows="" class="question-ask-search" placeholder="Speak your mind...."  onfocus="this.placeholder = ''" onblur="this.placeholder = 'Speak your mind....'"></textarea>
                    </form>
                      <ul>
                        <li id="uploded-file"  style="display:none; font-style: italic; list-style: none" class="answer">                                       
                     
                    </li>
                      <li id="progressbar" style="display:none; list-style: none">
                          <div class="progress-container" >
                              <div class="progress progress-striped active">
                                <div class="bar" style="width: 0%;"></div>
                              </div> 
                          </div> 
                      </li>
                      </ul>
                      
                    <div class="embed-info">
                      <div class="upload-conatiner">
                        <h5> Select an image or video file on your computer.</h5>
                        <input type="file" id="upload-files-area" name="upload-files-area" >
                      </div>
                    </div>
                  </div>
                  <a  id="post-button" class="ask-button">POST</a>
                  <div id="file-upload-loader" style="display :none;">  
							<!-- <img src ="images/loading.gif"> -->
        		</div>
                   </div>
                  
                <div class="ask-iconinfo">
  	          <div id="upload-files1" class="btn-group attach-drop ">
              <button  id="upload-files" data-original-title="Upload Files" class="btn attach-drop-bg drag-rectangle "></button>
              <button id="upload-files2" class="btn attach-drop-button drag-rectangle" data-toggle="dropdown" data-original-title="Upload Files"> <span  id="upload-files3" class="caret sort-caret1 attach-caret "></span></button>
              <ul id="discussion-file-upload"  class="dropdown-menu  attach-dropdwon">
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
                  <!-- <li class="drag-rectangle"  data-original-title="Upload Files" ><a id="upload-files"  href="#"><img src="images/attach.png" width="22" height="20"></a></li>-->
                    <li class="tag"><a href="#"></a></li>
                  </ul>
                  <label class="checkbox private-chaeck">
                    <input id="private-to" type="checkbox"  checked="checked">
                    Pivate to:</label>
                  <div class="btn-group class-dropdown "  >
                    <button class="btn class-dropdown-bg " id="select-privateTo" ></button>
                    <button class="btn class-dropdown-button " data-toggle="dropdown"> <span class="caret sort-caret"></span></button>
                    <ul class="dropdown-menu stream-list" id="private-to-list" >
                    
                      
                    </ul>
                  </div>
                   <ul id="share-discussions" class="social-icons">
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
          
          <div id= "all-messages">

          </div>
        </div>
     

 