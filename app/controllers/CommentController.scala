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
import models.ResulttoSent

object CommentController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
  } + new ObjectIdSerializer

  def newComment = Action { implicit request =>

    val commentJson = request.body.asFormUrlEncoded.get
    val messageId = commentJson("messageId").toList(0)
    val commentText = commentJson("comment").toList(0)
    val commentPoster = User.getUserProfile(new ObjectId(request.session.get("userId").get))
    val comment = new Comment(new ObjectId, commentText, new Date, new ObjectId(request.session.get("userId").get),
      commentPoster.firstName, commentPoster.lastName, 0, List())
    val commentId = Comment.createComment(comment)
    Message.addCommentToMessage(commentId, new ObjectId(messageId))
    Ok(write(List(comment))).as("application/json")

  }

  /*
   * Get All Comment for a message
   * @Purpose For displaying all the comments along with a message
   */

  def allCommentsForAMessage = Action { implicit request =>
    val messageIdJSON = request.body.asFormUrlEncoded.get
    val messageId = messageIdJSON("messageId").toList(0)
    val commentsForAMessage = Message.getAllCommentsForAmessage(new ObjectId(messageId))
    Ok(write(commentsForAMessage)).as("application/json")

  }

  /*
   * Rocking a comment
   */

  def rockingTheComment = Action { implicit request =>
    val commentDetailsJson = request.body.asFormUrlEncoded.get
    val messageId = commentDetailsJson("messageId").toList(0)
    val commentId = commentDetailsJson("commentId").toList(0)
    val totalRocksForAComment = Comment.rockTheComment(new ObjectId(commentId), new ObjectId(request.session.get("userId").get))
    Ok(write(totalRocksForAComment.toString)).as("application/json")
  }

  /*
   * Return Comment Rockers List
   */

  def commentRockers = Action { implicit request =>
    val commentDetailsJson = request.body.asFormUrlEncoded.get
    val messageId = commentDetailsJson("messageId").toList(0)
    val commentId = commentDetailsJson("commentId").toList(0)
    val rockersNameForAComment = Comment.commentsRockersNames(new ObjectId(commentId))
    Ok(write(rockersNameForAComment)).as("application/json")

  }

}