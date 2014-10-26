<!--Templates for left side stream slider-->


<div class="left-menu">
	<div id="add-edit-class">
	</div>
	<div class="display-stream">
		<div class="btn-group stream-dropdown">
			<button class="btn display-dropdown">My Classes</button>
            <button class="btn display-toggle" data-toggle="dropdown" id="stream-nav-dropdown"> <span class="caret display-caret"></span></button>
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
            <div id="show-stream-types"  class="straem-block"> 
                <a  id="streams-list-block" href="/class">
                  
                    <span id="create-stream" class="text">New Stream</span>
                </a>               
               
            </div>
						<a href="#" data-value = "active" class="done">
							<span id="edit-stream-nav"></span>
						</a> 
						</div>
        </div>
        
        
        
        <div class="display-scroller">
					
                <div class="scroll-menu scroller">
                
                    <ul id="sortable4" class="connected sortable list">  
                       {{#each .}}
                             <li id ="{{stream.id.id}}" name="{{stream.streamName}}" data-userCount = "{{usersOfStream}}">
								<a  id ="{{stream.id.id}}"  name ="{{stream.streamName}}"  href="#" class="icon1">{{stream.streamName}}</a>
								<div class="drag-icon drag-rectangle" id="edit-left-tooltip" data-original-title="Drag To Rearrange"></div>
								<span id="{{stream.id.id}}-users" class="menu-count">{{usersOfStream}}</span>
								<span class="close-btn drag-rectangle" data-original-title="Delete"></span>
								</li>  
						{{/each}}   
                    </ul>
                </div>
                <div class="arrow-block arrow-block-down" style="display:none;">
                	<span class="caret arrow-down" id="nav-arrow-down"></span>
                </div>
            </div>

        </div>
</div> 