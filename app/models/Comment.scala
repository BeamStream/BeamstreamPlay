package models

import com.novus.salat.annotations._
import org.bson.types.ObjectId
import java.util.Date
import com.novus.salat.dao.SalatDAO
import utils.MongoHQConfig
import com.novus.salat.global._
import java.text.DateFormat
import com.mongodb.casbah.commons.MongoDBObject

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

 

  def findCommentById(commentId: ObjectId, commentsForAmessage: List[Comment]): Comment = {

    var commentsMatchingId: List[Comment] = List()
    for (comment <- commentsForAmessage) {
      if (comment.id == commentId) commentsMatchingId ++ List(comment)
    }
    commentsMatchingId(0)
  }

  //  def rockingTheComment(messageId: ObjectId, commentId: ObjectId, userId: ObjectId): Int = {
  //    val commentsForAmessage = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0).comments
  //
  //  }

}

