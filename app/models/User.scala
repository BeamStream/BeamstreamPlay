package models
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import play.mvc._
import play.api.mvc.Session
import utils.MongoHQConfig
import org.bson.types.ObjectId
import play.cache.Cache
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import com.mongodb.casbah.WriteConcern
import utils.SendEmail

case class User(@Key("_id") id: ObjectId,
  userType: UserType.Value,
  email: String,
  val firstName: String,
  lastName: String,
  userName: String,
  alias: String,
  password: String,
  orgName: String,
  location: String,
  socialProfile:String,
  streams: List[ObjectId],
  schoolId: List[ObjectId],
  classId: List[ObjectId],
  documents: List[ObjectId],
  questions: List[ObjectId]) {
}

object User {

  implicit val formats = DefaultFormats

  var activeUsersList: List[ObjectId] = List()

  /*
   * Add info to a user((For SchoolAutopoulate thing))
   * 
   */

  def addInfo(schoolList: List[UserSchool], userid: ObjectId) = {
    for (school <- schoolList) {
      val userSchoolIds = User.findUserbyId(userid).schoolId

      (userSchoolIds.contains(school.id)) match {
        case true => println("School Id already in user Schools")
        case false => User.addSchoolToUser(userid, school.id)
      }

    }
  }

  /*
   * find the user for Authentication by email and password
   * 
   */
  def findUser(userEmailorName: String, password: String): Option[User] = {
    val authenticatedUserviaEmail = UserDAO.find(MongoDBObject("email" -> userEmailorName, "password" -> password))
    val authenticatedUserviaName = UserDAO.find(MongoDBObject("userName" -> userEmailorName, "password" -> password))

    (authenticatedUserviaEmail.isEmpty && authenticatedUserviaName.isEmpty) match {
      case true => // No user
        None
      case false =>
        if (authenticatedUserviaEmail.isEmpty) Option(authenticatedUserviaName.toList(0))
        else Option(authenticatedUserviaEmail.toList(0))
    }

  }

  /*
   * Find user coming from social site with the UserName
   * @Purpose : Authenticate user via user name only
   */

  def findUserComingViaSocailSite(userName: String): Option[User] = {
    val authenticatedUserviaName = UserDAO.find(MongoDBObject("userName" -> userName))

    (authenticatedUserviaName.isEmpty) match {
      case true => None
      case false => Option(authenticatedUserviaName.toList(0))
    }

  }

  /*
 * Creates a User
 */
  def createUser(user: User): ObjectId = {
    val userCreated = UserDAO.insert(user)
    userCreated.get.asInstanceOf[ObjectId]
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
    val emailPart: List[String] = List("gmail.com", "yahoo.com", "rediff.com", "hotmail.com", "aol.com")
    val i: Int = emailId.lastIndexOf("@")
    val stringToMatch: String = emailId.substring(i + 1)
    val emailString: String = emailId.toUpperCase

    (emailString.matches("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$") &&
      !emailPart.contains(stringToMatch)) match {
        case true => true
        case false => false
      }
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

  // Check if the User already registered
  def isAlreadyRegistered(userEmail: String, userName: String): Boolean = {

    val userHavingSameMailId = UserDAO.find(MongoDBObject("email" -> userEmail)).toList
    val userHavingSameUserName = UserDAO.find(MongoDBObject("userName" -> userName)).toList

    (userHavingSameMailId.isEmpty && userHavingSameUserName.isEmpty) match {
      case true => true
      case false => false
    }

  }

  /*
   * Adds a school to User (Intact)
   */

  def addSchoolToUser(userId: ObjectId, schoolId: ObjectId) {
    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    UserDAO.update(MongoDBObject("_id" -> userId), user.copy(schoolId = (user.schoolId ++ List(schoolId))), false, false, new WriteConcern)
  }

  /*
   * Add a Class to user
   */
  def addClassToUser(userId: ObjectId, classId: List[ObjectId]) {
    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    if (! user.classId.contains(classId(0))) {
      UserDAO.update(MongoDBObject("_id" -> userId), user.copy(classId = (user.classId ++ classId)), false, false, new WriteConcern)
    }
  }
  /*
   * Get the Details of a user
   */

  def getUserProfile(userId: ObjectId): User = {
    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    return user

  }

  /*
   * Counting the No. of User with a particular Role
   */
  def countRoles(usersList: List[ObjectId]): Map[String, Int] = {
    var map: Map[String, Int] = Map()
    var count: Int = 0
    for (value <- UserType.values) {
      val users = UserDAO.find(MongoDBObject("userType" -> value.toString)).toList.filter(user => usersList.contains(user.id))
      count = users.size
      map += (value.toString -> count)
    }
    map

  }

  /*
  * Find User By Id
  */

  def findUserbyId(userId: ObjectId): User = {
    val userFound = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    userFound
  }


  /*
   * Rockers name of a message
   */

  def giveMeTheRockers(users: List[ObjectId]): List[String] = {
    //for (user <- users) yield (UserDAO.findOne(MongoDBObject("_id" -> user)).get.firstName)
    users map { user => UserDAO.findOne(MongoDBObject("_id" -> user)).get.firstName }

  }

  /*
   * Recover forgot password
   * @ password of user will be sent to user's email id
   */

  def forgotPassword(emailId: String): Boolean = {
    val user = UserDAO.find(MongoDBObject("email" -> emailId)).toList
    (user.size == 0) match {
      case true => false
      case false =>
        SendEmail.sendPassword(emailId, user(0).password)
        true
    }
  }
}

/*
 * User Types
 */
object UserType extends Enumeration {
  val Student = Value(0, "Student")
  val Educator = Value(1, "Educator")
  val Professional = Value(2, "Professional")
}

object UserDAO extends SalatDAO[User, Int](collection = MongoHQConfig.mongoDB("user"))
