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
import models.Comment

object CommentController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
  } + new ObjectIdSerializer

  def newComment = Action { implicit request =>
    val commentJson = request.body.asFormUrlEncoded.get
    val messageId = commentJson("messageId").toList(0)
    val commentText = commentJson("comment").toList(0)
    val commentPoster = User.getUserProfile(new ObjectId(request.session.get("userId").get))
    val comment = new Comment(new ObjectId, commentText, new Date, new ObjectId(request.session.get("userId").get),
      commentPoster.firstName, commentPoster.lastName, 0, List(), 0, List())

    // Creating Comment & adding to message
    // val commentId = Message.createMessage(comment)
    // val commentObtained = Message.findMessageById(commentId)
    Message.addCommentToMessage(comment, new ObjectId(messageId))
    Ok(write(List(comment)))

  }

  /*
   * Get All Comment for a message
   * @Purpose For displaying all the comments along with a message
   */

  def allCommentsForAMessage = Action { implicit request =>
    val messageIdJSON = request.body.asFormUrlEncoded.get
    val messageId = messageIdJSON("messageId").toList(0)
    val message = Message.findMessageById(new ObjectId(messageId))
    //    var commentsForAMessage: List[Message] = List()
    //
    //    for (commentsId <- message.comments) {
    //      val comment = Message.findMessageById(commentsId)
    //      commentsForAMessage ++= List(comment)
    //    }
    val commentsForAMessage = message.comments
    println(write(commentsForAMessage))
    Ok(write(commentsForAMessage)).as("application/json")

  }

}