package models
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import play.mvc._
import play.api.mvc.Session

case class User(@Key("_id") id: Int, userType: UserType.Value, email: String, val firstName: String, lastName: String, userName: String, alias: String, password: String, orgName: String,
  location: String, streams: List[Int], schoolId: List[ObjectId], classId: List[ObjectId]) {
}

case class UserForm(iam:String,email: String, password: String,signup:String)
case class BasicRegForm(userName: String, password: String, orgName: String, firstName: String, lastName: String,email:String, location: String, useCurrentLocation: Option[Boolean])
case class DetailedRegForm(schoolName: String)
object User {

  /*
   * Add info to a user
   */
  def addInfo(detailed_regForm: DetailedRegForm, userId: Int) = {
    print(detailed_regForm.schoolName)
    User.addSchoolToUser(userId, new ObjectId(detailed_regForm.schoolName))
  }
  def allUsers(): List[User] = Nil

  /*
   * find the user for Authentication
   */
  def findUser(userForm: UserForm): Option[User] = {
    
    val authenticatedUser = UserDAO.find(MongoDBObject("email" -> userForm.email, "password" -> userForm.password))
    (authenticatedUser.isEmpty) match {
      case true => None
      case false => Option(authenticatedUser.toList(0))
    }

  }

  /*
   * function for adding a new user to the system
   */
  def createNewUser(basicRegForm: BasicRegForm) {
    
   // User.createUser(new User(101, UserType.Professional, basicRegForm.email, basicRegForm.firstName, basicRegForm.lastName, basicRegForm.userName, "Neil", basicRegForm.password, basicRegForm.orgName, basicRegForm.location, List(), List(), List()))

    (basicRegForm.useCurrentLocation == None) match {
      case true => User.createUser(new User(101, UserType.Professional,  basicRegForm.email, basicRegForm.firstName, basicRegForm.lastName, basicRegForm.userName, "Neil", basicRegForm.password, basicRegForm.orgName, basicRegForm.location, List(), List(), List()))
      case false => User.createUser(new User(101, UserType.Professional, basicRegForm.email, basicRegForm.firstName, basicRegForm.lastName, basicRegForm.userName, "Neil", basicRegForm.password, basicRegForm.orgName, basicRegForm.location, List(), List(), List()))
    }

  }

  /*
   * displaying the message to user for notifying the authentication
   */

  def message(notification: String): String = {
    notification
  }
  /*
 * Creates a User
 */
  def createUser(user: User) {
    UserDAO.insert(user)
  }

  /*
 * removes a User
 */
  def removeUser(user: User) {
    UserDAO.remove(user)
  }

  /*
   * Email Validation
   */
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

  /*
 * Registration For a User  
 */
  def registerUser(user: User): String = {
    validateEmail(user.email) match {
      case true =>
        UserDAO.insert(user)
        "Registration Successful"
      case false =>
        "Invalid email address"
    }

  }

  /*
   * Adds a school to User
   */

  def addSchoolToUser(userId: Int, schoolId: ObjectId) {
    val user = UserDAO.findOneByID(userId).get
    UserDAO.update(MongoDBObject("_id" -> userId), user.copy(schoolId = (user.schoolId ++ List(schoolId))), false, false, new WriteConcern)

  }

  /*
   * Add a Class to user
   */
  def addClassToUser(userId: Int, classId: ObjectId) {
    val user = UserDAO.findOneByID(userId).get
    UserDAO.update(MongoDBObject("_id" -> userId), user.copy(classId = (user.classId ++ List(classId))), false, false, new WriteConcern)
  }

  /*
   * Get the Details of a user
   */

  def getUserProfile(userId: Int): User = {
    val user = UserDAO.findOneByID(userId)
    return user.get

  }

  def usertypes: Seq[(String, String)] = {
    val usertype = for (value <- UserType.values) yield (value.id.toString, value.toString)
    usertype.toSeq
  }

}
object UserType extends Enumeration {
  val Student = Value(0, "Student")
  val Educator = Value(1, "Educator")
  val Professional = Value(2, "Professional")
}

object UserDAO extends SalatDAO[User, Int](collection = MongoConnection()("beamstream")("user"))
