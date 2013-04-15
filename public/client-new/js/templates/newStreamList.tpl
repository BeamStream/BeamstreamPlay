<!-- 	* BeamStream
		*
		* Author                : Aswathy P.R (aswathy@toobler.com)
		* Company               : Toobler
		* Email:                : info@toobler.com
		* Web site              : http://www.toobler.com
		* Created               : 28/February/2013
		* Description           : Templates for left side stream slider (if there is no stream )
		* ==============================================================================================
		* Change History:
		* ----------------------------------------------------------------------------------------------
		* Sl.No.  Date   Author   Description
		* -
  -->


<div class="left-menu">
	<div class="display-stream">
		<div class="btn-group stream-dropdown">
			<button class="btn display-dropdown">Display All Streams</button>
            <button class="btn display-toggle" data-toggle="dropdown"> <span class="caret display-caret"></span></button>
            <ul class="dropdown-menu display-sub">
                <li><a href="#">Class Streams</a></li>
                <li><a href="#">Project Streams</a></li>
                <li><a href="#">Study Streams</a></li>
                <li><a href="#">Group Streams</a></li>
                <li><a href="#">Peer Streams</a></li>
                <li><a href="#">Friends Streams</a></li>
                <li><a href="#">Major Streams</a></li>                     
            </ul>
        </div>
        
        
     </div>
        <div class="display-scroller">
                   <div class="scroll-menu scroller">
                
                    <ul id="sortable1" class="connected sortable list">  
                       
                             <li id ="{{stream.id.id}}" name="{{stream.streamName}}" data-userCount = "{{usersOfStream}}" class="no-stream">
								<a  id ="{{stream.id.id}}"  name ="{{stream.streamName}}"  href="#">Create Your Stream Here</a>
								<div class="no-stream-curve"></div>								
								</li>  
						
                    </ul>

                </div>
      
            
        </div>
</div> 