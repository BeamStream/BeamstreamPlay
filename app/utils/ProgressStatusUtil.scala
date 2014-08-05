package utils

import com.novus.salat.dao.SalatDAO
import org.bson.types.ObjectId
import com.mongodb.casbah.Imports._
import models.mongoContext._

case class AmazonProgress(userId: String, percentage: Int)

object ProgressStatusUtil {

  /**
   * Add Progress
   * param userId is the Id of the User
   * param percentage is the percentage of the done progress
   */
  def addProgress(userId: String, percentage: Int): Object = {
    val amazonProgressObj = AmazonProgressDAO.find(MongoDBObject("userId" -> userId)).toList
    (!amazonProgressObj.isEmpty) match {
      case true => AmazonProgressDAO.update(MongoDBObject("userId" -> userId), new AmazonProgress(userId, percentage), false, false, new WriteConcern)
      case false => AmazonProgressDAO.insert(new AmazonProgress(userId, percentage))
    }

  }
 /**
   * Find Progress
   * param userId is the Id of the User
   *
   */
  def findProgress(userId: String): Int = {
    val amazonProgressObj = AmazonProgressDAO.find(MongoDBObject("userId" -> userId)).toList
    (!amazonProgressObj.isEmpty) match {
      case true => amazonProgressObj(0).percentage
      case false => 0
    }

  }

}
object AmazonProgressDAO extends SalatDAO[AmazonProgress, ObjectId](collection = MongoHQConfig.mongoDB("amazonProgress"))
