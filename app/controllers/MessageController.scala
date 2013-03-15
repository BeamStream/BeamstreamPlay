package controllers
import play.api.mvc.Controller
import play.api._
import play.api.mvc._
import models.Stream
import play.api.Play.current
import models.Message
import models.User
import org.bson.types.ObjectId
import play.api.cache.Cache
import models.Media
import models.UserType
import java.io.File
import java.util.Date
import models.MessageAccess
import models.MessageType
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import java.text.SimpleDateFormat
import utils.EnumerationSerializer
import utils.ObjectIdSerializer
import models.ResulttoSent
import utils.bitlyAuth
import models.DocResulttoSent
import models.UserMedia
import models.Document
import models.Comment
import models.ResulttoSent

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
      messagePoster.firstName, messagePoster.lastName, 0, List(), List(), 0, List())
    val messageId = Message.createMessage(messageToCreate)
    val messageObtained = Message.findMessageById(messageId.get)
    val userMedia = UserMedia.getProfilePicForAUser(messageObtained.get.userId)
    if (!userMedia.isEmpty) profilePicForUser = userMedia(0).mediaUrl
    val messageJson = write(List(new DocResulttoSent(messageObtained.get, "", "", Option(profilePicForUser), None)))
    Ok(messageJson).as("application/json")

  }


  /*
   * Rock the message
   */
  def rockedTheMessage = Action { implicit request =>
    val messageIdJsonMap = request.body.asFormUrlEncoded.get
    val messageId = messageIdJsonMap("messageId").toList(0)
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
    val shortUrlJson = bitlyAuth.returnShortUrlViabitly(longUrl)
    Ok(shortUrlJson).as("application/json")
  }

  //==================================================================//
  //======Displays all the messages within a Stream sorted by date===//
  //================================================================//
  //TODO we can remove this method because now it has assembled with getAllMessagesForAStream
  def getAllMessagesForAStreamSortedbyDate = Action { implicit request =>
    val streamIdJsonMap = request.body.asFormUrlEncoded.get
    val streamId = streamIdJsonMap("streamId").toList(0)
    val allMessagesForAStream = Message.getAllMessagesForAStreamSortedbyDate(new ObjectId(streamId))
    val allMessagesForAStreamJson = write(allMessagesForAStream)
    Ok(allMessagesForAStreamJson).as("application/json")
  }

  //==================================================================//
  //======Displays all the messages within a Stream sorted by rocks===//
  //================================================================//
  def getAllMessagesForAStreamSortedbyRocks = Action { implicit request =>
    val streamIdJsonMap = request.body.asFormUrlEncoded.get
    val streamId = streamIdJsonMap("streamId").toList(0)
    val pageNo = streamIdJsonMap("pageNo").toList(0).toInt
    val messagesPerPage = streamIdJsonMap("limit").toList(0).toInt
    val allMessagesForAStream = Message.getAllMessagesForAStreamSortedbyRocks(new ObjectId(streamId), pageNo, messagesPerPage)
    val allMessagesForAStreamJson = write(allMessagesForAStream)
    Ok(allMessagesForAStreamJson).as("application/json")
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
   * Follow the messages
   */

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
    {
      val messageIdJsonMap = request.body.asFormUrlEncoded.get
      val messageId = messageIdJsonMap("messageId").toList(0)
      val isARockerOfMessage = Message.isARocker(new ObjectId(messageId), new ObjectId(request.session.get("userId").get))
      Ok(write(isARockerOfMessage.toString)).as("application/json")
    }
  }

  /**
   * Delete A Message
   */

  def deleteTheMessage = Action { implicit request =>
    val messageIdJsonMap = request.body.asFormUrlEncoded.get
    val messageId = messageIdJsonMap("messageId").toList(0)
    val messsageDeleted = Message.deleteMessagePermanently(new ObjectId(messageId), new ObjectId(request.session.get("userId").get))
    if (messsageDeleted == true) Ok(write(new ResulttoSent("Success", "Message Has Been Deleted")))
    else Ok(write(new ResulttoSent("Failure", "You're Not Authorised To Delete This Message")))
  }

  /*
 * ***********************************************************REARCHITECTED CODE****************************************************************
 * ***********************************************************REARCHITECTED CODE****************************************************************
 */


  def allMessagesForAStream(streamId: String, messagesPerPage: Int, pageNo: Int) = Action { implicit request =>

    try {
      val allMessagesForAStream = Message.getAllMessagesForAStreamWithPagination(new ObjectId(streamId), pageNo, messagesPerPage)
      val messagesWithDescription = Message.messagesAlongWithDocDescription(allMessagesForAStream)
      Ok(write(messagesWithDescription)).as("application/json")
    } catch {
      case exception => InternalServerError(write(new ResulttoSent("Failure", "Problem during message retrieval")))
    }
  }

}





