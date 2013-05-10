{{#each .}}
	{{#if images}}
		
		<li   data-rock="{{images.rocks}}" data-date-created="{{images.dateCreated}}" class="item" >
			<div class="image-wrapper hovereffect"  id="{{images.id.id}}">
				<div class="hover-div">
					<img class="filmedia-picture" src="{{images.mediaUrl}}">
					<input type="hidden" id="fileType-{{images.id.id}}" value="{{images.contentType.name}}">
					<div class="hover-text">
						<div class="comment-wrapper"> 
							<a href="#imagelist" class="image-list" style="text-decoration: none">
								<div id="media-{{images.id.id}}" >
								<h4 id="name-{{images.id.id}}">{{#if images.name}}{{images.name}}{{else}}Image Name{{/if}}</h4>
								<div class="description-info">
								<div class="description-left">
									<p class="doc-description " id="description-{{images.id.id}}" >{{#if images.description}}{{images.description}}{{else}}Image Description{{/if}}</p>
								</div>
							</a>
							<div id="{{images.id.id}}" class="comment-wrapper2">
								<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   
								<a href="#" class="hand-icon rock-medias"></a>
								<a href="#" class="message-icon"></a>   
							 	<a href="#" class="share-icon"></a>
							</div>
						</div>
					</div>
					<h5 class="doctitle" id="{{images.id.id}}">
						<span><img src="images/title-plus.png"></span> Title & Description
					</h5>    
					<div class="dateinfo">
						<span class="state">{{images.access.name}}</span>
						<span class="date">{{images.dateCreated}}</span>
					</div>
				</div>
			</div>
			</div>
			<div class="comment-wrapper1"> <a class="common-icon camera" href="#"></a>
				<ul id="{{images.id.id}}-activities" class="comment-list">
					<li><a class="eye-icon" href="#">0</a></li>
					<li><a class="hand-icon" href="#">0</a></li>
					<li><a class="message-icon" href="#">0</a></li>
				</ul>
			</div>
		</li>
	{{/if}}
	{{#if videos}}
		<li data-rock="{{videos.rocks}}" data-date-created="{{videos.dateCreated}}" class="item" >
			<div class="image-wrapper hovereffect">
			<div class="hover-div">
				<img class="filmedia-picture" src="{{videos.frameURL}}">
				<input type="hidden" id="fileType-{{videos.id.id}}" value="{{videos.contentType.name}}">
				<div class="hover-text">               
					<div class="comment-wrapper">                               
						<a href="#videos" class="video-list" style="text-decoration: none">
							<div id="media-{{videos.id.id}}">
							<h4 id="name-{{videos.id.id}}">{{#if videos.name}}{{videos.name}}{{else}}Video Name {{/if}}</h4>
							<div class="description-info">
							<div class="description-left">
								<p id="description-{{videos.id.id}}" class="doc-description ">{{#if videos.description}} {{videos.description}}{{else}}Video Description{{/if}}</p>
							</div>
						</a>
						<div id="{{videos.id.id}}" class="comment-wrapper2">
							<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   
							<a href="#" class="hand-icon rock-medias"></a>
							<a href="#" class="message-icon"></a>    
							<a href="#" class="share-icon"></a>
						</div>
					</div>
				</div>
					<h5 class="doctitle" id="{{videos.id.id}}">
						<span><img src="images/title-plus.png"></span> Title & Description
					</h5>          
					<div class="dateinfo">
						<span class="state">{{videos.access.name}}</span>
						<span class="date">{{videos.dateCreated}}</span>
					</div>
				</div>
			</div>
			</div>
			<div class="comment-wrapper1"> <a class="common-icon video" href="#"></a>
				<ul id="{{videos.id.id}}-activities" class="comment-list">
					<li><a class="eye-icon" href="#">0</a></li>
					<li><a class="hand-icon" href="#">{{videos.rocks}}</a></li>
					<li><a class="message-icon" href="#">0</a></li>
				</ul>
			</div>
		</li>
	{{/if}}
	{{#if documents}}
		
		<li data-groups="["recent"]" data-date-created="{{documents.creationDate}}" class="item" >
			<div class="image-wrapper hovereffect" id="{{documents.id.id}}">
		 		<div class="hover-div">
			 		<img class="cover-picture" src="/beamstream-new/images/docs_image.png ">
			 		<input type="hidden" id="fileType-{{documents.id.id}}" value="{{documents.documentType.name}}">
					<div class="hover-text">              
						<div class="comment-wrapper">                               
							<a href="#docs"  class="document-list" style="text-decoration: none">
							 	<div id="media-{{documents.id.id}}" >
							 	<h4 id="name-{{documents.id.id}}">{{#if documents.documentName}}{{documents.documentName}}{{else}}Document Name{{/if}}</h4>
								<div class="description-info">
								<div class="description-left">
									<p id="description-{{documents.id.id}}" class="doc-description ">{{#if documents.documentDescription}}{{documents.documentDescription}}{{else}}Document Description{{/if}}</p>
								</div>
							</a>
							<div id="{{documents.id.id}}" class="comment-wrapper2">
								<a href="#" class="tag-icon" data-original-title="Search by Users">
								</a>   	
								<a href="#" class="hand-icon rock_docs"></a>
								<a href="#" class="message-icon"></a>
								<a href="#" class="share-icon"></a>
							</div>
						</div>
					</div>
					<h5 class="doctitle" id="{{documents.id.id}}">
						<span><img src="/beamstream-new/images/title-plus.png"></span> Title & Description
					</h5>          
					<div class="dateinfo">
						<span class="state">{{documents.documentAccess.name}}</span>
						<span class="date">{{documents.creationDate}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="comment-wrapper1"> <a class="common-icon data" href="#"></a>
			<ul id="{{documents.id.id}}-activities" class="comment-list">
			<li><a class="eye-icon" href="#">0</a></li>
			<li><a class="hand-icon" href="#">{{documents.documentRocks}}</a></li>
			<li><a class="message-icon" href="#">0</a></li>
			</ul>
		</div>
		</li>
	{{/if}}
	{{#if pdfFiles}}
		
		<li data-groups="["oldest"]" data-date-created="{{pdfFiles.creationDate}}" class="item" >
			<div class="image-wrapper hovereffect" id="{{pdfFiles.id.id}}">
		 		<div class="hover-div">
			 		<img class="cover-picture" src="{{pdfFiles.previewImageUrl}}">
			 		<input type="hidden" id="fileType-{{pdfFiles.id.id}}" value="{{pdfFiles.documentType.name}}">
					<div class="hover-text">              
						<div class="comment-wrapper">                               
							<a href="#pdfFiles" class="pdf-list" style="text-decoration: none">
							 	<div id="media-{{pdfFiles.id.id}}" >
							 	<h4 id="name-{{pdfFiles.id.id}}">{{#if pdfFiles.documentName}}{{pdfFiles.documentName}}{{else}}Document Name{{/if}}</h4>
								<div class="description-info">
								<div class="description-left">
									<p id="description-{{pdfFiles.id.id}}" class="doc-description ">{{#if pdfFiles.documentDescription}}{{pdfFiles.documentDescription}}{{else}}Document Description{{/if}}</p>
								</div>
							</a>
							<div id="{{pdfFiles.id.id}}" class="comment-wrapper2">
								<a href="#" class="tag-icon" data-original-title="Search by Users">
								</a>   	
								<a href="#" class="hand-icon rock_docs"></a>
								<a href="#" class="message-icon"></a>
								<a href="#" class="share-icon"></a>
							</div>
						</div>
					</div>
					<h5 class="doctitle" id="{{pdfFiles.id.id}}">
						<span><img src="/beamstream-new/images/title-plus.png"></span> Title & Description
					</h5>          
					<div class="dateinfo">
						<span class="state">{{pdfFiles.documentAccess.name}}</span>
						<span class="date">{{pdfFiles.creationDate}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="comment-wrapper1"> <a class="common-icon data" href="#"></a>
			<ul id="{{documents.id.id}}-activities" class="comment-list">
			<li><a class="eye-icon" href="#">0</a></li>
			<li><a class="hand-icon" href="#">{{pdfFiles.documentRocks}}</a></li>
			<li><a class="message-icon" href="#">0</a></li>
			</ul>
		</div>
		</li>
	{{/if}}
	{{#if pptFiles}}
		
		<li data-groups="["oldest"]" data-date-created="{{pptFiles.creationDate}}" class="item" >
			<div class="image-wrapper hovereffect" id="{{pptFiles.id.id}}">
		 		<div class="hover-div">
			 		<img class="cover-picture" src="/beamstream-new/images/presentations_image.png">
			 		<input type="hidden" id="fileType-{{pptFiles.id.id}}" value="{{pptFiles.documentType.name}}">
					<div class="hover-text">              
						<div class="comment-wrapper">                               
							<a href="#presentations" class="ppt-list" style="text-decoration: none">
							 	<div id="media-{{pptFiles.id.id}}" >
							 	<h4 id="name-{{pptFiles.id.id}}">{{#if pptFiles.documentName}}{{pptFiles.documentName}}{{else}}Doscument Name{{/if}}</h4>
								<div class="description-info">
								<div class="description-left">
									<p id="description-{{pptFiles.id.id}}" class="doc-description ">{{#if pptFiles.documentDescription}}{{pptFiles.documentDescription}}{{else}} Document Description{{/if}}</p>
								</div>
							</a>
							<div id="{{pptFiles.id.id}}" class="comment-wrapper2">
								<a href="#" class="tag-icon" data-original-title="Search by Users">
								</a>   	
								<a href="#" class="hand-icon rock_docs"></a>
								<a href="#" class="message-icon"></a>
								<a href="#" class="share-icon"></a>
							</div>
						</div>
					</div>
					<h5 class="doctitle" id="{{pptFiles.id.id}}">
						<span><img src="/beamstream-new/images/title-plus.png"></span> Title & Description
					</h5>          
					<div class="dateinfo">
						<span class="state">{{pptFiles.documentAccess.name}}</span>
						<span class="date">{{pptFiles.creationDate}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="comment-wrapper1"> <a class="common-icon data" href="#"></a>
			<ul id="{{documents.id.id}}-activities" class="comment-list">
			<li><a class="eye-icon" href="#">0</a></li>
			<li><a class="hand-icon" href="#">{{pdfFiles.documentRocks}}</a></li>
			<li><a class="message-icon" href="#">0</a></li>
			</ul>
		</div>
		</li>
	{{/if}}
	

{{/each}}