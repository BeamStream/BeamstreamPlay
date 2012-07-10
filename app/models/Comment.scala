package models
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import com.mongodb.casbah.commons.conversions.scala._
import utils.MongoHQConfig

case class Comment(@Key("_id") id: ObjectId, assosiatedWithMessage: ObjectId, userId: ObjectId, firstNameOfCommentor: String, commentContent: String)
object Comment {

  def addCommentToMessage(messageId: ObjectId, commentId: ObjectId) {

    val messageToComment = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
    MessageDAO.update(MongoDBObject("_id" -> messageId), messageToComment.copy(comments = (messageToComment.comments ++ List(commentId))), false, false, new WriteConcern)

  }

  /*
   * Create a commnent
   */

  def createComment(comment: Comment): ObjectId = {
    val commentId = CommentDAO.insert(comment)
    commentId.get
  }

  /*
   * Delete a comment
   */

  def deleteComment(commentId: ObjectId) {
    val comment = CommentDAO.findOneByID(commentId).get
    CommentDAO.remove(comment)
  }

}

object CommentDAO extends SalatDAO[Comment, ObjectId](collection = MongoHQConfig.mongoDB("comment"))