package models

import com.novus.salat.annotations._
import org.bson.types.ObjectId
import java.util.Date
import com.novus.salat.dao.SalatDAO
import utils.MongoHQConfig
import com.novus.salat.global._
import java.text.DateFormat
import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.WriteConcern
import models.mongoContext._
import scala.language.postfixOps

case class Comment(@Key("_id") id: ObjectId,
  commentBody: String,
  timeCreated: Date,
  userId: ObjectId,
  firstNameofCommentPoster: String,
  lastNameofCommentPoster: String,
  rocks: Int,
  rockers: List[ObjectId])

object Comment {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy HH:mm:ss")

  /**
   * Create a new Comment
   */

  def createComment(comment: Comment): Option[ObjectId] = {
    CommentDAO.insert(comment)
  }

  /**
   * Remove a Comment
   */

  def removeComment(comment: Comment) {
    CommentDAO.remove(comment)
  }

  /**
   * Find Comment by Id
   */

  def findCommentById(commentId: ObjectId): Option[Comment] = {
    CommentDAO.findOneById(commentId)
  }

  /**
   * Rocking the comment
   */

  def rockTheComment(commentId: ObjectId, userId: ObjectId): Int = {
    val commentToRock = CommentDAO.find(MongoDBObject("_id" -> commentId)).toList(0)

    (commentToRock.rockers.contains(userId)) match {

      case true =>
        // Unrocking a message
        CommentDAO.update(MongoDBObject("_id" -> commentId), commentToRock.copy(rockers = (commentToRock.rockers filterNot (List(userId) contains))), false, false, new WriteConcern)
        val updatedComment = CommentDAO.find(MongoDBObject("_id" -> commentId)).toList(0)
        CommentDAO.update(MongoDBObject("_id" -> commentId), updatedComment.copy(rocks = (updatedComment.rocks - 1)), false, false, new WriteConcern)
        val finalComment = CommentDAO.find(MongoDBObject("_id" -> commentId)).toList(0)
        finalComment.rocks
      case false =>
        //Rocking a message
        CommentDAO.update(MongoDBObject("_id" -> commentId), commentToRock.copy(rockers = (commentToRock.rockers ++ List(userId))), false, false, new WriteConcern)
        val updatedComment = CommentDAO.find(MongoDBObject("_id" -> commentId)).toList(0)
        CommentDAO.update(MongoDBObject("_id" -> commentId), updatedComment.copy(rocks = (updatedComment.rocks + 1)), false, false, new WriteConcern)
        val finalComment = CommentDAO.find(MongoDBObject("_id" -> commentId)).toList(0)
        finalComment.rocks
    }

  }

  /**
   *  Increase the number of counts
   */
  def commentsRockersNames(commentId: ObjectId): List[String] = {
    val commentRocked = findCommentById(commentId)
    User.giveMeTheRockers(commentRocked.get.rockers)
  }

  /**
   * get All comments
   *
   * Purpose : getting Comments for any Model(have to pass the List[ObjectId])
   */

  def getAllComments(comments: List[ObjectId]): List[CommentResult] = {
    var commentListToReturn: List[CommentResult] = Nil
    comments foreach {
      case commentId =>
        val comment = CommentDAO.find(MongoDBObject("_id" -> commentId)).toList
        comment.isEmpty match {
          case false => {
            val userMedia = UserMedia.getProfilePicForAUser(comment.head.userId)

            val profilePicForUser = (userMedia.isEmpty) match {
              case false => (userMedia.head.frameURL != "") match {
                case true => userMedia.head.frameURL
                case false => userMedia.head.mediaUrl
              }

              case true => ""
            }
            commentListToReturn ++= List(CommentResult(comment.head, Option(profilePicForUser)))
          }
          case true =>
        }

    }
    commentListToReturn
  }

  /**
   * Delete A Comment
   */

  def deleteCommentPermanently(commentId: ObjectId, messageOrQuestionId: ObjectId, userId: ObjectId): Boolean = {
    val commentToBeremoved = Comment.findCommentById(commentId)
    (commentToBeremoved.get.userId == userId) match {
      case true =>
        Comment.removeComment(commentToBeremoved.get)
        val message = Message.findMessageById(messageOrQuestionId)
        message match {
          case Some(message) => Message.removeCommentFromMessage(commentId, messageOrQuestionId)
          case None => Question.removeCommentFromQuestion(commentId, messageOrQuestionId)
        }
        true
      case false => false
    }
  }

  /**
   * Is a Rocker
   * Purpose: identify if the user has rocked a comment or not
   */

  def isARocker(commentId: ObjectId, userId: Object): Boolean = {
    val comment = CommentDAO.find(MongoDBObject("_id" -> commentId)).toList(0)
    comment.rockers.contains(userId)
  }

}

object CommentDAO extends SalatDAO[Comment, ObjectId](collection = MongoHQConfig.mongoDB("comment"))
