<!-- 	* BeamStream
		*
		* Author                : Aswathy P.R (aswathy@toobler.com)
		* Company               : Toobler
		* Email:                : info@toobler.com
		* Web site              : http://www.toobler.com
		* Created               : 28/February/2013
		* Description           : Templates for left side stream slider
		* ==============================================================================================
		* Change History:
		* ----------------------------------------------------------------------------------------------
		* Sl.No.  Date   Author   Description
		* -
  -->


<div class="left-menu">
	<div class="display-stream">
		<div class="btn-group stream-dropdown">
			<button class="btn display-dropdown">Class Streams</button>
            <button class="btn display-toggle" data-toggle="dropdown"> <span class="caret display-caret"></span></button>
            <ul class="dropdown-menu display-sub">
                <li><a href="#">Class Streams</a></li>
                <!--
                <li><a href="#">Project Streams</a></li>
                <li><a href="#">Study Streams</a></li>
                <li><a href="#">Group Streams</a></li>
                <li><a href="#">Peer Streams</a></li>
                <li><a href="#">Friends Streams</a></li>
                <li><a href="#">Major Streams</a></li>   
                -->                  
            </ul>
        </div>
        
        
        <a href="#" data-value = "active" class="done">EDIT </a> </div>
        <div class="display-scroller">
            <div class="arrow-block"><span class="caret arrow-up"></span></div>
                <div class="scroll-menu scroller">
                
                    <ul id="sortable4" class="connected sortable list">  
                       {{#each .}}
                             <li id ="{{stream.id.id}}" name="{{stream.streamName}}" data-userCount = "{{usersOfStream}}">
								<a  id ="{{stream.id.id}}"  name ="{{stream.streamName}}"  href="#" class="icon1">{{stream.streamName}}</a>
								<div class="drag-icon drag-rectangle" data-original-title="Drag To Rearrange"></div>
								<span id="{{stream.id.id}}-users" class="menu-count">{{usersOfStream}}</span>
								<span class="close-btn drag-rectangle" data-original-title="Delete"></span>
								</li>  
						{{/each}}   
                    </ul>
                </div>
                <div class="arrow-block arrow-block-down"></div>
            </div>
            <div id="show-stream-types"  class="straem-block"> 
                <a  id="streams-list-block" href="/class">
                    <span></span>
                    <span id="create-stream" class="text">New Stream</span>
                </a>               
               
            </div>
        </div>
</div> 