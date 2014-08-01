package models

import org.bson.types.ObjectId
import utils.MongoHQConfig
import com.mongodb.casbah.commons.MongoDBObject
import com.novus.salat.global._
import com.novus.salat.annotations.raw.Key
import com.novus.salat.dao.SalatDAO

case class BetaUser(@Key("_id") id: ObjectId, emailId: String)

object BetaUser {

  /**
   * Add Beta User
   */
  def addBetaUser(betaUser: BetaUser): Option[ObjectId] = {
    BetaUserDAO.insert(betaUser)
  }

  /**
   * Find User By Id
   */

  def findBetaUserbyEmail(email: String): List[BetaUser] = {
    BetaUserDAO.find(MongoDBObject("emailId" -> email)).toList
  }

}

object BetaUserDAO extends SalatDAO[BetaUser, ObjectId](collection = MongoHQConfig.mongoDB("betausers"))
