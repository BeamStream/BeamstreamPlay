 function popit(userId,toWhom , name, profileImageUrl){

    var newChatSocket = new WebSocket('ws://localhost:9000/startChat/'+userId +"/"+toWhom)
     $(".chatbox").css("display", "block");
   var itsId=randomString(8);
    $( ".chatbox" ).append("<div id="+itsId + ">"
                       + '<div class="chatbox-header">'

                           + '<h1 class="friend"></h1>'

                          +  '<div class="exit"></div>'

                          +  '<div class="addfriends-btn"><a href="#"></a></div>'
                       + '</div>' 


                        +'<div class="chatbox-body">'
                         +   '<div class="chatbox-content">'


                          + '<div class="chat-feed" id="main">'
                           +         '<div id="messages"></div>'
                            +    '</div>'
                              
                              
                              
                            +'</div>'

                           + '<div class="left-border"></div>'
                            +'<div class="right-border"></div>'
                        +'</div>' 
                        +'<div class="chatbox-footer">'
                         +   '<div class="my-avatar"></div>'
                         +      '<textarea id="talk" name="styled-textarea" class="message" placeholder="Type message here...">'
                          +      '</textarea>'
                           +     '<p>Press enter to submit message</p>'
                        +'</div>'
                    +'</div>');




                
    
      $("#"+itsId + " "+"h1.friend").text(name);
    var newSendMessage = function() {
    	alert("Naye se gya")
            newChatSocket.send(JSON.stringify(
            {text: $("#"+itsId + " "+"textarea#talk").val()}
        ))
        $("#"+itsId + " "+"textarea#talk").val('')
    }

    var newReceiveEvent = function(event) {
    	alert("Naye me  aaya")
        var data = JSON.parse(event.data)
        //alert(data.user +","+data.message+","+data.kind)        // Handle errors
        if(data.error) {
                newChatSocket.close()
            $("#onError span").text(data.error)
            $("#onError").show()
            return
        } else {
            $("#onChat").show()
        }

        // Create the message element
        var el = $('<div class="message"><span></span><p></p></div>')
        $("span", el).text(data.user)
        $("p", el).text(data.message)
        $(el).addClass(data.kind)
        $("#"+itsId + " "+"div#messages").append(el)
        
    }

    var newHandleReturnKey = function(e) {
        if(e.charCode == 13 || e.keyCode == 13) {
            e.preventDefault()
            newSendMessage()
        }
    }

    $("#"+itsId + " "+"textarea#talk").keypress(newHandleReturnKey)

    newChatSocket.onmessage = newReceiveEvent


            
 }

 
 function startChat(){
         var setNameOfUser="1";
            var chatSocket = new WebSocket('ws://localhost:9000/chat')
            var sendMessage = function() {
            	alert("Purane se gya")
                chatSocket.send(JSON.stringify(
                    {text: $("#talk").val()}
                ))
                $("#talk").val('')
            }

            var receiveEvent = function(event) {
            	alert("Purane me aaya")
             $("#chatbox").css("display", "block");
             $("#chatbox").css("position", "fixed");
             $("#chatbox").css("bottom", "0");
             $("#chatbox").css("right", "622");
           
            
                var data = JSON.parse(event.data)

          if(setNameOfUser=="1") { 
              $(".friend").text(data.user)
               setNameOfUser="0"
               }
                // Handle errors
                if(data.error) {
                    chatSocket.close()
                    $("#onError span").text(data.error)
                    $("#onError").show()
                    return
                } else {
                    $("#onChat").show()
                }

                // Create the message element
                var el = $('<div class="message"><span></span><p></p></div>')
                $("span", el).text(data.user)
                $("p", el).text(data.message)
                $(el).addClass(data.kind)
                $('#messages').append(el)
               
            }

            var handleReturnKey = function(e) {
                if(e.charCode == 13 || e.keyCode == 13) {
                    e.preventDefault()
                    sendMessage()
                }
            }

           $("#talk").keypress(handleReturnKey)

            chatSocket.onmessage = receiveEvent
 }