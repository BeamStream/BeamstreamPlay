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
  rockers: List[ObjectId],
  follows: Int,
  followers: List[ObjectId])

object Comment {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy HH:mm:ss")

  /*
   * Find Comment By Id
   */
  def findCommentById(messageId: ObjectId, commentId: ObjectId): Comment = {
    val commentsForAmessage = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0).comments
    var commentsMatchingId: List[Comment] = List()
    for (comment <- commentsForAmessage) {
      if (comment.id == commentId) commentsMatchingId ++= List(comment)
    }
    commentsMatchingId(0)
  }

  /*
   * Rocking the comment
   */

  def rockingTheComment(messageId: ObjectId, commentId: ObjectId, userId: ObjectId) = {
    val oldCommentToBeRocked = findCommentById(messageId, commentId)
    val updatedComment = new Comment(oldCommentToBeRocked.id, oldCommentToBeRocked.commentBody, oldCommentToBeRocked.timeCreated, oldCommentToBeRocked.userId, oldCommentToBeRocked.firstNameofCommentPoster,
      oldCommentToBeRocked.lastNameofCommentPoster, oldCommentToBeRocked.rocks + 1, oldCommentToBeRocked.rockers ++ List(userId), oldCommentToBeRocked.follows, oldCommentToBeRocked.followers)
    replaceComment(messageId, updatedComment, oldCommentToBeRocked)
  }

  /*
   * Updating the comment with updated rocks and rockers
   */
  def replaceComment(messageId: ObjectId, newComment: Comment, oldComment: Comment) {
    val messageToUpdate = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
    MessageDAO.update(MongoDBObject("_id" -> messageId), messageToUpdate.copy(comments = (messageToUpdate.comments -- List(oldComment) ++ List(newComment))), false, false, new WriteConcern)

  }

  /*
   * Returns the List Of Rockers of each comment
   */

  def commentRockersList(messageId: ObjectId, commentId: ObjectId): List[String] = {
    val commentDesired = findCommentById(messageId, commentId)
    val commentRockers = User.giveMeTheRockers(commentDesired.rockers)
    commentRockers

  }

}

