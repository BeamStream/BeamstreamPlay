package controllers

import play.api.mvc.Controller
import play.api.mvc.Action
import models.User
import org.bson.types.ObjectId
import models.Message
import models.Document
import java.util.Date
import net.liftweb.json.Serialization.{ read, write }
import utils.ObjectIdSerializer
import models.Comment
import models.Question
import models.Stream
import java.text.SimpleDateFormat
import models.ResulttoSent
import models.UserMedia
import play.api.mvc.AnyContent
import play.api.Logger

object CommentController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter: SimpleDateFormat = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  def newComment: Action[AnyContent] = Action { implicit request =>

    val commentJson = request.body.asJson.get
    ((commentJson \ "messageId").asOpt[String] != None) match {

      case true =>
        val messageId = (commentJson \ "messageId").as[String]
        val commentText = (commentJson \ "comment").as[String]
        val streamId = (commentJson \ "stream_id").as[String]
        val commentPoster = User.getUserProfile(new ObjectId(request.session.get("userId").get))
        val comment = new Comment(new ObjectId, commentText, new Date, new ObjectId(request.session.get("userId").get),
          commentPoster.get.firstName, commentPoster.get.lastName, 0, List(), new ObjectId(streamId))
        val commentId = Comment.createComment(comment)
        Message.addCommentToMessage(commentId.get, new ObjectId(messageId))
        //        val message = Message.findMessageById(new ObjectId(messageId)).get
        //        if (!(message.docIdIfAny == None)) RockDocOrMedia.commentDocOrMedia(message.docIdIfAny.get, commentId)
        Ok(write(comment)).as("application/json")

      case false => ((commentJson \ "docId").asOpt[String] != None) match {

        case true =>
          val docId = (commentJson \ "docId").as[String]
          val commentText = (commentJson \ "comment").as[String]
          val streamId = (commentJson \ "stream_id").as[String]
          val commentPoster = User.getUserProfile(new ObjectId(request.session.get("userId").get))
          val comment = new Comment(new ObjectId, commentText, new Date, new ObjectId(request.session.get("userId").get),
            commentPoster.get.firstName, commentPoster.get.lastName, 0, List(), new ObjectId(streamId))
          val commentId = Comment.createComment(comment)
          Document.addCommentToDocument(commentId.get, new ObjectId(docId))
          Ok(write(List(comment))).as("application/json")

        case false => ((commentJson \ "questionId").asOpt[String] != None) match {

          case true =>
            val questionId = (commentJson \ "questionId").as[String]
            val commentText = (commentJson \ "comment").as[String]
            val streamId = (commentJson \ "stream_id").as[String]
            val commentPoster = User.getUserProfile(new ObjectId(request.session.get("userId").get))
            val comment = new Comment(new ObjectId, commentText, new Date, new ObjectId(request.session.get("userId").get),
              commentPoster.get.firstName, commentPoster.get.lastName, 0, List(), new ObjectId(streamId))
            val commentId = Comment.createComment(comment)
            Question.addCommentToQuestion(commentId.get, new ObjectId(questionId))
            Ok(write(comment)).as("application/json")

          case false => ((commentJson \ "userMediaId").asOpt[String] != None) match {

            case true =>
              val userMediaId = (commentJson \ "userMediaId").as[String]
              val commentText = (commentJson \ "comment").as[String]
              val streamId = (commentJson \ "stream_id").as[String]
              val commentPoster = User.getUserProfile(new ObjectId(request.session.get("userId").get))
              val comment = new Comment(new ObjectId, commentText, new Date, new ObjectId(request.session.get("userId").get),
                commentPoster.get.firstName, commentPoster.get.lastName, 0, List(), new ObjectId(streamId))
              val commentId = Comment.createComment(comment)
              UserMedia.addCommentToUserMedia(commentId.get, new ObjectId(userMediaId))
              Ok(write(comment)).as("application/json")

            case false => Ok(write(ResulttoSent("Failure", "Id Not Found")))
          }
        }
      }

    }

  }

  /**
   * Method for retrieving all the comments based on the input
   */

  def getAllComments: Action[AnyContent] = Action { implicit request =>
    try {
      val jsonWithid = request.body.asJson.get
      ((jsonWithid \ "messageId").asOpt[String] != None) match {
        case true =>
          val messageId = (jsonWithid \ "messageId").as[String]
          val commentsForAMessage = Comment.getAllComments(Message.findMessageById(new ObjectId(messageId)).get.comments)
          Ok(write(commentsForAMessage)).as("application/json")

        case false => ((jsonWithid \ "docId").asOpt[String] != None) match {
          case true =>

            val docId = (jsonWithid \ "docId").as[String]
            val commentsForADocument = Comment.getAllComments(Document.findDocumentById(new ObjectId(docId)).get.commentsOnDocument)
            Ok(write(commentsForADocument)).as("application/json")

          case false => ((jsonWithid \ "questionId").asOpt[String] != None) match {
            case true =>

              val questionId = (jsonWithid \ "questionId").as[String]
              val commentsForAQuestion = Comment.getAllComments(Question.findQuestionById(new ObjectId(questionId)).get.comments)
              Ok(write(commentsForAQuestion)).as("application/json")

            case false =>
              Ok(write(new ResulttoSent("Failure", "IdNotFound")))
          }
        }
      }
    } catch {
      case exception: Throwable =>
        Logger.error("This error occurred while fetching all Comments :- ", exception)
        InternalServerError("Can't get the comments")
    }

  }

  /**
   * Rocking a comment
   */

  def rockingTheComment(commentId: String): Action[AnyContent] = Action { implicit request =>
    try {
      val totalRocksForAComment = Comment.rockTheComment(new ObjectId(commentId), new ObjectId(request.session.get("userId").get))
      Ok(write(totalRocksForAComment.toString)).as("application/json")
    } catch {
      case exception: Throwable =>
        Logger.error("This error occurred while Rocking a Comment :- ", exception)
        InternalServerError("Can't rock the comment")
        Ok
    }
  }

  /**
   * Return Comment Rockers List
   */

  def commentRockers(commentId: String): Action[AnyContent] = Action { implicit request =>
    val rockersNameForAComment = Comment.commentsRockersNames(new ObjectId(commentId))
    Ok(write(rockersNameForAComment)).as("application/json")

  }

  def canDeleteTheComment(commentId: String, messageOrQuestionId: String): Action[AnyContent] = Action { implicit request =>
    val commentToBeremoved = Comment.findCommentById(new ObjectId(commentId))
    val userId = request.session.get("userId").get
    val message = Message.findMessageById(new ObjectId(messageOrQuestionId))
    message match {
      case Some(message) =>
        val stream = Stream.findStreamById(message.streamId.get)
        stream match {
          case Some(stream) =>
            (stream.creatorOfStream == userId) match {
              case true => Ok("true")
              case false =>
                (message.userId == userId) match {
                  case true => Ok("true")
                  case false =>
                    (commentToBeremoved.get.userId == userId) match {
                      case true => Ok("true")
                      case false => Ok("false")
                    }
                }
            }
          case None => Ok("false")
        }
      case None =>
        val question = Question.findQuestionById(new ObjectId(messageOrQuestionId))
        question match {
          case Some(question) =>
            val stream = Stream.findStreamById(question.streamId)
            stream match {
              case Some(stream) =>
                (stream.creatorOfStream == userId) match {
                  case true => Ok("true")
                  case false =>
                    (question.userId == userId) match {
                      case true => Ok("true")
                      case false =>
                        (commentToBeremoved.get.userId == userId) match {
                          case true => Ok("true")
                          case false => Ok("false")
                        }
                    }
                }
              case None => Ok("false")
            }
          case None => Ok("false")
        }
    }
  }

  /**
   * Delete A Comment
   */

  def deleteTheComment(commentId: String, messageOrQuestionId: String): Action[AnyContent] = Action { implicit request =>
    val deletedTheCommnet = Comment.deleteCommentPermanently(new ObjectId(commentId), new ObjectId(messageOrQuestionId),
      new ObjectId(request.session.get("userId").get))
    deletedTheCommnet match {
      case true =>
        val message = Message.findMessageById(new ObjectId(messageOrQuestionId))
        message match {
          case Some(message) => Message.removeCommentFromMessage(new ObjectId(commentId), new ObjectId(messageOrQuestionId))
          case None => Question.removeCommentFromQuestion(new ObjectId(commentId), new ObjectId(messageOrQuestionId))
        }
        Ok(write(new ResulttoSent("Success", "Comment Has Been Deleted")))
      case false => Ok(write(new ResulttoSent("Failure", "You're Not Authorised To Delete This Comment")))
    }
  }

  /**
   * Is a Rocker
   * @ Purpose: identify if the user has rocked the comment or not
   */
  def isARocker(commentId: String): Action[AnyContent] = Action { implicit request =>
    {
      val isARockerOfComment = Comment.isARocker(new ObjectId(commentId), new ObjectId(request.session.get("userId").get))
      Ok(write(isARockerOfComment.toString)).as("application/json")
    }
  }

  /**
   * Answer of a question
   */
  def newAnswer: Action[AnyContent] = Action { implicit request =>
    val answerJson = request.body.asJson.get
    val questionId = (answerJson \ "questionId").as[String]
    val answerText = (answerJson \ "answerText").as[String]
    val streamId = (answerJson \ "streamId").as[String]
    val commentPoster = User.getUserProfile(new ObjectId(request.session.get("userId").get))
    val ansWer = new Comment(new ObjectId, answerText, new Date, new ObjectId(request.session.get("userId").get),
      commentPoster.get.firstName, commentPoster.get.lastName, 0, List(), new ObjectId(streamId))
    val answerId = Comment.createComment(ansWer)
    Question.addAnswerToQuestion(new ObjectId(questionId), answerId.get)
    Ok(write(ansWer)).as("application/json")
  }

}
