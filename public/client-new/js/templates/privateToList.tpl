<!-- 	* BeamStream
		*
		* Author                : Aswathy P.R (aswathy@toobler.com)
		* Company               : Toobler
		* Email:                : info@toobler.com
		* Web site              : http://www.toobler.com
		* Created               : 15/March/2013
		* Description           : Templates for the Private to List section on Discussion / Question page
		* ==============================================================================================
		* Change History:
		* ----------------------------------------------------------------------------------------------
		* Sl.No.  Date   Author   Description
		* -
  -->


	 {{#each .}}
		<li><a id="{{stream.id.id}}" name="{{stream.streamName}}" value="PrivateToClass" href="#">{{stream.streamName}}</a></li>   
	 {{/each}}
	<li>
		<a href="#" value="PrivateToDegree" >Degree Program</a>
	</li>
	<li>
		<a href="#" value="PrivateToGradYear">My Graduating Year </a>
	</li>
	<li>
		<a href="#" value="PrivateToSchool" >My School</a>
	</li>
	<li>
		<a href="#" value="Public" >Public</a>
	</li>
