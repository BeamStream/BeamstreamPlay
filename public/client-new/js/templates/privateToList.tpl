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


	 {{#each data}}
		<li><a id="{{this.stream.id.id}}" name="{{this.stream.streamName}}" href="#">{{this.stream.streamName}}</a></li>   
	 {{/each}}
	<li>
		<a href="#">Degree Program</a>
	</li>
	<li>
		<a href="#">My Graduating Year </a>
	</li>
	<li>
		<a href="#">My School</a>
	</li>
	<li>
		<a href="#">Public</a>
	</li>
