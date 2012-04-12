$ ->
  $.get "/listUsers", (data) ->
    $.each data, (index, item) ->
      $("#Users").append "<li>User :" + item.firstName + " " + item.lastName + " " + item.orgName + " " + index + "</li>"