/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 29/January/2013
* Description           : Backbone model for online users
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['baseModel'], function(BaseModel) {
	var OnlineUser = BaseModel.extend({ 
		objName: 'OnlineUser',


		// parse:function(response){
  //       alert(444);
  //      	// console.log(response);

  //      	// @TODO some case we don't need to parse the response 
       
  //      	// response.user = response;
  //      	// response.firstName = response.user.firstName;
  //      	// response.lastName = response.user.lastName;
  //      	// response.major = response.userSchool.major;
  //      	// response.aboutYourself = response.user.about;
  //      	// response.gradeLevel = response.userSchool.year.name;
  //      	// response.degreeProgram = response.userSchool.degree.name;
  //      	// response.graduate = response.userSchool.graduated.name;
  //      	// response.location = response.user.location;
  //      	// response.cellNumber = response.user.contact;
       	
  //      	// delete response.user;
  //      	// delete response.userSchool;
  //      	return response;
  //      },
  

	});
	return OnlineUser;
});