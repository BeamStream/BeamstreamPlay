package controllers
import play.api.mvc.Controller
import net.liftweb.json.DefaultFormats
import play.api.mvc.Action
import models.User
import org.bson.types.ObjectId
import models.Message
import models.Document
import java.util.Date
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import utils.ObjectIdSerializer
import models.ResulttoSent
import models.Comment
import models.ResulttoSent
import models.Question
import models.RockDocOrMedia
import java.text.SimpleDateFormat

object CommentController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  def newComment = Action { implicit request =>

    val commentJson = request.body.asJson.get

    try {
      /**
       * Direct Approach
       */

      ((commentJson \ "messageId").asOpt[String] != None) match {

        case true =>
          val messageId = (commentJson \ "messageId").as[String]
          val commentText = (commentJson \ "comment").as[String]
          val commentPoster = User.getUserProfile(new ObjectId(request.session.get("userId").get))
          val comment = new Comment(new ObjectId, commentText, new Date, new ObjectId(request.session.get("userId").get),
            commentPoster.firstName, commentPoster.lastName, 0, None, List())
          val commentId = Comment.createComment(comment)
          Message.addCommentToMessage(commentId, new ObjectId(messageId))
          val message = Message.findMessageById(new ObjectId(messageId)).get
          if (!(message.docIdIfAny == None)) RockDocOrMedia.commentDocOrMedia(message.docIdIfAny.get, commentId)
          Ok(write(List(comment))).as("application/json")

        case false => ((commentJson \ "docId").asOpt[String] != None) match {

          case true =>
            val docId = (commentJson \ "docId").as[String]
            val commentText = (commentJson \ "comment").as[String]
            val commentPoster = User.getUserProfile(new ObjectId(request.session.get("userId").get))
            val comment = new Comment(new ObjectId, commentText, new Date, new ObjectId(request.session.get("userId").get),
              commentPoster.firstName, commentPoster.lastName, 0, None, List())
            val commentId = Comment.createComment(comment)
            Document.addCommentToDocument(commentId, new ObjectId(docId))
            Ok(write(List(comment))).as("application/json")

          case false => ((commentJson \ "questionId").asOpt[String] != None) match {

            case true =>
              val questionId = (commentJson \ "questionId").as[String]
              val commentText = (commentJson \ "comment").as[String]
              val commentPoster = User.getUserProfile(new ObjectId(request.session.get("userId").get))
              val comment = new Comment(new ObjectId, commentText, new Date, new ObjectId(request.session.get("userId").get),
                commentPoster.firstName, commentPoster.lastName, 0, None, List())
              val commentId = Comment.createComment(comment)
              Question.addCommentToQuestion(commentId, new ObjectId(questionId))
              Ok(write(List(comment))).as("application/json")

            case false => Ok(write(new ResulttoSent("Failure", "IdNotFound")))
          }
        }

      }
    } catch {
      case ex => Ok(write(new ResulttoSent("Failure", "There Was Some Problem During Posting Comment"))).as("application/json")
    }
  }

  /**
   * Method for retrieving all the comments based on the input
   */

  def getAllComments = Action { implicit request =>
    val jsonWithid = request.body.asFormUrlEncoded.get

    (jsonWithid.contains(("messageId"))) match {
      case true =>

        val messageId = jsonWithid("messageId").toList(0)
        val commentsForAMessage = Comment.getAllComments(Message.findMessageById(new ObjectId(messageId)).get.comments)
        Ok(write(commentsForAMessage)).as("application/json")

      case false => (jsonWithid.contains(("docId"))) match {
        case true =>

          val docId = jsonWithid("docId").toList(0)
          val commentsForADocument = Comment.getAllComments(Document.findDocumentById(new ObjectId(docId)).get.commentsOnDocument)
          Ok(write(commentsForADocument)).as("application/json")

        case false => (jsonWithid.contains(("questionId"))) match {
          case true =>

            val questionId = jsonWithid("questionId").toList(0)
            println(questionId)
            val commentsForAQuestion = Comment.getAllComments(Question.findQuestionById(new ObjectId(questionId)).get.comments)
            println(commentsForAQuestion)
            Ok(write(commentsForAQuestion)).as("application/json")

          case false =>
            Ok(write(new ResulttoSent("Failure", "IdNotFound")))
        }
      }
    }

  }

  /**
   * Rocking a comment
   */

  def rockingTheComment = Action { implicit request =>
    val commentDetailsJson = request.body.asFormUrlEncoded.get
    val commentId = commentDetailsJson("commentId").toList(0)
    val totalRocksForAComment = Comment.rockTheComment(new ObjectId(commentId), new ObjectId(request.session.get("userId").get))
    Ok(write(totalRocksForAComment.toString)).as("application/json")
  }

  /**
   * Return Comment Rockers List
   */

  def commentRockers = Action { implicit request =>
    val commentDetailsJson = request.body.asFormUrlEncoded.get
    val commentId = commentDetailsJson("commentId").toList(0)
    val rockersNameForAComment = Comment.commentsRockersNames(new ObjectId(commentId))
    Ok(write(rockersNameForAComment)).as("application/json")

  }

  /*
   * Delete A Comment
   */

  def deleteTheComment = Action { implicit request =>
    val commentDetailsJson = request.body.asFormUrlEncoded.get
    val commentId = commentDetailsJson("commentId").toList(0)
    val deletedTheCommnet = Comment.deleteCommentPermanently(new ObjectId(commentId), new ObjectId(request.session.get("userId").get))
    if (deletedTheCommnet == true) Ok(write(new ResulttoSent("Success", "Comment Has Been Deleted")))
    else Ok(write(new ResulttoSent("Failure", "You're Not Authorised To Delete This Comment")))
  }

  /**
   * Is a Rocker
   * @ Purpose: identify if the user has rocked the comment or not
   */
  def isARocker = Action { implicit request =>
    {
      val commentIdJsonMap = request.body.asFormUrlEncoded.get
      val commentId = commentIdJsonMap("commentId").toList(0)
      val isARockerOfComment = Comment.isARocker(new ObjectId(commentId), new ObjectId(request.session.get("userId").get))
      Ok(write(isARockerOfComment.toString)).as("application/json")
    }
  }

  /**
   * Answer of a question
   */
  def newAnswer = Action { implicit request =>
    val commentJson = request.body.asFormUrlEncoded.get
    val questionId = commentJson("questionId").toList(0)
    val answerText = commentJson("answer").toList(0)
    val commentPoster = User.getUserProfile(new ObjectId(request.session.get("userId").get))
    val comment = new Comment(new ObjectId, answerText, new Date, new ObjectId(request.session.get("userId").get),
      commentPoster.firstName, commentPoster.lastName, 0, None, List())
    val answerId = Comment.createComment(comment)
    Question.addAnswerToQuestion(new ObjectId(questionId), answerId)
    Ok(write(List(comment))).as("application/json")
  }

}