BS.GoogleDocsView = Backbone.View.extend({
        events:{
                "click a#file-type" : "showFilesTypes",
                "click ul.file-type li a" : "hideList",
                "click '.nav a" : "addActive",
                "click .upload_button" : "uploadFile",
//              "click #profile-images":"listProfileImages",
                "click .google_doc" : "showDocPopup",
                "click .filter-options li a" : "filterDocs",
                "click .doctitle" : "editDocTitle",
                 "click #prevslid" : "previous",
                 "click #nextslid" : "next"
 	      	 },
    
        initialize:function() {
            console.log("google docs view is loded");
            var type = "files";
            var profileView = new BS.ProfileView();
            profileView.getProfileImages(type);
            this.docsList();   
            this.source = $("#tpl-docsview").html();
            this.template = Handlebars.compile(this.source);
             },
             
        render:function (eventName) {
            $(this.el).html(this.template);
            return this;
            },
            
            /**
            * show file types
            */
        showFilesTypes :function(eventName){
    	    eventName.preventDefault();
            $('.file-type').slideDown();
    	    }, 
            
            /**
             * hide file types
            */
        hideList : function(eventName){
            eventName.preventDefault();
            $('.file-type').slideUp();
    	    },
             
        addActive : function(eventName){
            var id = eventName.target;
            var $this = $(id);
            console.log( $this);
            if (!$this.is('.dropdown-toggle')) {
	    $this
	    .closest('ul')
            .find('li').removeClass('active').end()
            .end()
            .closest('li').addClass('active');
            }
            },
         
            /* post the documents details */
        uploadFile : function()
            {
            var documentModel = new BS.Document();
            documentModel.set({
            docName : $("#gdoc-name").val(),
            docURL : $("#gdoc-url").val(),
            docAccess: 'Public',
            docType: 'GoogleDocs'
            });
            var documentData = JSON.stringify(documentModel);
            var self = this;
            $.ajax({
                type : 'POST',
                url : BS.docUpload,
                data : {
                       data : documentData
                       },
                dataType : "json",
                success : function(data) {
                if(data.status == 'Failure')
                    alert("Failed.Please try again");
                else
                {
                    alert("Doc Uploaded Successfully");
                self.docsList(); 
                }
                }           
                });
                },
            
        /*
         *   To list the documents in the view        
         *
         */           
        docsList : function(eventName)
            {    
              //  eventName.preventDefault();              
            var i = 1;
            var j=1;
            var self = this;
            BS.user.fetch({ success:function(e) {
                    
                /* get profile images for user */
            $.ajax({
                type : 'POST',
                url :  BS.getAllDocs,
                data : {
                'userId': e.attributes.id.id
                },
                dataType : "json",
                success : function(docs) {

                   console.log("docs"); 
                   console.log("docs"); 
                   var content = '';
            
                //   if(docs.status == 'success')    {
                _.each(docs, function(doc) {  
                
                                                     
                var datVal =  self.formatDateVal(doc.creationDate);
                content += '<li id="file-docs-'+i+'" data-key="['+datVal+']"> <div class="image-wrapper hovereffect" >'
                                
                                +'<div class="comment-wrapper comment-wrapper2">'
                                +' <a href="#" class="tag-icon" data-original-title="Search by Users"></a>'
                                +'<a href="#" class="hand-icon"></a>'
                                +'<a href="#" class="message-icon"></a>'
                                +'<a href="#" class="share-icon"></a>'
                                +'</div>'
                                +'<h4> '+doc.name+'</h4>'
                                +' <p class="google_doc" id="'+doc.id.id+'">'
                                +'<input type="hidden" id="id-'+doc.id.id+'" value="'+doc.url+'">'
                                +'The Power of The Platform Behance Network Join The Leading Platform For </p>'
                                +'<h5 class="doctitle"> Title & Description</h5>'
                                +'<span>State</span>'
                                +' <span class="date">'+datVal+'</span>' 
                                +'</div>'
                                +'<div class="comment-wrapper comment-wrapper1"> '
                                +' <a class="common-icon link" href="#">'
                                +'<span class="right-arrow"></span>'
                                +' </a>'
                                +'<ul class="comment-list">'
                                +'<li><a class="eye-icon" href="#">87</a></li>'
                                +'  <li><a class="hand-icon" href="#">5</a></li>'
                                +'   <li><a class="message-icon" href="#">10</a></li>'
                                +' </ul>'
                                +'</div> </li>'; 
                
                i++;
                j=i;
                });  
                
                $('#grid').html(content);
                self.pagination();                                       
                   }
              //  }

                });
                }});
                // $('#content').html(BS.listDocsView.el);
            },
            
            /*
            * pagination for docsview
            *
            */
            pagination: function(){
                    var show_per_page = 16;                                     //number of <li> listed in the page
                    var number_of_items = $('#grid').children().size();  
                    var number_of_pages = Math.ceil(number_of_items/show_per_page);  
                    var navigation_count='';
                    $('#current_page').val(0);  
                    $('#show_per_page').val(show_per_page);  
                    var navigation_Prev = '<div class="previous_link" ></div>';  
                    var current_link = 0;  
                    while(number_of_pages > current_link){  
                        navigation_count += '<a class="page_link" href="javascript:go_to_page(' + current_link +')" longdesc="' + current_link +'">'+ (current_link + 1) +'</a>';  
                        current_link++;  
                    }  
                    var navigation_next = '<div class="next_link" ></div>';  
                    $('#prevslid').html(navigation_Prev);                       //previous slider icon
                    $('#page_navigation-count').html(navigation_count);  
                    $('#nextslid').html(navigation_next);                       //next slider icon   
                    $('#page_navigation-count .page_link:first').addClass('active_page');  

                    $('#grid').children().css('display', 'none');  

                    $('#grid').children().slice(0, show_per_page).css('display', 'block');  
            },
            
            /*
            * Part of pagination and is used to show previous page
            *
            */
           previous: function (){  
               new_page = parseInt($('#current_page').val()) - 1;  
                    if($('.active_page').prev('.page_link').length==true){  
                        this.go_to_page(new_page);  
                    }  
  
            },  
            
            /*
            * Part of pagination and is used to show next page
            *
            */
            next:function (){  
                new_page = parseInt($('#current_page').val()) + 1;  
                console.log(new_page);
                if($('.active_page').next('.page_link').length==true){  
                    console.log("inside if");
                    this.go_to_page(new_page);  
                }  
            },
            
            /*
            * Part of pagination and is used to page setting
            *
            */
            go_to_page:function (page_num){  
                var show_per_page = parseInt($('#show_per_page').val());  

                start_from = page_num * show_per_page;  

                end_on = start_from + show_per_page;  

                $('#grid').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');  

                   $('.page_link[longdesc=' + page_num +']').addClass('active_page').siblings('.active_page').removeClass('active_page');  

                $('#current_page').val(page_num);  
            },  

        
            /*
             * Format date and returns 
             */
        formatDateVal: function(dateVal)
            {
            var m_names = new Array("January", "February", "March", 
            "April", "May", "June", "July", "August", "September", 
            "October", "November", "December");
            var d = new Date(dateVal);
            var curr_date = d.getDate();
            var curr_month = d.getMonth() + 1; //Months are zero based
            var curr_year = d.getFullYear();
            return curr_date + " " + m_names[curr_month] + ", " + curr_year;
            },
        
        /**
         * Edited By Aswathy @TODO
         * For Doc popups
         */
        showDocPopup :function(eventName){
            var docId = eventName.currentTarget.id;
            console.log('docId' +docId);
            var docUrl = $('input#id-'+docId).val();  
            console.log(docUrl);
            newwindow=window.open(docUrl,'','height=550,width=1000,top=100,left=145');     
            },
        
        /**
         * filter docs.. and prevent default action
         */
        filterDocs :function (eventName){
            eventName.preventDefault();
            },
            
        /*Edit the document title
         * 
         */  
        editDocTitle :function(){
            console.log("editDocTitle");
            }
    
})

