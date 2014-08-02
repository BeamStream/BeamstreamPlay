package controllers

import scala.collection.immutable.List
import scala.concurrent.Future

import org.bson.types.ObjectId
import org.neo4j.graphdb.Node

import models.AvailableUsers
import models.LoginResult
import models.OnlineUsersResult
import models.ResulttoSent
import models.Stream
import models.Token
import models.User
import models.UserMedia
import net.liftweb.json.Serialization.write
import play.api.Play
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc.Action
import play.api.mvc.AnyContent
import play.api.mvc.Controller
import play.api.mvc.Cookie
import play.api.mvc.DiscardingCookie
import utils.Neo4jFriend
import utils.ObjectIdSerializer
import utils.OnlineUserCache
import utils.PasswordHashingUtil
import utils.SendEmailUtility
import utils.SocialGraphEmbeddedNeo4j

object UserController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
  } + new ObjectIdSerializer

  /**
   * Reducing active user on sign Out
   */

  def signOut: Action[AnyContent] = Action { implicit request =>
    val userId_session = request.session.get("userId")
    val userId_cookies = request.cookies.get("Beamstream")
    if (userId_session.isDefined || userId_cookies.isDefined) {
      OnlineUserCache.setOffline(userId_cookies.get.value.split(" ")(0))
      Ok(write(ResulttoSent("Success", userId_cookies.get.value.split(" ")(0)))).withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
    } else {
      Redirect("/login")
    }
  }

  /**
   * Get All Online Users (Only Those Who Are The Member Of User's Class)
   */

  def getAllOnlineUsers: Action[AnyContent] = Action { implicit request =>
    var usersToShow: List[String] = Nil
    val userIdFound = request.session.get("userId")
    userIdFound match {
      case None => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
      case Some(userId) =>
        val onlineUsers = OnlineUserCache.returnOnlineUsers.isEmpty match {
          case false =>

            val userToShow = OnlineUserCache.returnOnlineUsers.head.onlineUsers //-= request.session.get("userId").getOrElse((new ObjectId).toString())
            val otherUsers = userToShow.keys.toList

            val currentUsers = User.getUserProfile(new ObjectId(userId))
            currentUsers match {
              case None => Option(Nil)
              case Some(currentUsers) =>
                val currentUsersClasses = currentUsers.classes
                currentUsersClasses map {
                  case eachClassOfUser =>

                    val streams = models.Class.findClasssById(eachClassOfUser)
                    streams match {
                      case None => User.removeClassFromUser(new ObjectId(request.session.get("userId").get), List(eachClassOfUser))
                      case Some(streams) =>
                        val streamUsers = Stream.findStreamById(streams.streams.head).get.usersOfStream
                        val streamUserList = streamUsers map {
                          case user => user.toString
                        }
                        usersToShow ++= otherUsers.intersect(streamUserList)
                    }
                }
                val onlineUsersWithDetails = (usersToShow.distinct) map {
                  case eachUserId =>
                    val userWithDetailedInfo = User.getUserProfile(new ObjectId(eachUserId))
                    val profilePicForUser = UserMedia.getProfilePicForAUser(new ObjectId(eachUserId))
                    val onlineUsersAlongWithDetails = (profilePicForUser.isEmpty) match {
                      case true => {
                        AvailableUsers(userWithDetailedInfo.get.id, userWithDetailedInfo.get.firstName,
                          userWithDetailedInfo.get.lastName, "")
                      }
                      case false => {
                        AvailableUsers(userWithDetailedInfo.get.id, userWithDetailedInfo.get.firstName,
                          userWithDetailedInfo.get.lastName, profilePicForUser(0).mediaUrl)
                      }
                    }
                    onlineUsersAlongWithDetails

                }
                Option(onlineUsersWithDetails)
            }
          case true => Option(Nil)
        }
        Ok(write(OnlineUsersResult(onlineUsers.get))).as("application/json")
    }
  }

  /**
   * Invite User To join Beamstream
   */
  /*def inviteUserToBeamstream: Action[AnyContent] = Action { implicit request =>
    val userJsonMap = request.body.asFormUrlEncoded.get
    val emailList = userJsonMap("data").toList.head.split(",").toList
    for (eachEmail <- emailList) SendEmailUtility.inviteUserToBeamstream(eachEmail)
    Ok(write(ResulttoSent("Success", "Invitations has been sent"))).as("application/json")
  }*/
  /**
   *  Find User By ID
   *  @Purpose :Returns the user JSON on Stream page load
   * @Purpose : public profile of a user
   */

  def returnUserJson: Action[AnyContent] = Action { implicit request =>
    val userId = request.session.get("userId")
    if (userId == None) {
      Ok(write("Session Has Been Expired")).as("application/json")
    } else {
      val loggedInUser = User.getUserProfile(new ObjectId(userId.get))
      Ok(write(loggedInUser)).as("application/json")
    }
  }

  /**
   * Password Recovery
   * @purpose : Send a mail to user with password
   */
  def forgotPassword: Action[AnyContent] = Action { implicit request =>
    val jsonReceived = request.body.asJson.get
    val emailId = (jsonReceived \ "mailId").as[String]
    val passwordSent = User.forgotPassword(emailId)
    (passwordSent.equals(true)) match {
      case true => Ok(write(new ResulttoSent("Success", "Password Sent")))
      case false => Ok(write(new ResulttoSent("Failure", "No User Found")))
    }

  }

  // Code by Daniel Hew Starts here

  def testNeo4j: Action[AnyContent] = Action { implicit request =>
    var node: Node = SocialGraphEmbeddedNeo4j.findOrCreateBSNode(24, "Joe", "Shmoe")
    var node2: Node = SocialGraphEmbeddedNeo4j.createBSNode(72, "Michael", "Vick", node)
    print("node1: " + node.getProperty("firstName") + "\n")
    print("node2: " + node2.getProperty("firstName") + "\n")
    print("relationship: " + node2.getRelationships() + "\n")
    Ok(write(new ResulttoSent("Success", "User added to Social stack")))
  }

  def testNeo4jFindNode: Action[AnyContent] = Action { implicit request =>
    //var node: Node = SocialGraphEmbeddedNeo4j.findOrCreateBSNode(24, null, null)
    var node: Node = SocialGraphEmbeddedNeo4j.findBSNode(50)
    print("node1: " + node.getProperty("firstName") + "\n")
    Ok(write(new ResulttoSent("Success", "User found")))
  }

  def testNeo4jAddFriends: Action[AnyContent] = Action { implicit request =>
    var node: Node = SocialGraphEmbeddedNeo4j.findOrCreateBSNode(50, "Dirk", "Nowitzki")
    var node1: Neo4jFriend = new Neo4jFriend("hotpotato1", "forum1", 51, null, null)
    var node2: Neo4jFriend = new Neo4jFriend("hotpotato2", "forum2", 52, null, null)
    var node3: Neo4jFriend = new Neo4jFriend("hotpotato3", "forum3", 53, null, null)
    var node4: Neo4jFriend = new Neo4jFriend("hotpotato4", "forum4", 54, null, null)
    val friends = Array(node1, node2, node3, node4)
    val worked = this.addFriendNeo4j(friends, 50)
    print("addFriends successful: " + worked + "\n")
    Ok(write(new ResulttoSent("Success", "Friends Added!!!")))
  }

  def testNeo4jPrintFriends: Action[AnyContent] = Action { implicit request =>
    var node: Node = SocialGraphEmbeddedNeo4j.findBSNode(50)
    var relationships = node.getRelationships();
    var iterator = relationships.iterator()

    print("parent: " + node.getProperty("firstName") + "\n")

    while (iterator.hasNext()) {
      print("relationship: " + iterator.next() + "\n")
    }
    Ok(write(new ResulttoSent("Success", "User friends printed!")))
  }

  /*
   * Add a list of Friends given a parent UserId and a list of friends of that user.
   */
  def addFriendNeo4j(friends: Array[Neo4jFriend], userId: Long): Boolean = {
    var node: Node = SocialGraphEmbeddedNeo4j.findBSNode(userId)
    if (node == null) {
      Ok(write(new ResulttoSent("Failure", "Parent user does not exist in friends database")))
      true
    }
    for (friend <- friends) {
      var node2: Node = SocialGraphEmbeddedNeo4j.createBSNode(friend.userId, friend.firstName, friend.lastName, node)
      //TODO: userId should be an String EmailAddress rather than an Integer.  Must replace this when ready
      val user = User.getUserProfile(new ObjectId(userId.toString()))
      SendEmailUtility.inviteUserToBeamstreamWithReferral(friend.emailaddress, user.get.firstName + " " + user.get.lastName, userId.toString())
    }
    SocialGraphEmbeddedNeo4j.shutDown()
    Ok(write(new ResulttoSent("Success", "Users added to Social stack")))
    true
  }

  // Code by Daniel Hew Ends here

  /**
   * Deactivate User On Browser Closed Event
   */

  def active: Action[AnyContent] = Action { implicit request =>
    Future {
      val utcMilliseconds = OnlineUserCache.returnUTCTime
      request.session.get("userId") match {
        case Some(user) =>
          OnlineUserCache.setOnline(user, utcMilliseconds)
        case None =>
      }

    }
    Ok
  }

  /**
   * Follow User
   */

  def followUser(userIdOfFollower: String): Action[AnyContent] = Action { implicit request =>
    val followers = User.followUser(new ObjectId(request.session.get("userId").get), new ObjectId(userIdOfFollower))
    Ok(write(followers.toString)).as("application/json")
  }

  /**
   * ------------------------- Re architecture  ----------------------------------------------------------------------
   */
  /**
   * Find and Authenticate the user to proceed. (RA)
   */
  def findUser: Action[AnyContent] = Action { implicit request =>
    val jsonReceived = request.body.asJson.get
    val userEmailorName = (jsonReceived \ "mailId").as[String]
    val userPassword = (jsonReceived \ "password").as[String]
    val encryptedPassword = (new PasswordHashingUtil).encryptThePassword(userPassword)
    val authenticatedUser = User.findUser(userEmailorName, encryptedPassword)

    authenticatedUser match {
      case Some(user) =>
        val userSession = request.session + ("userId" -> user.id.toString)
        val authenticatedUserJson = write(user)
        val loggedInUser = User.getUserProfile(user.id)
        val profilePic = UserMedia.getProfilePicForAUser(user.id)
        val tokenReceived = Token.findTokenByUserId(authenticatedUser.get.id.toString())
        val userToken = request.session + ("token" -> tokenReceived(0).tokenString)
        val server = Play.current.configuration.getString("server").get
        val hasClasses = loggedInUser.get.classes.isEmpty match {
          case true => false
          case false => true
        }

        tokenReceived(0).used match {
          case false =>
            Ok(write(LoginResult(ResulttoSent("Failure", "Please verify your Email"), loggedInUser, None, Option(hasClasses), server))).as("application/json")
          case true =>

            val result = loggedInUser.get.schools.isEmpty match {
              case true => Ok("Oops... Looks like you had some problem during registration, follow the link on your emailid to register or signup again")
              case false =>
                (profilePic(0).mediaUrl) match {
                  case "" =>
                    Ok(write(LoginResult(ResulttoSent("Success", "Login Successful"), loggedInUser, None, Option(hasClasses), server))).as("application/json").withSession(userSession).withCookies(Cookie("Beamstream", user.id.toString() + " stream", Option(864000000)))
                  case _ => Ok(write(LoginResult(ResulttoSent("Success", "Login Successful"), loggedInUser, Option(profilePic.head.mediaUrl), Option(hasClasses), server))).as("application/json").withSession(userSession).withCookies(Cookie("Beamstream", user.id.toString() + " stream", Option(864000000)))
                }

            }

            Future {
              val utcMilliseconds = OnlineUserCache.returnUTCTime
              OnlineUserCache.setOnline(user.id.toString, utcMilliseconds)
            }

            result
        }
      case None =>
        Ok(write(LoginResult(ResulttoSent("Failure", "Login Unsuccessful"), None, None, None, ""))).as("application/json")
    }
  }

  /**
   * Render Forgot Password View
   */

  def renderForgotPasswordView: Action[AnyContent] = Action { implicit request =>
    Ok(views.html.recoverPassword("Recover Password Page"))
  }

  /**
   * Reset Account
   */

  def accountReset: Action[AnyContent] = Action { implicit request =>
    Ok(views.html.resetaccount())
  }

  def reset: Action[AnyContent] = Action { implicit request =>
    val data = request.body.asFormUrlEncoded.get
    val emailToReset = data("email").toList(0)
    val user = User.findUserByEmailId(emailToReset)
    (user != None) match {
      case true =>
        User.removeUser(user.get.id)
        Ok("Account Resetted Successfuly")
      case false => Ok("No User Found With This Email")
    }
  }

}
