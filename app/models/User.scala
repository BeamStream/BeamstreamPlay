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
import utils.SendEmailUtility
import utils.PasswordHashingUtil
import utils.PasswordHashingUtil
import play.api.libs.json.JsValue
import actors.UtilityActor

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
  followers: List[ObjectId],
  socialJson: Option[String])

object User {

  /**
   * Creates a User (RA)
   */
  def createUser(user: User): Option[ObjectId] = {
    UserDAO.insert(user)
  }

  /**
   * removes a User
   */
  def removeUser(user: User) {
    UserDAO.remove(user)
  }

  /**
   * Adds a school to User (RA)
   */

  def addSchoolToUser(userId: ObjectId, schoolId: ObjectId) {
    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    UserDAO.update(MongoDBObject("_id" -> userId), user.copy(schools = (user.schools ++ List(schoolId))), false, false, new WriteConcern)
  }

  /**
   * Add info to a user (RA)
   */

  def addInfo(schoolList: List[UserSchool], userId: ObjectId) = {
    schoolList map {
      case school =>
        val userSchoolIds = User.getUserProfile(userId).get.schools
        (userSchoolIds.contains(school.id)) match {
          case true => println("School Id already in user schools")
          case false => User.addSchoolToUser(userId, school.id)
        }
    }
  }

  /**
   * Find user coming from social site with the UserName (RA )
   * @Purpose : Authenticate user via user name only
   */

  def findUserComingViaSocailSite(userName: String, socialNetwork: String): Option[User] = {
    val authenticatedUserviaName = UserDAO.find(MongoDBObject("userName" -> userName, "socialNetwork" -> Option(socialNetwork)))
    (authenticatedUserviaName.isEmpty) match {
      case true => None
      case false => Option(authenticatedUserviaName.toList(0))
    }

  }

  /**
   * Add a Class to user (RA)
   */
  def addClassToUser(userId: ObjectId, classId: List[ObjectId]) {
    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    if (!user.classes.contains(classId(0))) {
      UserDAO.update(MongoDBObject("_id" -> userId), user.copy(classes = (user.classes ++ classId)), false, false, new WriteConcern)
    }
  }

  /**
   * Remove Class From User (RA)
   */
  def removeClassFromUser(userId: ObjectId, classId: List[ObjectId]) {
    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    UserDAO.update(MongoDBObject("_id" -> userId), user.copy(classes = (user.classes.filterNot (classId contains))), false, false, new WriteConcern)
  }
  /**
   * Get the Details of a user (RA)
   */

  def getUserProfile(userId: ObjectId): Option[User] = {
    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList
    user.isEmpty match {
      case false => Option(user.head)
      case true => None
    }

  }

  /**
   * Counting the No. of User with a particular Role (RA)
   */
  def countRolesOfAUser(usersList: List[ObjectId]): Map[String, Int] = {
    var map: Map[String, Int] = Map()
    UserType.values map {
      case value =>
        val users = UserDAO.find(MongoDBObject("userType" -> value.toString)).toList.filter(user => usersList.contains(user.id))
        map += (value.toString -> users.size)
    }
    map
  }

  /**
   * Rockers name of a message
   */

  def giveMeTheRockers(users: List[ObjectId]): List[String] = {
    var userentities = users map { user => UserDAO.findOne(MongoDBObject("_id" -> user)).get }
    
    userentities map { userentity => userentity.firstName + " " + userentity.lastName}
  }

  /**
   * Recover forgot password
   * @ password of user will be sent to user's email id
   */

  def forgotPassword(emailId: String): Boolean = {
    val user = UserDAO.find(MongoDBObject("email" -> emailId)).toList
    (user.size == 0) match {
      case true => false
      case false =>
        val deryptedPassword = (new PasswordHashingUtil).decryptThePassword(user(0).password.get)
        UtilityActor.forgotPasswordMail(emailId, deryptedPassword)
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

  /**
   * Check if the User has already registered (RA)
   */
  def canUserRegister(userEmailOrName: String) = {
    val userHavingSameMailId = UserDAO.find(MongoDBObject("email" -> userEmailOrName,"socialNetwork" -> None))
    val userHavingSameUserName = UserDAO.find(MongoDBObject("userName" -> userEmailOrName))
    (userHavingSameMailId.isEmpty && userHavingSameUserName.isEmpty) match {
      case true => true
      case false => false
    }
  }: Boolean

  /**
   * Update User Information
   */
  def updateUser(userId: ObjectId, firstName: String, lastName: String, email: String, location: String, about: String, contact: String) {
    val userToUpdate = User.getUserProfile(userId)
    UserDAO.update(MongoDBObject("_id" -> userId), userToUpdate.get.copy(firstName = firstName, lastName = lastName, email = email, location = location, about = about, contact = contact), false, false, new WriteConcern)
  }

  /**
   * find the user for Authentication by email and password (RA)
   *
   */
  def findUser(userEmailorName: String, password: String): Option[User] = {
    val authenticatedUserviaEmail = UserDAO.find(MongoDBObject("email" -> userEmailorName, "password" -> password,"socialNetwork" -> None))
    val authenticatedUserviaName = UserDAO.find(MongoDBObject("userName" -> userEmailorName, "password" -> password,"socialNetwork" -> None))

    (authenticatedUserviaEmail.isEmpty && authenticatedUserviaName.isEmpty) match {
      case true => // No user
        None
      case false =>
        if (authenticatedUserviaEmail.isEmpty) Option(authenticatedUserviaName.toList(0))
        else Option(authenticatedUserviaEmail.toList(0))
    }

  }
  
    /**
   * Is a follower
   * @Purpose: identify if the user is following this User or not
   * @param  followedUserId is the id of the user being followed to be searched
   * @param  userId is the id of follower
   */

  def isAFollower(followedUserId: ObjectId, userId: Object): Boolean = {
    val followedUser = UserDAO.find(MongoDBObject("_id" -> followedUserId)).toList(0)

    (followedUser.followers.contains(userId)) match {
      case true => true
      case false => false
    }

  }

}

/**
 * User Types (RA)
 */
object UserType extends Enumeration {
  val Student = Value(0, "Student")
  val Educator = Value(1, "Educator")
  val Professional = Value(2, "Professional")
}

object UserDAO extends SalatDAO[User, ObjectId](collection = MongoHQConfig.mongoDB("user"))
