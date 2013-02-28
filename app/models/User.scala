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
import utils.PasswordHashing

case class User(@Key("_id") id: ObjectId,
  userType: UserType.Value,
  email: String,
  firstName: String,
  lastName: String,
  userName: String,
  alias: String,
  password: Option[String],
  orgName: String,
  location: String,
  socialProfile: String,
  about: String,
  contact: String,
  socialNetwork: Option[String],
  schools: List[ObjectId],
  classes: List[ObjectId],
  documents: List[ObjectId],
  questions: List[ObjectId],
  followers: List[ObjectId])

object User {

  /**
   * Add info to a user (RA)
   */

  def addInfo(schoolList: List[UserSchool], userId: ObjectId) = {
    for (school <- schoolList) {
      val userSchoolIds = User.getUserProfile(userId).schools
      (userSchoolIds.contains(school.id)) match {
        case true => println("School Id already in user schools")
        case false => User.addSchoolToUser(userId, school.id)
      }
    }
  }

  /**
   * Adds a school to User (RA)
   */

  def addSchoolToUser(userId: ObjectId, schoolId: ObjectId) {
    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    UserDAO.update(MongoDBObject("_id" -> userId), user.copy(schools = (user.schools ++ List(schoolId))), false, false, new WriteConcern)
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

  /**
   * Creates a User (RA)
   */
  def createUser(user: User): ObjectId = {
    val userCreated = UserDAO.insert(user)
    userCreated.get
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

  // Check if the User already registered
  def isAlreadyRegistered(userEmail: String, userName: String): Boolean = {
    val userHavingSameMailId = UserDAO.find(MongoDBObject("email" -> userEmail)).toList
    val userHavingSameUserName = UserDAO.find(MongoDBObject("userName" -> userName)).toList
    (userHavingSameMailId.isEmpty && userHavingSameUserName.isEmpty) match {
      case true => true
      case false => false
    }

  }

  /**
   * Add a Class to user
   */
  def addClassToUser(userId: ObjectId, classId: List[ObjectId]) {
    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    if (!user.classes.contains(classId(0))) {
      UserDAO.update(MongoDBObject("_id" -> userId), user.copy(classes = (user.classes ++ classId)), false, false, new WriteConcern)
    }
  }
  /**
   * Get the Details of a user (RA)
   */

  def getUserProfile(userId: ObjectId): User = {
    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    return user

  }

  /*
   * Counting the No. of User with a particular Role
   */
  def countRolesOfAUser(usersList: List[ObjectId]): Map[String, Int] = {
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
   * Rockers name of a message
   */

  def giveMeTheRockers(users: List[ObjectId]): List[String] = {
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
        val deryptedPassword = (new PasswordHashing).decryptThePassword(user(0).password.get)
        SendEmail.sendPassword(emailId, deryptedPassword)
        true
    }
  }

  /**
   * Follow User
   */

  def followUser(userIdOfFollower: ObjectId, userId: ObjectId): Int = {
    val userToFolow = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    (userToFolow.followers.contains(userId)) match {
      case true =>
        UserDAO.update(MongoDBObject("_id" -> userId), userToFolow.copy(followers = (userToFolow.followers filterNot (List(userIdOfFollower) contains))), false, false, new WriteConcern)
        val updatedUserWithAddedIdOfFollower = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
        updatedUserWithAddedIdOfFollower.followers.size
      case false =>
        UserDAO.update(MongoDBObject("_id" -> userId), userToFolow.copy(followers = (userToFolow.followers ++ List(userIdOfFollower))), false, false, new WriteConcern)
        val updatedUserWithAddedIdOfFollower = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
        updatedUserWithAddedIdOfFollower.followers.size
    }
  }

  /**
   * ****************************************Beamstream rearchitecture**********************************************
   */

  // Check if the User already registered (RA)
  def isUserAlreadyRegistered(userEmail: String) = {
    val userHavingSameMailId = UserDAO.find(MongoDBObject("email" -> userEmail)).toList
    (userHavingSameMailId.isEmpty) match {
      case true => true
      case false => false
    }
  }: Boolean

  /**
   * Update User Information
   */
  def updateUser(userId: ObjectId, firstName: String, lastName: String, location: String, about: String, contact: String) {
    val userToUpdate = User.getUserProfile(userId)
    UserDAO.update(MongoDBObject("_id" -> userId), userToUpdate.copy(firstName = firstName, lastName = lastName, location = location, about = about, contact = contact), false, false, new WriteConcern)
  }
}

/*
 * User Types (RA)
 */
object UserType extends Enumeration {
  val Student = Value(0, "Student")
  val Educator = Value(1, "Educator")
  val Professional = Value(2, "Professional")
}

object UserDAO extends SalatDAO[User, ObjectId](collection = MongoHQConfig.mongoDB("user"))
