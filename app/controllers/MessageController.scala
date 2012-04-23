package controllers
import play.api.mvc.Controller
import play.api._
import play.api.mvc._
import play.api.mvc.Response
import models.Quote
import models.Stream
import play.api.data._
import play.api.data.Forms._
import models.MessageForm
import models.Message
import models.User
import org.bson.types.ObjectId
import play.api.cache.Cache
import models.Media
import com.mongodb.gridfs.GridFSDBFile
import models.UserType
import java.io.File
import play.api.libs.iteratee.Enumerator

object MessageController extends Controller {

  val messageForm = Form(
    mapping(
      "message" -> nonEmptyText,
      "access" -> optional(checked("Private")))(MessageForm.apply)(MessageForm.unapply))

  //==========================//
  //======Post a new message==//
  //==========================//

  val tempUser = User(new ObjectId, UserType.Professional, "", "", "", "", "", "", "", "", List(100, 101), List(), List())

  def newMessage = Action { implicit request =>

    messageForm.bindFromRequest.fold(

      errors => BadRequest(views.html.message(Message.getAllMessagesForAStream(new ObjectId), errors, List(), tempUser, new GridFSDBFile)),
      messageForm => {

        val messagePoster = User.getUserProfile((new ObjectId(request.session.get("userId").get)))
        Message.create(messageForm, new ObjectId(request.session.get("userId").get), new ObjectId(request.session.get("streamId").get),
          messagePoster.firstName, messagePoster.lastName)

        Redirect(routes.MessageController.streamMessages(request.session.get("streamId").get))

      })
  }

  def messages = Action { implicit request =>

    val profileName = User.getUserProfile((new ObjectId(request.session.get("userId").get)))
    val streams = Stream.getAllStreamforAUser(new ObjectId(request.session.get("userId").get))

    Ok(views.html.message(Message.getAllMessagesForAStream(new ObjectId), messageForm, streams, profileName, new GridFSDBFile))

  }

  //=================================================//
  //======Displays all the messages within a Stram===//
  //=================================================//

  def streamMessages(id: String) = Action { implicit request =>
    val profileName = User.getUserProfile(new ObjectId(request.session.get("userId").get))
    val streams = Stream.getAllStreamforAUser(new ObjectId(request.session.get("userId").get))
    val messagesListFound = Message.getAllMessagesForAStream(new ObjectId(id))
    Ok(views.html.message(messagesListFound, messageForm, streams, profileName, new GridFSDBFile)).withSession(session + ("streamId" -> id))

  }

  /*
   * get the profle pic for a User
   */
  def getProfilePic = Action { implicit request =>

    val media = Media.getAllMediaByUser(new ObjectId(request.session.get("userId").get))

    (media.isEmpty) match {
      case false =>
        val photoId: ObjectId = media(0).gridFsId
        val profileImage = Media.findMedia(photoId)
        profileImage.writeTo("./public/temp/" + profileImage.filename)
        Ok("http://localhost:9000/assets/temp/" + profileImage.filename).as("image/jpg")

      case true =>
        Ok("http://localhost:9000/assets/temp/noimage").as("image/jpg")
    }

  }

}

