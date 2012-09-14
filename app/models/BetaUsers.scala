package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import org.bson.types.ObjectId
import utils.MongoHQConfig
import com.mongodb.casbah.commons.MongoDBObject

case class BetaUser(@Key("_id") id: ObjectId, userType: UserType.Value , emailId: String)
object BetaUser {

   
  
  def addBetaUser(betaUser: BetaUser): ObjectId = {
    val betaUserId = BetaUserDAO.insert(betaUser)
    betaUserId.get
  }
 /*
  * Find User By Id
  */

  def findBetaUserbyEmail(email: String): List[BetaUser] = {
    val userFound = BetaUserDAO.find(MongoDBObject("emailId" -> email)).toList
    userFound
  }
}
object BetaUserDAO extends SalatDAO[BetaUser, ObjectId](collection = MongoHQConfig.mongoDB("betausers"))