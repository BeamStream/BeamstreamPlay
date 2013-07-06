
{{#ifequal fileType "image"}}
<li   data-rock="{{data.rocks}}" data-date-created="{{data.dateCreated}}" class="item" >
			<div class="image-wrapper hovereffect"  id="{{data.id.id}}">
				<div class="hover-div">
					<img class="filmedia-picture" src="{{data.mediaUrl}}">
					<input type="hidden" id="fileType-{{data.id.id}}" value="{{data.contentType.name}}">
					<div class="hover-text">
						<div class="comment-wrapper"> 
							<a class="" style="text-decoration: none">
								<div id="media-{{id.id}}" >
								<h4 id="name-{{data.id.id}}">{{#if data.name}}{{data.name}}{{else}}Image Name{{/if}}</h4>
								<div class="description-info">
									<div class="gallery"></div>
								 	<div class="gallery">
								 		<a href="{{data.mediaUrl}}" style="text-decoration: none" rel="prettyPhoto[gallery2]">
											<div class="description-left">
												<p class="doc-description " id="description-{{data.id.id}}" >{{#if data.description}}{{data.description}}{{else}}Image Description{{/if}}</p>
											</div>
									    </a>
									  </div>
							</a>
							<div id="{{data.id.id}}" class="comment-wrapper2">
								<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   
								<a href="#" class="hand-icon rock-medias"></a>
								<a href="#" class="message-icon"></a>   
							 	<a href="#" class="share-icon"></a>
							</div>
						</div>
					</div>
					<h5 class="ediTitle" id="{{data.id.id}}">
						<span><img src="/beamstream-new/images/title-plus.png"></span> Title & Description
					</h5>    
					<div class="dateinfo">
						<span class="state">{{data.access.name}}</span>
						<span class="date date-btn">{{data.dateCreated}}</span>
					</div>
				</div>
			</div>
			</div>
			<div class="comment-wrapper1"> <a class="common-icon camera" href="#"></a>
				<ul id="{{data.id.id}}-activities" class="comment-list">
					<li><a class="eye-icon" href="#">0</a></li>
					<li><a class="hand-icon" href="#">{{data.rocks}}</a></li>
					<li><a class="message-icon" href="#">0</a></li>
				</ul>
			</div>
		</li>


{{/ifequal}}
{{#ifequal fileType "video"}}
	<li data-rock="{{data.rocks}}" data-date-created="{{data.dateCreated}}" class="item" >
			<div class="image-wrapper hovereffect">
			<div class="hover-div">
				<img class="filmedia-picture" src="{{data.frameURL}}">
				<input type="hidden" id="fileType-{{data.id.id}}" value="{{data.contentType.name}}">
				<div class="hover-text">               
					<div class="comment-wrapper">                               
						<a  class="" style="text-decoration: none">
							<div id="media-{{data.id.id}}">
							<h4 id="name-{{data.id.id}}">{{#if data.name}}{{data.name}}{{else}}Video Name {{/if}}</h4>
							<div class="description-info">
								<div class="gallery"></div>
								<div class="gallery">
									<a href="{{data.mediaUrl}}" style="text-decoration: none" rel="prettyPhoto[gallery3]">
										<div class="description-left">
											<p id="description-{{data.id.id}}" class="doc-description ">{{#if data.description}} {{data.description}}{{else}}Video Description{{/if}}</p>
										</div>
									</a>
								</div>
						</a>
						<div id="{{data.id.id}}" class="comment-wrapper2">
							<a href="#" class="tag-icon" data-original-title="Search by Users"></a>   
							<a href="#" class="hand-icon rock-medias"></a>
							<a href="#" class="message-icon"></a>    
							<a href="#" class="share-icon"></a>
						</div>
					</div>
				</div>
					<h5 class="ediTitle" id="{{data.id.id}}">
						<span><img src="/beamstream-new/images/title-plus.png"></span> Title & Description
					</h5>          
					<div class="dateinfo">
						<span class="state">{{data.access.name}}</span>
						<span class="date date-btn">{{data.dateCreated}}</span>
					</div>
				</div>
			</div>
			</div>
			<div class="comment-wrapper1"> <a class="common-icon video" href="#"></a>
				<ul id="{{data.id.id}}-activities" class="comment-list">
					<li><a class="eye-icon" href="#">0</a></li>
					<li><a class="hand-icon" href="#">{{data.rocks}}</a></li>
					<li><a class="message-icon" href="#">0</a></li>
				</ul>
			</div>
		</li>
{{/ifequal}}
{{#ifequal fileType "documents"}}
	<li data-groups='["recent"]' data-rock="{{data.documentRocks}}" data-date-created="{{data.creationDate}}" class="item" >
			<div class="image-wrapper hovereffect" id="{{data.id.id}}">
		 		<div class="hover-div">
			 		<img class="cover-picture" src="/beamstream-new/images/textimage.png ">
			 		<input type="hidden" id="fileType-{{data.id.id}}" value="{{data.documentType.name}}">
			 		<h3 class="common-doctext" >{{extension}}</h3>
					<div class="hover-text">              
						<div class="comment-wrapper">                               
							<a  class="" style="text-decoration: none">
							 	<div id="media-{{data.id.id}}" >
							 	<h4 id="name-{{data.id.id}}">{{#if data.documentName}}{{data.documentName}}{{else}}Document Name{{/if}}</h4>
								<div class="description-info">
								 <input type="hidden" id="id-{{data.id.id}}"  value="{{data.documentURL}}">  
								<div id="{{data.id.id}}" name="{{type}}" class="description-left documents-popup">
									<p id="description-{{data.id.id}}" class="doc-description ">{{#if data.documentDescription}}{{data.documentDescription}}{{else}}Document Description{{/if}}</p>
								</div>
							</a>
							<div id="{{data.id.id}}" class="comment-wrapper2">
								<a href="#" class="tag-icon" data-original-title="Search by Users">
								</a>   	
								<a href="#" class="hand-icon rock_docs"></a>
								<a href="#" class="message-icon"></a>
								<a href="#" class="share-icon"></a>
							</div>
						</div>
					</div>
					<h5 class="ediTitle" id="{{data.id.id}}">
						<span><img src="/beamstream-new/images/title-plus.png"></span> Title & Description
					</h5>          
					<div class="dateinfo">
						<span class="state">{{data.documentAccess.name}}</span>
						<span class="date date-btn">{{data.creationDate}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="comment-wrapper1"> <a class="common-icon data" href="#"></a>
			<ul id="{{data.id.id}}-activities" class="comment-list">
			<li><a class="eye-icon" href="#">0</a></li>
			<li><a class="hand-icon" href="#">{{data.documentRocks}}</a></li>
			<li><a class="message-icon" href="#">0</a></li>
			</ul>
		</div>
		</li>

		

{{/ifequal}}

{{#ifequal fileType "googleDoc"}}
	<li data-groups='["recent"]' data-rock="{{data.documentRocks}}" data-date-created="{{data.creationDate}}" class="item" >
			<div class="image-wrapper hovereffect" id="{{data.id.id}}">
		 		<div class="hover-div">
			 		<img class="cover-picture" src="/beamstream-new/images/google_docs_image.png">
			 		<input type="hidden" id="fileType-{{data.id.id}}" value="{{data.documentType.name}}">
			 		<h3 class="common-doctext" >{{extension}}</h3>
					<div class="hover-text">              
						<div class="comment-wrapper">                               
							<a  class="" style="text-decoration: none">
							 	<div id="media-{{data.id.id}}" >
							 	<h4 id="name-{{data.id.id}}">{{#if data.documentName}}{{data.documentName}}{{else}}Document Name{{/if}}</h4>
								<div class="description-info">
								 <input type="hidden" id="id-{{data.id.id}}"  value="{{data.documentURL}}">  
								<div id="{{data.id.id}}" name="googleDoc" class="description-left documents-popup">
									<p id="description-{{data.id.id}}" class="doc-description ">{{#if data.documentDescription}}{{data.documentDescription}}{{else}}Document Description{{/if}}</p>
								</div>
							</a>
							<div id="{{data.id.id}}" class="comment-wrapper2">
								<a href="#" class="tag-icon" data-original-title="Search by Users">
								</a>   	
								<a href="#" class="hand-icon rock_docs"></a>
								<a href="#" class="message-icon"></a>
								<a href="#" class="share-icon"></a>
							</div>
						</div>
					</div>
					<h5 class="ediTitle" id="{{data.id.id}}">
						<span><img src="/beamstream-new/images/title-plus.png"></span> Title & Description
					</h5>          
					<div class="dateinfo">
						<span class="state">{{data.documentAccess.name}}</span>
						<span class="date date-btn">{{data.creationDate}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="comment-wrapper1"> <a class="common-icon data" href="#"></a>
			<ul id="{{data.id.id}}-activities" class="comment-list">
			<li><a class="eye-icon" href="#">0</a></li>
			<li><a class="hand-icon" href="#">{{data.documentRocks}}</a></li>
			<li><a class="message-icon" href="#">0</a></li>
			</ul>
		</div>
		</li>

		

{{/ifequal}}


{{#ifequal fileType "pdf"}}
	<li data-groups='["oldest"]' data-rock="{{data.documentRocks}}"  data-date-created="{{data.creationDate}}" class="item" >
			<div class="image-wrapper hovereffect" id="{{data.id.id}}">
		 		<div class="hover-div">
			 		<img class="filmedia-picture" src="{{data.previewImageUrl}}">
			 		<input type="hidden" id="fileType-{{data.id.id}}" value="{{data.documentType.name}}">
					<div class="hover-text">              
						<div class="comment-wrapper">                               
							<a  class="" style="text-decoration: none">
							 	<div id="media-{{data.id.id}}" >
							 	<h4 id="name-{{data.id.id}}">{{#if data.documentName}}{{data.documentName}}{{else}}Document Name{{/if}}</h4>
								<div class="description-info">
									 <input type="hidden" id="id-{{data.id.id}}"  value="{{data.documentURL}}">  
								<div id="{{data.id.id}}" name="{{type}}" class="description-left documents-popup">

									<p id="description-{{data.id.id}}" class="doc-description ">{{#if data.documentDescription}}{{data.documentDescription}}{{else}}Document Description{{/if}}</p>
								</div>
							</a>
							<div id="{{data.id.id}}" class="comment-wrapper2">
								<a href="#" class="tag-icon" data-original-title="Search by Users">
								</a>   	
								<a href="#" class="hand-icon rock_docs"></a>
								<a href="#" class="message-icon"></a>
								<a href="#" class="share-icon"></a>
							</div>
						</div>
					</div>
					<h5 class="ediTitle" id="{{data.id.id}}">
						<span><img src="/beamstream-new/images/title-plus.png"></span> Title & Description
					</h5>          
					<div class="dateinfo">
						<span class="state">{{data.documentAccess.name}}</span>
						<span class="date date-btn">{{data.creationDate}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="comment-wrapper1"> <a class="common-icon data" href="#"></a>
			<ul id="{{data.id.id}}-activities" class="comment-list">
			<li><a class="eye-icon" href="#">0</a></li>
			<li><a class="hand-icon" href="#">{{data.documentRocks}}</a></li>
			<li><a class="message-icon" href="#">0</a></li>
			</ul>
		</div>
		</li>
{{/ifequal}}
{{#ifequal fileType "ppt"}}
	<li data-groups='["oldest"]' data-rock="{{data.documentRocks}}" data-date-created="{{data.creationDate}}" class="item" >
			<div class="image-wrapper hovereffect" id="{{data.id.id}}">
		 		<div class="hover-div">
			 		<img class="cover-picture" src="/beamstream-new/images/presentations_image.png">
			 		<input type="hidden" id="fileType-{{data.id.id}}" value="{{data.documentType.name}}">
					<div class="hover-text">              
						<div class="comment-wrapper">                               
							<a  class="" style="text-decoration: none">
							 	<div id="media-{{data.id.id}}" >
							 	<h4 id="name-{{data.id.id}}">{{#if data.documentName}}{{data.documentName}}{{else}}Doscument Name{{/if}}</h4>
								<div class="description-info">
									 <input type="hidden" id="id-{{data.id.id}}"  value="{{data.documentURL}}">  
								<div id="{{data.id.id}}" name="{{type}}" class="description-left documents-popup">
									<p id="description-{{data.id.id}}" class="doc-description ">{{#if data.documentDescription}}{{data.documentDescription}}{{else}} Document Description{{/if}}</p>
								</div>
							</a>
							<div id="{{data.id.id}}" class="comment-wrapper2">
								<a href="#" class="tag-icon" data-original-title="Search by Users">
								</a>   	
								<a href="#" class="hand-icon rock_docs"></a>
								<a href="#" class="message-icon"></a>
								<a href="#" class="share-icon"></a>
							</div>
						</div>
					</div>
					<h5 class="ediTitle" id="{{data.id.id}}">
						<span><img src="/beamstream-new/images/title-plus.png"></span> Title & Description
					</h5>          
					<div class="dateinfo">
						<span class="state">{{data.documentAccess.name}}</span>
						<span class="date date-btn">{{data.creationDate}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="comment-wrapper1"> <a class="common-icon data" href="#"></a>
			<ul id="{{data.id.id}}-activities" class="comment-list">
			<li><a class="eye-icon" href="#">0</a></li>
			<li><a class="hand-icon" href="#">{{pdfFiles.documentRocks}}</a></li>
			<li><a class="message-icon" href="#">0</a></li>
			</ul>
		</div>
		</li>
{{/ifequal}}

