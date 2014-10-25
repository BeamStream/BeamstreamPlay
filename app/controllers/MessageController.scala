package controllers

import java.text.SimpleDateFormat
import java.util.Date
import org.bson.types.ObjectId
import models.DocResulttoSent
import models.Message
import models.Access
import models.Type
import models.User
import models.UserMedia
import net.liftweb.json.Serialization.write
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.ObjectIdSerializer
import utils.BitlyAuthUtil
import models.ResulttoSent
import play.api.mvc.AnyContent
import models.Comment

object MessageController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter: SimpleDateFormat = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  //==========================//
  //======Post a new message==//
  //==========================//

  def newMessage: Action[AnyContent] = Action { implicit request =>
    val messageListJsonMap = request.body.asJson.get
    val streamId = (messageListJsonMap \ "streamId").as[String]
    //    val messageAccess = (messageListJsonMap \ "messageAccess").as[String]
    val messageBody = (messageListJsonMap \ "message").as[String]
    val messagePoster = User.getUserProfile(new ObjectId(request.session.get("userId").get))
    val messageToCreate =
      new Message(new ObjectId, messageBody, Option(Type.Text),
        Option(Access.PrivateToClass), new Date, new ObjectId(request.session.get("userId").get),
        Option(new ObjectId(streamId)), messagePoster.get.firstName, messagePoster.get.lastName, 0, Nil, Nil, 0, Nil, "")
    val messageId = Message.createMessage(messageToCreate)
    val messageObtained = Message.findMessageById(messageId.get)
    val userMedia = UserMedia.getProfilePicForAUser(messageObtained.get.userId)
    val profilePicForUser = (!userMedia.isEmpty) match {
      case true => (userMedia.head.frameURL != "") match {
        case true => userMedia.head.frameURL
        case false => userMedia.head.mediaUrl
      }

      case false => ""
    }

    val messageJson = write(DocResulttoSent(Option(messageObtained.get), None, "", "", false, false, Option(profilePicForUser), None, Option(false), Nil))
    Ok(messageJson).as("application/json")

  }

  /**
   * Rock the message
   */
  def rockedTheMessage(messageId: String): Action[AnyContent] = Action { implicit request =>
    val totalRocks = Message.rockedIt(new ObjectId(messageId), new ObjectId(request.session.get("userId").get))
    val totalRocksJson = write(totalRocks.toString)
    Ok(totalRocksJson).as("application/json")
  }

  /**
   * Rockers of message
   */
  def giveMeRockers(messageId: String): Action[AnyContent] = Action { implicit request =>
    val rockersOfMessage = Message.rockersNames(new ObjectId(messageId))
    val rockerJson = write(rockersOfMessage)
    Ok(rockerJson).as("application/json")
  }

  /**
   * Give Short Url Json Via bitly
   */

  def getShortUrlViabitly: Action[AnyContent] = Action { implicit request =>
    val longUrlMap = request.body.asFormUrlEncoded.get
    val longUrl = longUrlMap("link").toList(0)
    val shortUrlJson = BitlyAuthUtil.returnShortUrlViabitly(longUrl)
    Ok(shortUrlJson).as("application/json")
  }

  //==================================================================//
  //======Displays all the messages within a Stream for a keyword===//
  //================================================================//
  /*def getAllMessagesForAStreambyKeyword: Action[AnyContent] = Action { implicit request =>
    val keywordJsonMap = request.body.asFormUrlEncoded.get
    val keyword = keywordJsonMap("keyword").toList(0)
    val streamId = keywordJsonMap("streamId").toList(0)
    val pageNo = keywordJsonMap("pageNo").toList(0).toInt
    val messagesPerPage = keywordJsonMap("limit").toList(0).toInt
    val allMessagesForAStream = Message.getAllMessagesForAKeyword(keyword, new ObjectId(streamId), pageNo, messagesPerPage)
    val allMessagesForAStreamJson = write(allMessagesForAStream)
    Ok(allMessagesForAStreamJson).as("application/json")
  }*/

  /**
   * Rock the message
   */
  def followTheMessage(messageId: String): Action[AnyContent] = Action { implicit request =>
    val totalFollows = Message.followMessage(new ObjectId(messageId), new ObjectId(request.session.get("userId").get))
    val totalFollowJson = write(totalFollows.toString)
    Ok(totalFollowJson).as("application/json")
  }

  /**
   * Is a follower
   * @ Purpose: identify if the user is following a message or not
   */
  def isAFollower(messageId: String): Action[AnyContent] = Action { implicit request =>
    {
      val isAFollowerOfMessage = Message.isAFollower(new ObjectId(messageId), new ObjectId(request.session.get("userId").get))
      Ok(write(isAFollowerOfMessage.toString)).as("application/json")
    }
  }

  /**
   * Is a Rocker
   * @ Purpose: identify if the user is following a message or not
   */
  def isARocker(messageId: String): Action[AnyContent] = Action { implicit request =>
    val isARockerOfMessage = Message.isARocker(new ObjectId(messageId), new ObjectId(request.session.get("userId").get))
    Ok(write(isARockerOfMessage.toString)).as("application/json")
  }

  /**
   * Delete A Message
   */

  def deleteTheMessage(messageId: String): Action[AnyContent] = Action { implicit request =>
    val messsageDeleted = Message.deleteMessagePermanently(new ObjectId(messageId), new ObjectId(request.session.get("userId").get))
    messsageDeleted match {
      case true => Ok(write(new ResulttoSent("Success", "Message Has Been Deleted"))).as("application/json")
      case false => Ok(write(new ResulttoSent("Failure", "You're Not Authorized To Delete This Message"))).as("application/json")
    }
  }

  /**
   * ***********************************************************REARCHITECTED CODE****************************************************************
   */

  /**
   * All messages for a stream sorted by date & rock along with the limits
   */
  def allMessagesForAStream(streamId: String, sortBy: String, messagesPerPage: Int, pageNo: Int, period: String): Action[AnyContent] =
    Action { implicit request =>
      if (streamId.length() == 24) {
        val allMessagesForAStream = (sortBy == "date") match {
          case true => Message.getAllMessagesForAStreamWithPagination(new ObjectId(streamId), pageNo, messagesPerPage)
          case false => (sortBy == "rock") match {
            case true => Message.getAllMessagesForAStreamSortedbyRocks(new ObjectId(streamId), pageNo, messagesPerPage)
            case false =>
              val comments = Comment.getAllCommentsForAKeyword(sortBy, new ObjectId(streamId))
              val commentIds = comments map { c => c.id }
              Message.getAllMessagesForAKeyword(sortBy, new ObjectId(streamId), pageNo, messagesPerPage, commentIds)
          }
        }
        (allMessagesForAStream.isEmpty) match {
          case true => Ok(write(ResulttoSent("Failure", "No More Data"))).as("application/json")
          case false =>
            val userId = request.session.get("userId").get
            val messagesWithDescription = Message.messagesAlongWithDocDescription(allMessagesForAStream, new ObjectId(userId))
            Ok(write(messagesWithDescription)).as("application/json")
        }
      } else {
        Ok(write(ResulttoSent("Failure", "No More Data"))).as("application/json")
      }
    }
}
