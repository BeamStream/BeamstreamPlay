package controllers

import java.text.SimpleDateFormat
import java.util.Date
import org.bson.types.ObjectId
import models.DocResulttoSent
import models.Message
import models.MessageAccess
import models.MessageType
import models.ResulttoSent
import models.User
import models.UserMedia
import net.liftweb.json.Serialization.write
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.ObjectIdSerializer
import utils.bitlyAuthUtil

object MessageController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  //==========================//
  //======Post a new message==//
  //==========================//

  def newMessage = Action { implicit request =>
    var profilePicForUser = ""
    val messageListJsonMap = request.body.asJson.get
    println(messageListJsonMap)
    val streamId = (messageListJsonMap \ "streamId").as[String]
    val messageAccess = (messageListJsonMap \ "messageAccess").as[String]
    val messageBody = (messageListJsonMap \ "message").as[String]
    println(streamId)
    val messagePoster = User.getUserProfile(new ObjectId(request.session.get("userId").get))
    val messageToCreate = new Message(new ObjectId, messageBody, Option(MessageType.Text), Option(MessageAccess.withName(messageAccess)), new Date, new ObjectId(request.session.get("userId").get), Option(new ObjectId(streamId)),
      messagePoster.get.firstName, messagePoster.get.lastName, 0, Nil, Nil, 0, Nil)
    val messageId = Message.createMessage(messageToCreate)
    val messageObtained = Message.findMessageById(messageId.get)
    val userMedia = UserMedia.getProfilePicForAUser(messageObtained.get.userId)
    if (!userMedia.isEmpty) profilePicForUser = userMedia(0).mediaUrl
    val messageJson = write(List(new DocResulttoSent(messageObtained.get, "", "", Option(profilePicForUser), None)))
    Ok(messageJson).as("application/json")

  }

  /**
   * Rock the message
   */
  def rockedTheMessage(messageId: String) = Action { implicit request =>
    val totalRocks = Message.rockedIt(new ObjectId(messageId), new ObjectId(request.session.get("userId").get))
    val totalRocksJson = write(totalRocks.toString)
    Ok(totalRocksJson).as("application/json")
  }

  /**
   * Rockers of message
   */
  def giveMeRockers = Action { implicit request =>
    val messageIdJsonMap = request.body.asFormUrlEncoded.get
    val messageId = messageIdJsonMap("messageId").toList(0)
    val weAreRockers = Message.rockersNames(new ObjectId(messageId))
    val WeAreRockersJson = write(weAreRockers)
    Ok(WeAreRockersJson).as("application/json")
  }

  /**
   * Give Short Url Json Via bitly
   */

  def getShortUrlViabitly = Action { implicit request =>
    val longUrlMap = request.body.asFormUrlEncoded.get
    val longUrl = longUrlMap("link").toList(0)
    val shortUrlJson = bitlyAuthUtil.returnShortUrlViabitly(longUrl)
    Ok(shortUrlJson).as("application/json")
  }

  //==================================================================//
  //======Displays all the messages within a Stream for a keyword===//
  //================================================================//
  def getAllMessagesForAStreambyKeyword = Action { implicit request =>
    val keywordJsonMap = request.body.asFormUrlEncoded.get
    val keyword = keywordJsonMap("keyword").toList(0)
    val streamId = keywordJsonMap("streamId").toList(0)
    val pageNo = keywordJsonMap("pageNo").toList(0).toInt
    val messagesPerPage = keywordJsonMap("limit").toList(0).toInt
    val allMessagesForAStream = Message.getAllMessagesForAKeyword(keyword, new ObjectId(streamId), pageNo, messagesPerPage)
    val allMessagesForAStreamJson = write(allMessagesForAStream)
    Ok(allMessagesForAStreamJson).as("application/json")
  }

  /**
   * Rock the message
   */
  def followTheMessage = Action { implicit request =>
    val messageIdJsonMap = request.body.asFormUrlEncoded.get
    val messageId = messageIdJsonMap("messageId").toList(0)
    val totalFollows = Message.followMessage(new ObjectId(messageId), new ObjectId(request.session.get("userId").get))
    val totalFollowJson = write(totalFollows.toString)
    Ok(totalFollowJson).as("application/json")
  }

  /**
   * Is a follower
   * @ Purpose: identify if the user is following a message or not
   */
  def isAFollower = Action { implicit request =>
    {
      val messageIdJsonMap = request.body.asFormUrlEncoded.get
      val messageId = messageIdJsonMap("messageId").toList(0)
      val isAFollowerOfMessage = Message.isAFollower(new ObjectId(messageId), new ObjectId(request.session.get("userId").get))
      Ok(write(isAFollowerOfMessage.toString)).as("application/json")
    }
  }

  /**
   * Is a Rocker
   * @ Purpose: identify if the user is following a message or not
   */
  def isARocker = Action { implicit request =>
    val messageIdJsonMap = request.body.asFormUrlEncoded.get
    val messageId = messageIdJsonMap("messageId").toList(0)
    val isARockerOfMessage = Message.isARocker(new ObjectId(messageId), new ObjectId(request.session.get("userId").get))
    Ok(write(isARockerOfMessage.toString)).as("application/json")
  }

  /**
   * Delete A Message
   */

  def deleteTheMessage(messageId:String) = Action { implicit request =>
    val messsageDeleted = Message.deleteMessagePermanently(new ObjectId(messageId), new ObjectId(request.session.get("userId").get))
    if (messsageDeleted == true) Ok(write(new ResulttoSent("Success", "Message Has Been Deleted")))
    else Ok(write(new ResulttoSent("Failure", "You're Not Authorised To Delete This Message")))
  }

  /**
   * ***********************************************************REARCHITECTED CODE****************************************************************
   */

  /**
   * All messages for a stream sorted by date & rock along with the limits
   */
  def allMessagesForAStream(streamId: String, sortBy: String, messagesPerPage: Int, pageNo: Int) = Action { implicit request =>

    try {

      val allMessagesForAStream = (sortBy == "date") match {
        case true => Message.getAllMessagesForAStreamWithPagination(new ObjectId(streamId), pageNo, messagesPerPage)
        case false => (sortBy == "rock") match {
          case true => Message.getAllMessagesForAStreamSortedbyRocks(new ObjectId(streamId), pageNo, messagesPerPage)
          case false => Nil
        }
      }
      val messagesWithDescription = Message.messagesAlongWithDocDescription(allMessagesForAStream)
      Ok(write(messagesWithDescription)).as("application/json")

    } catch {
      case exception => InternalServerError(write(new ResulttoSent("Failure", "Problem during message retrieval")))
    }
  }

}





