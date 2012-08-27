package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import org.bson.types.ObjectId
import utils.MongoHQConfig

case class BetaUser(@Key("_id") id: ObjectId, iAm: String, emailid: String)
object BetaUser {

   
  
  def addBetaUser(betaUser: BetaUser): ObjectId = {
    val betaUserId = BetaUserDAO.insert(betaUser)
    betaUserId.get
  }

}
object BetaUserDAO extends SalatDAO[BetaUser, ObjectId](collection = MongoHQConfig.mongoDB("betausers"))