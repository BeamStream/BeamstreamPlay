package controllers
import play.api.mvc.Controller
import net.liftweb.json.DefaultFormats
import play.api.mvc.Action
import models.User
import org.bson.types.ObjectId
import models.Message
import java.util.Date
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import utils.ObjectIdSerializer
import models.ResulttoSent

object CommentController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
  } + new ObjectIdSerializer

  def newComment = Action { implicit request =>
    val commentJson = request.body.asFormUrlEncoded.get
    val messageId = commentJson("messageId").toList(0)
    val commentText = commentJson("comment").toList(0)
    val commentPoster = User.getUserProfile(new ObjectId(request.session.get("userId").get))
    val comment = new Message(new ObjectId, commentText, None, None, new Date, new ObjectId(request.session.get("userId").get), None,
      commentPoster.firstName, commentPoster.lastName, 0, List(), List())

    // Creating Comment & adding to message
    val commentId = Message.createMessage(comment)
    Message.addCommentToMessage(commentId, new ObjectId(messageId))
    val commentObtained = Message.findMessageById(commentId)
    Ok(write(List(commentObtained)))

  }

  /*
   * Get All Comment for a message
   * @Purpose For displaying all the comments along with a message
   */

  def allCommentsForAMessage = Action { implicit request =>
    val messageIdJSON = request.body.asFormUrlEncoded.get
    val messageId = messageIdJSON("messageId").toList(0)
    val message = Message.findMessageById(new ObjectId(messageId))
    var commentsForAMessage: List[Message] = List()

    for (commentsId <- message.comments) {
      val comment = Message.findMessageById(commentsId)
      commentsForAMessage ++= List(comment)
    }

    Ok(write(commentsForAMessage)).as("application/json")

  }

}