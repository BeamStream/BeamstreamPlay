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
   * Create a new Comment
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
    val SelectedcommenttoRock = CommentDAO.find(MongoDBObject("_id" -> commentId)).toList(0)

    (SelectedcommenttoRock.rockers.contains(userId)) match {

      case true =>
        // Unrocking a message
        CommentDAO.update(MongoDBObject("_id" -> commentId), SelectedcommenttoRock.copy(rockers = (SelectedcommenttoRock.rockers -- List(userId))), false, false, new WriteConcern)
        val updatedComment = CommentDAO.find(MongoDBObject("_id" -> commentId)).toList(0)
        CommentDAO.update(MongoDBObject("_id" -> commentId), updatedComment.copy(rocks = (updatedComment.rocks - 1)), false, false, new WriteConcern)
        val finalComment = CommentDAO.find(MongoDBObject("_id" -> commentId)).toList(0)
        finalComment.rocks

      case false =>
        //Rocking a message
        CommentDAO.update(MongoDBObject("_id" -> commentId), SelectedcommenttoRock.copy(rockers = (SelectedcommenttoRock.rockers ++ List(userId))), false, false, new WriteConcern)
        val updatedComment = CommentDAO.find(MongoDBObject("_id" -> commentId)).toList(0)
        CommentDAO.update(MongoDBObject("_id" -> commentId), updatedComment.copy(rocks = (updatedComment.rocks + 1)), false, false, new WriteConcern)
        val finalComment = CommentDAO.find(MongoDBObject("_id" -> commentId)).toList(0)
        finalComment.rocks

    }

  }

  /*
   *  Increase the no. of counts
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

  def getAllCommentsForAModel(comments: List[ObjectId]): List[Comment] = {
    var allCommentsForAModel: List[Comment] = List()
    for (commentId <- comments) {
      val comment = CommentDAO.find(MongoDBObject("_id" -> commentId)).toList
      allCommentsForAModel ++= comment
    }
    allCommentsForAModel
  }
}

//TODO : Following code is the previous Comment Model's Code

//  /*
//   * Find Comment By Id
//   */
//  def findCommentById(messageId: ObjectId, commentId: ObjectId): Comment = {
//    val commentsForAmessage = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0).comments
//    var commentsMatchingId: List[Comment] = List()
//    for (comment <- commentsForAmessage) {
//      if (comment.id == commentId) commentsMatchingId ++= List(comment)
//    }
//    commentsMatchingId(0)
//  }
//
//  /*
//   * Rocking the comment
//   */
//
//  def rockingTheComment(messageId: ObjectId, commentId: ObjectId, userId: ObjectId): Int = {
//    val oldCommentToBeRocked = findCommentById(messageId, commentId)
//    (oldCommentToBeRocked.rockers.contains(userId)) match {
//      case true =>
//        oldCommentToBeRocked.rocks
//      case false =>
//        val updatedComment = new Comment(oldCommentToBeRocked.id, oldCommentToBeRocked.commentBody, oldCommentToBeRocked.timeCreated, oldCommentToBeRocked.userId, oldCommentToBeRocked.firstNameofCommentPoster,
//          oldCommentToBeRocked.lastNameofCommentPoster, oldCommentToBeRocked.rocks + 1, oldCommentToBeRocked.rockers ++ List(userId), oldCommentToBeRocked.follows, oldCommentToBeRocked.followers)
//        replaceComment(messageId, updatedComment, oldCommentToBeRocked)
//        oldCommentToBeRocked.rocks + 1
//
//    }
//  }
//
//  /*
//   * Updating the comment with updated rocks and rockers
//   */
//  def replaceComment(messageId: ObjectId, newComment: Comment, oldComment: Comment) {
//    val messageToUpdate = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
//    MessageDAO.update(MongoDBObject("_id" -> messageId), messageToUpdate.copy(comments = (messageToUpdate.comments -- List(oldComment) ++ List(newComment))), false, false, new WriteConcern)
//
//  }
//
//  /*
//   * Returns the List Of Rockers of each comment
//   */
//
//  def commentRockersList(messageId: ObjectId, commentId: ObjectId): List[String] = {
//    val commentDesired = findCommentById(messageId, commentId)
//    val commentRockers = User.giveMeTheRockers(commentDesired.rockers)
//    commentRockers
//
//  }
//
//  /*
//   * Following the comment
//   */
//
//  def followingTheComment(messageId: ObjectId, commentId: ObjectId, userId: ObjectId) = {
//    val oldCommentToBeFollowed = findCommentById(messageId, commentId)
//    val updatedComment = new Comment(oldCommentToBeFollowed.id, oldCommentToBeFollowed.commentBody, oldCommentToBeFollowed.timeCreated, oldCommentToBeFollowed.userId, oldCommentToBeFollowed.firstNameofCommentPoster,
//      oldCommentToBeFollowed.lastNameofCommentPoster, oldCommentToBeFollowed.rocks, oldCommentToBeFollowed.rockers, oldCommentToBeFollowed.follows + 1, oldCommentToBeFollowed.followers ++ List(userId))
//    replaceComment(messageId, updatedComment, oldCommentToBeFollowed)
//  }
//
//  /*
//   * Returns the List Of Followers of each comment
//   */
//
//  def commentFollowersList(messageId: ObjectId, commentId: ObjectId): List[String] = {
//    val commentDesired = findCommentById(messageId, commentId)
//    val commentRockers = User.giveMeTheRockers(commentDesired.followers)
//    commentRockers
//
//  }

object CommentDAO extends SalatDAO[Comment, ObjectId](collection = MongoHQConfig.mongoDB("comment"))

