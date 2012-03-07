package models
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection

case class User(@Key("_id") id: Int, userType: UserType.Value, email: String, val firstName: String, lastName: String, orgName: String,
  location: Boolean, streams: List[Int], media: List[ObjectId], schoolId: List[ObjectId], classId: List[Int]) {
}

object User {

  def createUser(user: User) {
    UserDAO.insert(user)
  }

  def removeUser(user: User) {
    UserDAO.remove(user)
  }

  def validateEmail(emailId: String): Boolean = {
    var validationStatus = false
    val emailPart: List[String] = List("gmail.com", "yahoo.com", "rediff.com", "hotmail.com", "aol.com")
    val i: Int = emailId.lastIndexOf("@")
    val stringToMatch: String = emailId.substring(i + 1)
    val emailString: String = emailId.toUpperCase

    (!emailString.matches("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$") ||
      emailPart.contains(stringToMatch)) match {
        case true =>
        case false =>
          validationStatus = true
      }
    return validationStatus
  }

  def registerUser(user: User): String = {

    validateEmail(user.email) match {
      case true =>
        UserDAO.insert(user)
        "Registration Successful"
      case false =>
        "Invalid email address"
    }

  }

  def addSchoolToUser(userId: Int, schoolId: ObjectId) {
    val user = UserDAO.findOneByID(userId).get
    UserDAO.update(MongoDBObject("_id" -> userId), user.copy(schoolId = (user.schoolId ++ List(schoolId))), false, false, new WriteConcern)

  }

  def addClassToUser(userId: Int, classId: Int) {
    val user = UserDAO.findOneByID(userId).get
    UserDAO.update(MongoDBObject("_id" -> userId), user.copy(classId = (user.classId ++ List(classId))), false, false, new WriteConcern)
  }

  def getUserProfile(userId: Int): User = {
    val user = UserDAO.findOneByID(userId)
    return user.get

  }

}
object UserType extends Enumeration {
  val Student = Value(0, "Student")
  val Educator = Value(1, "Educator")
  val Professional = Value(2, "Professional")
}

object UserDAO extends SalatDAO[User, Int](collection = MongoConnection()("beamstream")("user"))
