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

  /*
   * Create a new Comment
   */

  def createComment(comment: Comment): ObjectId = {
    val commentId = CommentDAO.insert(comment)
    commentId.get

  }

  /*
   * Remove a Comment
   */

  def removeComment(comment: Comment) {
    val commentId = CommentDAO.remove(comment)
  }

  /*
   * Find Comment by Id
   */

  def findCommentById(commentId: ObjectId): Comment = {
    val commentObtained = CommentDAO.findOneByID(commentId)
    commentObtained.get
  }

  /*
   * Rocking the comment
   */

  def rockTheComment(commentId: ObjectId, userId: ObjectId): Int = {
    val commentToRock = CommentDAO.find(MongoDBObject("_id" -> commentId)).toList(0)

    (commentToRock.rockers.contains(userId)) match {

      case true =>
        // Unrocking a message
        CommentDAO.update(MongoDBObject("_id" -> commentId), commentToRock.copy(rockers = (commentToRock.rockers -- List(userId))), false, false, new WriteConcern)
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

  /*
   *  Increase the number of counts
   */
  def commentsRockersNames(commentId: ObjectId): List[String] = {
    val commentRocked = findCommentById(commentId)
    val rockersName = User.giveMeTheRockers(commentRocked.rockers)
    rockersName
  }

  /*
   * get All comments 
   * 
   * @Purpose : getting Comments for any Model(have to pass the List[ObjectId])
   */

  def getAllComments(comments: List[ObjectId]): List[Comment] = {
    var allCommentsForAModel: List[Comment] = List()
    for (commentId <- comments) {
      val comment = CommentDAO.find(MongoDBObject("_id" -> commentId)).toList
      allCommentsForAModel ++= comment
    }
    allCommentsForAModel
  }

  /*
  * add Comment to message
  */
  def addCommentToMessage(commentId: ObjectId, messageId: ObjectId) = {
    val message = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
    MessageDAO.update(MongoDBObject("_id" -> messageId), message.copy(comments = (message.comments ++ List(commentId))), false, false, new WriteConcern)
  }

  /*
  * add Comment to document
  */
  def addCommentToDocument(commentId: ObjectId, docId: ObjectId) = {
    val doc = DocumentDAO.find(MongoDBObject("_id" -> docId)).toList(0)
    DocumentDAO.update(MongoDBObject("_id" -> docId), doc.copy(comments = (doc.comments ++ List(commentId))), false, false, new WriteConcern)
  }

 

}

object CommentDAO extends SalatDAO[Comment, ObjectId](collection = MongoHQConfig.mongoDB("comment"))


/**
 * Vikas's
 */
trait CommentConsumer {
  def addComment(id: ObjectId, commentId: ObjectId)
}