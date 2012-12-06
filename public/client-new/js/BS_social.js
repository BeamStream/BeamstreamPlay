function showJanrainSigninWidget() {

  //console.log('showJanrainSigninWidget called.');

  // Temporary hack to not conflict with previously written code.
  // TODO: Remove need for janRainCount check
//  var janRainCount = $('.janrainContent').length;
//  if(janRainCount > 0) {
//    return;
//  }

  if (typeof window.janrain !== 'object') window.janrain = {};
  if (typeof window.janrain.settings !== 'object') window.janrain.settings = {};

  janrain.settings.tokenUrl = BS.social_authentication;
  janrain.settings.tokenAction = 'event';
  janrain.settings.providers = ['facebook', 'twitter', 'linkedin', 'google'];
  // Hack to hide the "Register via" text
  janrain.settings.fontColor = "#4599d2";

  function isReady() {
    janrain.ready = true;
  };
  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", isReady, false);
  } else {
    window.attachEvent('onload', isReady);
  }

  var e = document.createElement('script');
  e.type = 'text/javascript';
  e.id = 'janrainAuthWidget';

  if (document.location.protocol === 'https:') {
    e.src = 'https://rpxnow.com/js/lib/beamstream/engage.js';
  } else {
    e.src = 'http://widget-cdn.rpxnow.com/js/lib/beamstream/engage.js';
  }

  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(e, s);
}

/**
 * Documentation here.
 */
function loadJanrainShareWidget() {
  console.log('loadJanrainShareWidget');

  if (typeof window.janrain !== 'object') window.janrain = {};
  if (typeof window.janrain.settings !== 'object') window.janrain.settings = {};
  if (typeof window.janrain.settings.share !== 'object') window.janrain.settings.share = {};
  if (typeof window.janrain.settings.packages !== 'object') janrain.settings.packages = [];
  janrain.settings.packages.push('share');

  /* _______________ can edit below this line _______________ */

  janrain.settings.share.message = 'Join Beamstream!';
  janrain.settings.share.title = 'Beamstream!';
  janrain.settings.share.url = 'http://beamstream.com';
  janrain.settings.share.description = 'Join Beamstream now!';
  janrain.settings.share.embed = false;

  /* _______________ can edit above this line _______________ */

  function isReady() { janrain.ready = true; };
  if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", isReady, false);
  } else {
      window.attachEvent('onload', isReady);
  }

  var e = document.createElement('script');
  e.type = 'text/javascript';
  e.id = 'janrainWidgets';

  if (document.location.protocol === 'https:') {
    e.src = 'https://rpxnow.com/js/lib/beamstream/widget.js';
  } else {
    e.src = 'http://widget-cdn.rpxnow.com/js/lib/beamstream/widget.js';
  }

  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(e, s);
}

/**
 * Documentation here.
 */
function showJanrainShareWidget(message, title, url, description) {
  janrain.engage.share.reset();
  janrain.engage.share.setMessage(message);
  janrain.engage.share.setTitle(title);
  janrain.engage.share.setUrl(url);
  janrain.engage.share.setDescription(description);
  janrain.engage.share.show();
}

/**
 * Documentation here.
 * TODO: Implement a queue system to fire off submitted functions.
 */
