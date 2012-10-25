package utils
import com.novus.salat.dao.SalatDAO
import org.bson.types.ObjectId
import com.novus.salat.global._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection

case class AmazonProgress(userId: String, percentage: Int)

object ProgressStatus {

  def addProgress(userId: String, percentage: Int) = {

    val amazonProgressObj = AmazonProgressDAO.find(MongoDBObject("userId" -> userId)).toList
    (!amazonProgressObj.isEmpty) match {
      case true => println("true"); AmazonProgressDAO.update(MongoDBObject("userId" -> userId), new AmazonProgress(userId, percentage), false, false, new WriteConcern)
      case false => println("false"); AmazonProgressDAO.insert(new AmazonProgress(userId, percentage))
    }

  }

  def findProgress(userId: String) = {
    val amazonProgressObj = AmazonProgressDAO.find(MongoDBObject("userId" -> userId)).toList
    (!amazonProgressObj.isEmpty) match {
      case true => amazonProgressObj(0).percentage
      case false => 0
    }

  }

}
object AmazonProgressDAO extends SalatDAO[AmazonProgress, ObjectId](collection = MongoHQConfig.mongoDB("amazonProgress"))