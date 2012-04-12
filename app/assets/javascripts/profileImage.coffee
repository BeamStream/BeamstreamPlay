$ ->
  $.get "/getProfilePic", (item) ->
      $("#Pic").append "<img src='" + item + "'/>"