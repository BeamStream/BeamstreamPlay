package models
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import com.mongodb.casbah.commons.conversions.scala._
import utils.MongoHQConfig

case class Comment(@Key("_id") id: ObjectId,assosiatedWithMessage : ObjectId,  userId: ObjectId,firstNameOfCommentor:String,commentContent : String)
object Comment {
  
  def addCommentToMessage(messageId: ObjectId){
    
  }

}

object CommentDAO extends SalatDAO[Comment, ObjectId](collection = MongoHQConfig.mongoDB("comment"))