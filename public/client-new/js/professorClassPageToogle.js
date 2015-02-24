/*
 * This script is used for professor Syllabus info section for the Toggle
 */
$(document).ready(function(){
	
    $("#collapseOneHeading").click(function(){
        $("#classAccess").toggle();
        var isVisibleOneHeading = $( "#classAccess" ).is( ":visible" );
		if(isVisibleOneHeading){
			$("#classAccess").focus();
	        //$("body").click(function(event) {
	        	var data=$("#classAccess").val();
	        	 if(data){
	        		 $("#classAccess").attr("style", "display: inline-block;");
	        	 }else{
	        		 setTimeout(function () {
	        			 var datalater=$("#classAccess").val();
	        			 if(!datalater){
		        			 $("#classAccess").fadeToggle();
	        			 }
	        		 }, 10000);
	        	 }
	    	 //});	
		}
    });

    $("#collapseTwoHeading").click(function(){
        $("#gradedfor").toggle();
        var isVisibleTwoHeading = $( "#gradedfor" ).is( ":visible" );
		if(isVisibleTwoHeading){
			$("#gradedfor").focus();
	        //$("body").click(function(event) {
	        	var gradedfordata=$("#gradedfor").val();
	        	 if(gradedfordata){
	        		 $("#gradedfor").attr("style", "display: inline-block;");
	        	 }else{
	        		 setTimeout(function () {
	        			 var gradedfordatalater=$("#gradedfor").val();
	        			 if(!gradedfordatalater){
		        			 $("#gradedfor").fadeToggle();
	        			 }
	        		 }, 10000);
	        	 }
	    	// });
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
	        //$("body").click(function(event) {
	        	var dataAddAttachment=$("#file-name").text();
	        	var dataresourcetitle=$("#resourcetitle").val();
	        	var dataresourcelink=$("#resourcelink").val();
	        	 if(dataAddAttachment || dataresourcetitle || dataresourcelink){
	        		 $("#resourcetitle").attr("style", "display: inline-block;");
	        		 $("#add-attachment").attr("style", "display: inline-block;");
	        		 $("#resourcelink").attr("style", "display: inline-block;");
	        		 $("#insterlinkTitle").attr("style", "display: inline-block;");
	        	 }else{
	        		 setTimeout(function () {
	        			 var dataAddAttachmentLater=$("#file-name").text();
	     	        	 var dataresourcetitleLater=$("#resourcetitle").val();
	     	        	 var dataresourcelinkLater=$("#resourcelink").val();
	        			 if(!dataAddAttachmentLater && !dataresourcetitleLater && !dataresourcelinkLater){
		        			 $("#resourcetitle").fadeToggle();
			        		 $("#add-attachment").fadeToggle();
			        		 $("#resourcelink").fadeToggle();
			        		 $("#insterlinkTitle").fadeToggle();
	        			 }
	        		 }, 10000);
	        	 }
	    	// });
		}
    });

    $("#collapseFourHeading").click(function(){
    	$("#testresourcetitle").toggle();
        $("#assignment").toggle();
        $("#testdate").toggle();

        var isVisibleFourHeading = $("#testresourcetitle").is( ":visible" );
        if(isVisibleFourHeading){
	        //$("body").click(function(event) {
	        	var datatestresourcetitle=$("#testresourcetitle").val();
	        	var datatestdate=$("#testdate").val();
	        	 if(datatestresourcetitle || datatestdate){
	        		 $("#testresourcetitle").attr("style", "display: inline-block;");
	        		 $("#assignment").attr("style", "display: inline-block;");
	        		 $("#testdate").attr("style", "display: inline-block;");
	        	 }else{
	        		 setTimeout(function () {
	     	        	 var datatestresourcetitleLater=$("#testresourcetitle").val();
	     	        	 var datatestdateLater=$("#testdate").val();
	        			 if(!datatestresourcetitleLater && !datatestdateLater){
		        			 $("#testresourcetitle").fadeToggle();
			        		 $("#assignment").fadeToggle();
			        		 $("#testdate").fadeToggle();
	        			 }
	        		 }, 10000);
	        	 }
	    	// });
		}
		
    });   

    $("#collapseFiveHeading").click(function(){
    	$("#attendance").toggle();

    	var isVisibleFiveHeading = $( "#attendance" ).is( ":visible" );
		if(isVisibleFiveHeading){
	        //$("body").click(function(event) {
	        	var dataattendance=$("#attendance").val();
	        	 if(dataattendance){
	        		 $("#attendance").attr("style", "display: inline-block;");
	        	 }else{
	        		 setTimeout(function () {
	        			 var dataattendanceLater=$("#attendance").val();
	        			 if(!dataattendanceLater){
		        			 $("#attendance").fadeToggle();
	        			 }
	        		 }, 10000);
	        	 }
	    	 //});
		}
    	
    });  
    
});
