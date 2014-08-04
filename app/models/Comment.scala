package models

import org.bson.types.ObjectId
import java.util.Date
import com.novus.salat.dao.SalatDAO
import utils.MongoHQConfig
import java.text.DateFormat
import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.WriteConcern
import models.mongoContext._
import scala.language.postfixOps
import java.util.regex.Pattern
import com.novus.salat.annotations.raw.Key

case class Comment(@Key("_id") id: ObjectId,
  commentBody: String,
  timeCreated: Date,
  userId: ObjectId,
  firstNameofCommentPoster: String,
  lastNameofCommentPoster: String,
  rocks: Int,
  rockers: List[ObjectId],
  streamId: ObjectId)

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

  def findAnswerById(answerId: ObjectId): Option[Comment] = {
    CommentDAO.findOneById(answerId)
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
    val commentToBeremoved = CommentDAO.findOneById(commentId)
    commentToBeremoved match {
      case Some(comment) => 
        CommentDAO.remove(comment)
        true
      case None => false
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
  
  def getAllCommentsForAKeyword(keyword: String, streamId: ObjectId): List[Comment] = {
    val keyWordregExp = Pattern.compile(keyword, Pattern.CASE_INSENSITIVE) //(""".*""" + keyword + """.*""").r
    CommentDAO.find(MongoDBObject("commentBody" -> keyWordregExp, "streamId" -> streamId)).toList
    //    val messageGoogleDocTitleResult = MessageDAO.find(MongoDBObject("streamId" -> streamId, "messageGoogleDocTitle" -> keyWordregExp)).skip((pageNumber - 1) * messagesPerPage).limit(messagesPerPage).toList
  }

}

object CommentDAO extends SalatDAO[Comment, ObjectId](collection = MongoHQConfig.mongoDB("comment"))
