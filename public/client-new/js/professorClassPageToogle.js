/*
 * This script is used for professor Syllabus info section for the Toggle
 */
$(document).ready(function(){
	
    $("#collapseOneHeading").click(function(){
        $("#classAccess").toggle();
        var isVisibleOneHeading = $( "#classAccess" ).is( ":visible" );
		if(isVisibleOneHeading){
			$("#classAccess").focus();
	        $("#classAccess").blur(function(event) {
	        	var data=$("#classAccess").val();
	        	 if(data){
	        		 $("#classAccess").attr("style", "display: inline-block;");
	        	 }else{
	        		 $("#classAccess").attr("style", "display: none;");
	        	 }
	    	 });	
		}
    });

    $("#collapseTwoHeading").click(function(){
        $("#gradedfor").toggle();
        var isVisibleTwoHeading = $( "#gradedfor" ).is( ":visible" );
		if(isVisibleTwoHeading){
			$("#gradedfor").focus();
	        $("#gradedfor").blur(function(event) {
	        	var gradedfordata=$("#gradedfor").val();
	        	 if(gradedfordata){
	        		 $("#gradedfor").attr("style", "display: inline-block;");
	        	 }else{
	        		 $("#gradedfor").attr("style", "display: none;");
	        	 }
	    	});
		}
    });

    $("#collapseSyllabusHeading").click(function(){
        $("#add-syllabus-attachment").toggle();
        var isVisibleSyllabusHeading = $( "#add-syllabus-attachment" ).is( ":visible" );
		if(isVisibleSyllabusHeading){
	        //$("body").click(function(event) {
	        	var dataAttachment=$("#syllabus-file-name").text();
	        	 if(dataAttachment){
	        		 $("#add-syllabus-attachment").attr("style", "display: inline-block;");
	        	 }else{
	        		 setTimeout(function () {
	        			 var dataAttachmentLater=$("#syllabus-file-name").text();
	        			 if(!dataAttachmentLater){
		        			 $("#add-syllabus-attachment").fadeToggle();
	        			 }
	        		 }, 10000);
	        	 }
	    	 //});
		}
    });

    $("#collapseThreeHeading").click(function(){
        $("#resourcetitle").toggle();
        $("#add-attachment").toggle();
        $("#resourcelink").toggle();
        $("#insterlinkTitle").toggle();
        var isVisibleThreeHeading = $("#resourcetitle").is( ":visible" );
        if(isVisibleThreeHeading){
        	 $("#resourcetitle").focus();
	        $("#resourcetitle").blur(function(event) {
	        	setTimeout(function() {
				  var focused =$("#resourcelink").is(":focus");
				  if(!focused){
					  var dataAddAttachment=$("#file-name").text();
			        	var dataresourcetitle=$("#resourcetitle").val();
			        	var dataresourcelink=$("#resourcelink").val();
			        	 if(dataAddAttachment || dataresourcetitle || dataresourcelink){
			        		 $("#resourcetitle").attr("style", "display: inline-block;");
			        		 $("#add-attachment").attr("style", "display: inline-block;");
			        		 $("#resourcelink").attr("style", "display: inline-block;");
			        		 $("#insterlinkTitle").attr("style", "display: inline-block;");
			        		 
			        	 }else{
			        		 
			        		 $("#resourcetitle").attr("style", "display: none;");
			        		 $("#add-attachment").attr("style", "display: none;");
			        		 $("#resourcelink").attr("style", "display: none;");
			        		 $("#insterlinkTitle").attr("style", "display: none;");
			        	 }
				  }
	        	}, 10);
	        	
	        	
	    	 });
	        
	        
	        $("#resourcelink").blur(function(event) {
	        	setTimeout(function() {
				  var focused =$("#resourcetitle").is(":focus");
				  if(!focused){
					  var dataAddAttachment=$("#file-name").text();
			        	var dataresourcetitle=$("#resourcetitle").val();
			        	var dataresourcelink=$("#resourcelink").val();
			        	 if(dataAddAttachment || dataresourcetitle || dataresourcelink){
			        		 $("#resourcetitle").attr("style", "display: inline-block;");
			        		 $("#add-attachment").attr("style", "display: inline-block;");
			        		 $("#resourcelink").attr("style", "display: inline-block;");
			        		 $("#insterlinkTitle").attr("style", "display: inline-block;");
			        		 
			        	 }else{
			        		 
			        		 $("#resourcetitle").attr("style", "display: none;");
			        		 $("#add-attachment").attr("style", "display: none;");
			        		 $("#resourcelink").attr("style", "display: none;");
			        		 $("#insterlinkTitle").attr("style", "display: none;");
			        	 }
				  }
	        				  
	        	}, 10);
	        	
	        	
	    	 });
	        
		}
    });

    $("#collapseFourHeading").click(function(){
    	$("#testresourcetitle").toggle();
        $("#assignment").toggle();
        $("#testdate").toggle();

        var isVisibleFourHeading = $("#testresourcetitle").is( ":visible" );
        if(isVisibleFourHeading){
        	$("#testresourcetitle").focus();
	        $("#testresourcetitle").blur(function(event) {
	        	setTimeout(function() {
					  var focused =$("#testdate").is(":focus");
					  if(!focused){
						  var datatestresourcetitle=$("#testresourcetitle").val();
				        	var datatestdate=$("#testdate").val();
				        	 if(datatestresourcetitle || datatestdate){
				        		 $("#testresourcetitle").attr("style", "display: inline-block;");
				        		 $("#assignment").attr("style", "display: inline-block;");
				        		 $("#testdate").attr("style", "display: inline-block;");
				        	 }else{
				        		 $("#testresourcetitle").attr("style", "display: none;");
				        		 $("#assignment").attr("style", "display: none;");
				        		 $("#testdate").attr("style", "display: none;");
				        	 }
					  }
					  
					  
					  /*var Isvalue = $("#assignment").val();
					  if(Isvalue){
						  	$("#testresourcetitle").attr("style", "display: inline-block;");
			        		$("#assignment").attr("style", "display: inline-block;");
			        		$("#testdate").attr("style", "display: inline-block;");
						  var isSelected = $("#assignment").is(":selected");
						   if(isSelected){
							  	console.log("selected");
						   }
					  }*/
					  
		        				  
		        }, 10);
	    	 });
	        
	        $("#testdate").blur(function(event) {
	        	setTimeout(function() {
					  var focused =$("#testresourcetitle").is(":focus");
					  if(!focused){
						  var datatestresourcetitle=$("#testresourcetitle").val();
				        	var datatestdate=$("#testdate").val();
				        	 if(datatestresourcetitle || datatestdate){
				        		 $("#testresourcetitle").attr("style", "display: inline-block;");
				        		 $("#assignment").attr("style", "display: inline-block;");
				        		 $("#testdate").attr("style", "display: inline-block;");
				        	 }else{
				        		 $("#testresourcetitle").attr("style", "display: none;");
				        		 $("#assignment").attr("style", "display: none;");
				        		 $("#testdate").attr("style", "display: none;");
				        	 }
					  }
		        				  
		        }, 10);
	    	 });
		}
		
    });   

    $("#collapseFiveHeading").click(function(){
    	$("#attendance").toggle();
    	var isVisibleFiveHeading = $( "#attendance" ).is( ":visible" );
		if(isVisibleFiveHeading){
			$("#attendance").focus();
	        $("#attendance").blur(function(event) {
	        	var dataattendance=$("#attendance").val();
	        	 if(dataattendance){
	        		 $("#attendance").attr("style", "display: inline-block;");
	        	 }else{
	        		 $("#attendance").attr("style", "display: none;");
	        	 }
	    	 });
		}
    	
    });  
    
});
