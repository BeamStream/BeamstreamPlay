package models
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection

case class User(@Key("_id") id: Int, name: String, email: String, streams:List[Int])

object User{
  def createUser(user:User){
    UserDAO.insert(user)
  }
  
  def removeUser(user:User){
    UserDAO.remove(user)
  }
}

object UserDAO extends SalatDAO[User, Int](collection = MongoConnection()("beamstream")("user"))
