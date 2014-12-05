package models

import org.bson.types.ObjectId
import com.mongodb.casbah.Imports.MongoDBObject
import com.mongodb.casbah.Imports.WriteConcern
import com.novus.salat.dao.SalatDAO
import com.novus.salat.annotations.raw.Key
import actors.UtilityActor
import play.api.libs.json.JsValue
import utils.MongoHQConfig
import utils.PasswordHashingUtil
import models.mongoContext._
import java.util.Date
import scala.language.postfixOps

case class User(@Key("_id") id: ObjectId,
  userType: UserType.Value,
  email: String,
  firstName: String,
  lastName: String,
  userName: String,
  password: Option[String],
  orgName: String,
  location: String,
  about: String,
  contact: String,
  joiningDate: Date,
  schools: List[ObjectId],
  classes: List[ObjectId],
  followers: List[ObjectId],
  socialNetwork: Option[String],
  socialJson: Option[JsValue],
  friends: Option[List[ObjectId]])

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
  def removeUser(userId: ObjectId) {
    UserDAO.removeById(userId)
  }

  /**
   * Find User By Email
   */
  def findUserByEmailId(userEmail: String): Option[User] = {
    val userFound = UserDAO.find(MongoDBObject("email" -> userEmail)).toList
    (userFound.isEmpty) match {
      case true => None
      case false =>
        Option(userFound.head)
    }
  }

  /**
   * Find User By ObjectId
   */
  def findUserByObjectId(userId: ObjectId): Option[User] = {
    val userFound = UserDAO.find(MongoDBObject("_id" -> userId)).toList
    (userFound.isEmpty) match {
      case true => None
      case false =>
        Option(userFound.head)
    }
  }

  /**
   * Adds a school to User
   */

  def addSchoolToUser(userId: ObjectId, schoolId: ObjectId) {
    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    UserDAO.update(MongoDBObject("_id" -> userId), user.copy(schools = (user.schools ++ List(schoolId))), false, false, new WriteConcern)
  }

  /**
   * Add info to a user (V)
   */

  def addInfo(schoolList: List[UserSchool], userId: ObjectId): List[Unit] = {
    schoolList map {
      case school =>
        val userSchoolIds = User.getUserProfile(userId).get.schools
        (userSchoolIds.contains(school.id)) match {
          case true =>
          case false => User.addSchoolToUser(userId, school.id)
        }
    }
  }

  //TODO : FLow has changed. Check whether it is to be used or not
  /**
   * Find user coming from social site with the UserName (RA )
   * Purpose : Authenticate user via user name only
   */

  def findUserComingViaSocailSite(userName: String, socialNetwork: String): Option[User] = {
    val authenticatedUserviaName = UserDAO.find(MongoDBObject("userName" -> userName, "socialNetwork" -> Option(socialNetwork)))
    (authenticatedUserviaName.isEmpty) match {
      case true => None
      case false => Option(authenticatedUserviaName.toList.head)
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
    UserDAO.update(MongoDBObject("_id" -> userId), user.copy(classes = (user.classes.filterNot(classId contains))), false, false, new WriteConcern)
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
    val userentities = users map { user => UserDAO.findOne(MongoDBObject("_id" -> user)) }
    val rockers = userentities.filterNot(user => user == None)
    rockers map { userentity => userentity.get.firstName + " " + userentity.get.lastName }
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
   * ****************************************Classwall rearchitecture**********************************************
   */

  /**
   * Check if the User with this email has already registered (RA)
   */
  def canUserRegisterWithThisEmail(userEmail: String): Boolean = {
    val userHavingSameMailId = UserDAO.find(MongoDBObject("email" -> userEmail)).toList
    userHavingSameMailId.isEmpty
  }

  /**
   * Check if the User with this username has already registered (VA)
   */
  def canUserRegisterWithThisUsername(userName: String): Boolean = {
    val userHavingSameUserName = UserDAO.find(MongoDBObject("userName" -> userName)).toList
    userHavingSameUserName.isEmpty
  }

  /**
   * Update User Information (V)
   */
  def updateUser(userId: ObjectId, firstName: String, lastName: String, userName: String, email: String, location: String, about: String, contact: String) {
    val userToUpdate = User.getUserProfile(userId)
    UserDAO.update(MongoDBObject("_id" -> userId), userToUpdate.get.copy(firstName = firstName, lastName = lastName, userName = userName, email = email, location = location, about = about, contact = contact), false, false, new WriteConcern)
  }

  /**
   * find the user for Authentication by email and password (RA)
   *
   */
  def findUser(userEmailorName: String, password: String,iam:String): Option[User] = {
    
    val usertype=UserType.apply(iam.toInt).toString()
    val authenticatedUserviaEmail = UserDAO.find(MongoDBObject("email" -> userEmailorName, "password" -> password,"userType"->usertype, "socialNetwork" -> None))
    val authenticatedUserviaName = UserDAO.find(MongoDBObject("userName" -> userEmailorName, "password" -> password,"userType"->usertype, "socialNetwork" -> None))

    (authenticatedUserviaEmail.isEmpty && authenticatedUserviaName.isEmpty) match {
      case true => // No user
        None
      case false =>
        authenticatedUserviaEmail.isEmpty match {
          case true => Option(authenticatedUserviaName.toList(0))
          case false => Option(authenticatedUserviaEmail.toList(0))
        }
    }

  }

  /**
   * Is a follower
   * Purpose: identify if the user is following this User or not
   * Param  followedUserId is the id of the user being followed to be searched
   * Param  userId is the id of follower
   */

  def isAFollower(followedUserId: ObjectId, userId: Object): Boolean = {
    val followedUser = UserDAO.find(MongoDBObject("_id" -> followedUserId)).toList(0)
    followedUser.followers.contains(userId)

  }

}

/**
 * User Types (RA)
 */
object UserType extends Enumeration {
  val Student = Value(0, "Student")
  val Educator = Value(1, "Educator")
  val Professional = Value(2, "Professional")
  val TeachersAssistant = Value(3, "TeachersAssistant")
}

object UserDAO extends SalatDAO[User, ObjectId](collection = MongoHQConfig.mongoDB("user"))
