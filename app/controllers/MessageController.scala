package controllers
import play.api.mvc.Controller
import play.api._
import play.api.mvc._
import play.api.mvc.Response
import models.Stream
import play.api.data._
import play.api.data.Forms._
import play.api.Play.current
import models.Message
import models.User
import org.bson.types.ObjectId
import play.api.cache.Cache
import models.Media
import com.mongodb.gridfs.GridFSDBFile
import models.UserType
import java.io.File
import play.api.libs.iteratee.Enumerator
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

object MessageController extends Controller {

  //  implicit val formats = DefaultFormats
  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  //==========================//
  //======Post a new message==//
  //==========================//

  def newMessage = Action { implicit request =>
    val messageListJsonMap = request.body.asFormUrlEncoded.get
    (messageListJsonMap.contains(("streamId"))) match {
      case false =>
        Ok(write(new ResulttoSent("Failure", "StreamIdNotFound")))
      case true =>
        val streamId = messageListJsonMap("streamId").toList(0)
        val messageAccess = messageListJsonMap("messageAccess").toList(0)
        val messageBody = messageListJsonMap("message").toList(0)
        val messagePoster = User.getUserProfile(new ObjectId(request.session.get("userId").get))
        val messageToCreate = new Message(new ObjectId, messageBody, None, Option(MessageAccess.withName(messageAccess)), new Date, new ObjectId(request.session.get("userId").get), Option(new ObjectId(streamId)),
          messagePoster.firstName, messagePoster.lastName, 0, List(), List(), 0, List())
        val messageId = Message.createMessage(messageToCreate)
        val messageObtained = Message.findMessageById(messageId)
        val messageJson = write(List(messageObtained))
        Ok(messageJson).as("application/json")

    }

  }

  def messages = Action { implicit request =>
    val profileName = User.getUserProfile((new ObjectId(request.session.get("userId").get)))
    val streams = Stream.getAllStreamforAUser(new ObjectId(request.session.get("userId").get))
    Ok
  }

  def streamMessages(id: String) = Action { implicit request =>
    val profileName = User.getUserProfile(new ObjectId(request.session.get("userId").get))
    val streams = Stream.getAllStreamforAUser(new ObjectId(request.session.get("userId").get))
    val messagesListFound = Message.getAllMessagesForAStream(new ObjectId(id))
    Ok
  }

  //==================================================//
  //======Displays all the messages within a Stream===//
  //==================================================//
  def getAllMessagesForAStreamWithPagination = Action { implicit request =>
    val streamIdJsonMap = request.body.asFormUrlEncoded.get
    val streamId = streamIdJsonMap("streamId").toList(0)
    val pageNo = streamIdJsonMap("pageNo").toList(0).toInt
    val messagesPerPage = streamIdJsonMap("limit").toList(0).toInt
    val allMessagesForAStream = Message.getAllMessagesForAStreamWithPagination(new ObjectId(streamId), pageNo, messagesPerPage)
    val allMessagesForAStreamJson = write(allMessagesForAStream)
    Ok(allMessagesForAStreamJson).as("application/json")
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

  /*
    * Rockers of message
    */
  def giveMeRockers = Action { implicit request =>
    val messageIdJsonMap = request.body.asFormUrlEncoded.get
    val messageId = messageIdJsonMap("messageId").toList(0)
    val weAreRockers = Message.rockersNames(new ObjectId(messageId))
    val WeAreRockersJson = write(weAreRockers)
    Ok(WeAreRockersJson).as("application/json")
  }

  /*
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
//    println(streamId,pageNo,messagesPerPage)
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
    val pageNo = keywordJsonMap("pageNo").toList(0).toInt
    val messagesPerPage = keywordJsonMap("limit").toList(0).toInt
    val allMessagesForAStream = Message.getAllMessagesForAKeyword(keyword,pageNo,messagesPerPage)
    val allMessagesForAStreamJson = write(allMessagesForAStream)
    Ok(allMessagesForAStreamJson).as("application/json")
  }

  /*
   * Follow the messages
   */

  /*
   * Rock the message
   */
  def followTheMessage = Action { implicit request =>
    val messageIdJsonMap = request.body.asFormUrlEncoded.get
    val messageId = messageIdJsonMap("messageId").toList(0)
    val totalFollows = Message.followMessage(new ObjectId(messageId), new ObjectId(request.session.get("userId").get))
    val totalFollowJson = write(totalFollows.toString)
    Ok(totalFollowJson).as("application/json")
  }

  /*
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

}