function janrainWidgetOnload() {
  janrain.events.onProviderLoginToken.addHandler(function (response) {
    $.ajax({
      type: "POST",
      url: BS.social_authentication,
      data: "token=" + response.token,
      success: function (res) {
        console.log(res);
        if (res != null) {

          if (res.stat == "ok") {

            setTimeout(

            function () {
              localStorage["providerName"] = res.profile.providerName;
              /*  Facebook signUp */
              if (res.profile.providerName == "Facebook") {
                if ((res['profile']['address']) === undefined)
                  localStorage["location"] = '';
                else
                  localStorage["location"] = res.profile.address.formatted;
                  localStorage["first-name"] = res.profile.name.givenName;
                  localStorage["last-name"] = res.profile.name.familyName;
                  localStorage["email"] = res.profile.preferredUsername;
                }
                /* LinkedIn signUp */
                else if (res.profile.providerName == "LinkedIn") {
                  var addre=null;
                  //console.log('address- '+res.profile.address.formatted);
                  if ((res['profile']['address']) === undefined)
                   { localStorage["location"] = ''; }
                  else {        
                               //code to finout location using geocode and reverse geocoding
                   geocoder = new google.maps.Geocoder();
                   var address = res.profile.address.formatted;
                   geocoder.geocode( { 'address': address}, function(results, status) {
                   if (status == google.maps.GeocoderStatus.OK) {
                   var data=results[0].geometry.location.$a+','+results[0].geometry.location.ab;
                   var latlngStr = data.split(',', 2);
                   var lat = parseFloat(latlngStr[0]);
                   var lng = parseFloat(latlngStr[1]);
                   var latlng = new google.maps.LatLng(lat, lng);
                   geocoder.geocode({'latLng': latlng}, function(results, status) {
                   if (status == google.maps.GeocoderStatus.OK) {
                    if (results[3]) {
                     var address=results[3].formatted_address;
                     var splitaddress=address.split(",");			
                     localStorage["location"] = splitaddress[0];
                    } 
                    else {
                    localStorage["location"] = '';
                    }
                   } 
                   else {
                 localStorage["location"] = '';
                   }
                   });
                   } else {
            localStorage["location"] = '';
                   }
                   });      
                 }
                localStorage["first-name"] = res.profile.name.givenName;
                localStorage["last-name"] = res.profile.name.familyName;
                localStorage["email"] = res.profile.preferredUsername;
              }
              /* Twitter signUp */
              else if (res.profile.providerName == "Twitter") {
                // split the name into first name and last name
                var formattedName = res.profile.name.formatted;
                var parts = formattedName.split(' ');
                if(parts.length > 1 ) {
                  var firstName = formattedName.substr(0,formattedName.indexOf(' '));
                  var lastName = formattedName.substr(formattedName.indexOf(' ')+1);
                  localStorage["first-name"] = firstName;
                  localStorage["last-name"] = lastName;
                }
                if(parts.length == 1) {
                  localStorage["first-name"] = res.profile.name.formatted;
                  localStorage["last-name"] = "";
                }
                localStorage["email"] = res.profile.preferredUsername;
              }
              /* Google signUp*/
              else if (res.profile.providerName == "Google") {
                localStorage["first-name"] = res.profile.name.givenName;
                localStorage["last-name"] = res.profile.name.familyName;
                localStorage["email"] = res.profile.preferredUsername;
              } else {
                console.log("Not from Social sites");
              }

              BS.JsonFromSocialSite = res;
              if (res.profile.preferredUsername) localStorage["preferredUsername"] = res.profile.preferredUsername;
              if (res.profile.identifier) localStorage["identifier"] = res.profile.identifier;
              var loginModel = new BS.Login();
              loginModel.set({
                email: res.profile.preferredUsername,
                password: "",
                rememberMe: false
              });

              var loginDetails = JSON.stringify(loginModel);

              setTimeout(function () {
                janRainLogin(loginDetails);
              }, 1000);

            }, 1000);

          }
        }
      }
    });
  });
}

/**
 * Added by Aswathy .P.R
 * for login via social site 
 */
function janRainLogin(info) {

	/* post data with school and class details */
	$.ajax({
		type : 'POST',
		url : BS.login,
		data : {
			data : info
		},
		dataType : "json",
		success : function(data) {

			if (data.status == "success") {
				// navigate to stream page
				BS.user.set('loggedin', true);
				BS.AppRouter.navigate("streams", {
					trigger : true,
					replace : true
				});
			} else {
				console.log(localStorage["idLogin"]);
				if (localStorage["idLogin"] == "login") {
					$('#error').html("Login unsuccessfull");
					$('.janrainContent div+div').remove();
				}
				if (localStorage["idLogin"] == "register") {
					//navigate to regitration page
					BS.AppRouter.navigate("basicRegistration", {
						trigger : true,
						replace : true
					});
					localStorage["idLogin"] = '';
				}
			}
		},
		error : function(error) {
			console.log("Error");
		}
	});

}
loadJanrainShareWidget();
