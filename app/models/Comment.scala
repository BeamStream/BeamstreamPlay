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

  def createComment(comment: Comment): ObjectId = {
    val commentId = CommentDAO.insert(comment)
    commentId.get

  }

  /**
   * Remove a Comment
   */

  def removeComment(comment: Comment) {
    val commentId = CommentDAO.remove(comment)
  }

  /**
   * Find Comment by Id
   */

  def findCommentById(commentId: ObjectId): Option[Comment] = {
    val commentObtained = CommentDAO.findOneByID(commentId)
    commentObtained
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
    val rockersName = User.giveMeTheRockers(commentRocked.get.rockers)
    rockersName
  }

  /**
   * get All comments
   *
   * @Purpose : getting Comments for any Model(have to pass the List[ObjectId])
   */

  def getAllComments(comments: List[ObjectId]): List[CommentResult] = {
    comments map {
      case commentId =>
        val comment = CommentDAO.find(MongoDBObject("_id" -> commentId)).toList
        (comment.isEmpty.equals(false)) match {
          case true => {
            val userMedia = UserMedia.getProfilePicForAUser(comment.head.userId)

            val profilePicForUser = (!userMedia.isEmpty) match {
              case true => (userMedia.head.frameURL != "") match {
                case true => userMedia.head.frameURL
                case false => userMedia.head.mediaUrl
              }

              case false => ""
            }
            CommentResult(comment.head, Option(profilePicForUser))
          }
        }

    }
  }

  /**
   * Delete A Comment
   */

  def deleteCommentPermanently(commentId: ObjectId, messageOrQuestionId: ObjectId, userId: ObjectId) = {
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
   * @ Purpose: identify if the user has rocked a comment or not
   */

  def isARocker(commentId: ObjectId, userId: Object): Boolean = {
    val comment = CommentDAO.find(MongoDBObject("_id" -> commentId)).toList(0)
    (comment.rockers.contains(userId)) match {
      case true => true
      case false => false
    }
  }

}

object CommentDAO extends SalatDAO[Comment, ObjectId](collection = MongoHQConfig.mongoDB("comment"))


