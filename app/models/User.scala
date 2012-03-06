package models
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection

case class User(@Key("_id") id: Int, userType: UserType.Value, email: String, firstName: String, lastName: String, orgName: String, location: Boolean, streams: List[Int], media: List[ObjectId])

object User {

  def createUser(user: User) {
    UserDAO.insert(user)
  }

  def removeUser(user: User) {
    UserDAO.remove(user)
  }

  def validateEmail(emailId: String): Unit = {
    val emailPart: List[String] = List("gmail.com", "yahoo.com", "rediff.com", "hotmail.com")
    val i: Int = emailId.lastIndexOf("@")
    val stringToMatch: String = emailId.substring(i + 1)
    val emailString: String = emailId.toUpperCase

    if (!emailString.matches("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$")) {
      println(stringToMatch + " is not a correct Email Address")
      return

    } else if (emailPart.contains(stringToMatch)) {
      println("Invalid Email Found, " + stringToMatch + " is a not a valid Email")
      return

    }
  }

  def registerUser(user: User): Unit = {

    validateEmail(user.email)
    UserDAO.insert(user)

  }

}
object UserType extends Enumeration {
  val Student = Value(0, "Student")
  val Educator = Value(1, "Educator")
  val Professional = Value(2, "Professional")
}

object UserDAO extends SalatDAO[User, Int](collection = MongoConnection()("beamstream")("user"))
