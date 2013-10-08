//package controllers
//
//import play.api.mvc.Controller
//import play.api.mvc.Action
//import models.User
//import org.bson.types.ObjectId
//import utils.ChatRoom
//import play.api.mvc.WebSocket
//import play.api.libs.json.JsValue
//
//object ChatController extends Controller {
//
//  /**
//   * Chatting Logic
//   */
//  def chat(userName: String, userId: String, chatWith: String) = WebSocket.async[JsValue] { request =>
//    ChatRoom.join(userName, userId, chatWith)
//  }
//
//  /**
//   * Enter In To ChatRoom
//   */
//  def chatRoom = Action { implicit request =>
//    val roomToJoin = request.queryString.get("chatWith")
//    val user = User.getUserProfile(new ObjectId(request.session.get("userId").get))
//    (roomToJoin == None) match {
//      case true => Ok(views.html.chatRoom(user.head.firstName, user.head.id.toString, ""))
//      case false => Ok(views.html.chatRoom(user.head.firstName, user.head.id.toString, roomToJoin.head.head))
//    }
//  }
//
//}