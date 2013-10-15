package controllers

import scala.collection.immutable.List
import org.bson.types.ObjectId
import org.neo4j.graphdb.Node
import models.LoginResult
import models.OnlineUsersResult
import models.ResulttoSent
import models.User
import models.UserMedia
import net.liftweb.json.Serialization.write
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.Neo4jFriend
import utils.ObjectIdSerializer
import utils.PasswordHashingUtil
import utils.SendEmailUtility
import utils.SocialGraphEmbeddedNeo4j
import utils.OnlineUserCache
import utils.OnlineUsers
import models.School
import models.Stream
import models.AvailableUsers

object UserController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
  } + new ObjectIdSerializer

  /**
   * Reducing active user on sign Out
   */

  def signOut = Action { implicit request =>
    val noOfOnLineUsers = OnlineUserCache.setOffline(request.session.get("userId").get)
    Ok(write(ResulttoSent("Success", "Signed Out"))).withNewSession

  }

  /**
   * Get All Online Users (Only Those Who Are The Member Of User's Class)
   */

  def getAllOnlineUsers = Action { implicit request =>
    var usersToShow: List[ObjectId] = Nil
    val onlineUsers = (OnlineUserCache.returnOnlineUsers.isEmpty == true) match {
      case false =>
        val otherUsers = OnlineUserCache.returnOnlineUsers.head.onlineUsers filterNot (List(new ObjectId(request.session.get("userId").get))contains)

        val currentUsersClasses = User.getUserProfile(new ObjectId(request.session.get("userId").get)).get.classes

        currentUsersClasses map {
          case eachClassOfUser =>

            val streams = models.Class.findClasssById(eachClassOfUser).get.streams
            val streamUsers = Stream.findStreamById(streams.head).get.usersOfStream
            usersToShow ++= otherUsers.intersect(streamUsers)
        }

        val onlineUsersWithDetails = (usersToShow.removeDuplicates) map {
          case eachUserId =>
            val userWithDetailedInfo = User.getUserProfile(eachUserId)
            val profilePicForUser = UserMedia.getProfilePicForAUser(eachUserId)
            val onlineUsersAlongWithDetails = (profilePicForUser.isEmpty) match {
              case true => {
                if (userWithDetailedInfo != None) {
                  AvailableUsers(userWithDetailedInfo.get.id, userWithDetailedInfo.get.firstName,
                    userWithDetailedInfo.get.lastName, "")
                }
              }
              case false => {
                if (userWithDetailedInfo != None) {
                  AvailableUsers(userWithDetailedInfo.get.id, userWithDetailedInfo.get.firstName,
                    userWithDetailedInfo.get.lastName, profilePicForUser(0).mediaUrl)
                }
              }
            }
            onlineUsersAlongWithDetails

        }
        Option(onlineUsersWithDetails)

      case true => Option(Nil)
    }

    Ok(write(OnlineUsersResult(onlineUsers.get))).as("application/json")

  }

  /**
   * Invite User To join Beamstream
   */
  def inviteUserToBeamstream = Action { implicit request =>
    val userJsonMap = request.body.asFormUrlEncoded.get
    val emailList = userJsonMap("data").toList.head.split(",").toList
    for (eachEmail <- emailList) SendEmailUtility.inviteUserToBeamstream(eachEmail)
    Ok(write(ResulttoSent("Success", "Invitations has been sent"))).as("application/json")
  }
  /**
   *  Find User By ID
   *  @Purpose :Returns the user JSON on Stream page load
   * @Purpose : public profile of a user
   */

  def returnUserJson = Action { implicit request =>
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
  def forgotPassword = Action { implicit request =>
    val jsonReceived = request.body.asJson.get
    val emailId = (jsonReceived \ "mailId").as[String]
    val passwordSent = User.forgotPassword(emailId)
    (passwordSent.equals(true)) match {
      case true => Ok(write(new ResulttoSent("Success", "Password Sent")))
      case false => Ok(write(new ResulttoSent("Failure", "No User Found")))
    }

  }

  // Code by Dan Starts here

  def testNeo4j = Action { implicit request =>
    var node: Node = SocialGraphEmbeddedNeo4j.findOrCreateBSNode(24, "Joe", "Shmoe")
    var node2: Node = SocialGraphEmbeddedNeo4j.createBSNode(72, "Michael", "Vick", node)
    print("node1: " + node.getProperty("firstName") + "\n")
    print("node2: " + node2.getProperty("firstName") + "\n")
    print("relationship: " + node2.getRelationships() + "\n")
    Ok(write(new ResulttoSent("Success", "User added to Social stack")))
  }

  def testNeo4jFindNode = Action { implicit request =>
    //var node: Node = SocialGraphEmbeddedNeo4j.findOrCreateBSNode(24, null, null)
    var node: Node = SocialGraphEmbeddedNeo4j.findBSNode(50)
    print("node1: " + node.getProperty("firstName") + "\n")
    Ok(write(new ResulttoSent("Success", "User found")))
  }

  def testNeo4jAddFriends = Action { implicit request =>
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

  def testNeo4jPrintFriends = Action { implicit request =>
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
      return true
    }
    for (friend <- friends) {
      var node2: Node = SocialGraphEmbeddedNeo4j.createBSNode(friend.userId, friend.firstName, friend.lastName, node)
      //TODO: userId should be an String EmailAddress rather than an Integer.  Must replace this when ready
      val user = User.getUserProfile(new ObjectId(userId.toString()))
      SendEmailUtility.inviteUserToBeamstreamWithReferral(friend.emailaddress, user.get.firstName + " " + user.get.lastName, userId.toString())
    }
    SocialGraphEmbeddedNeo4j.shutDown()
    Ok(write(new ResulttoSent("Success", "Users added to Social stack")))
    return true
  }

  // Code by Dan Ends here
  /**
   * Deactivate User On Browser Closed Event
   */
  def browserClosed = Action { implicit request =>
    val noOfOnLineUsers = OnlineUserCache.setOffline(request.session.get("userId").get)
    println("Online Users" + noOfOnLineUsers)
    Ok
  }

  /**
   * Follow User
   */

  def followUser(userIdOfFollower: String) = Action { implicit request =>
    val followers = User.followUser(new ObjectId(request.session.get("userId").get), new ObjectId(userIdOfFollower))
    Ok(write(followers.toString)).as("application/json")
  }

  /**
   * ------------------------- Re architecture  ----------------------------------------------------------------------
   */
  /**
   * Find and Authenticate the user to proceed. (RA)
   */
  def findUser = Action { implicit request =>
    val jsonReceived = request.body.asJson.get
    val userEmailorName = (jsonReceived \ "mailId").as[String]
    val userPassword = (jsonReceived \ "password").as[String]
    val encryptedPassword = (new PasswordHashingUtil).encryptThePassword(userPassword)
    val authenticatedUser = User.findUser(userEmailorName, encryptedPassword)
    authenticatedUser match {
      case Some(user) =>
        val userSession = request.session + ("userId" -> user.id.toString)
        val authenticatedUserJson = write(user)
        val noOfOnLineUsers = OnlineUserCache.setOnline(user.id.toString)
        println("Online Users" + noOfOnLineUsers)
        val loggedInUser = User.getUserProfile(user.id)
        val profilePic = UserMedia.getProfilePicForAUser(user.id)

        val hasClasses = loggedInUser.get.classes.isEmpty match {
          case true => false
          case false => true
        }

        val result = loggedInUser.get.schools.isEmpty match {
          case true => Ok("Oops... Looks like you had some problem during registration, follow the link on your emailid to register or signup again")
          case false =>
            (profilePic.isEmpty) match {
              case false =>
                Ok(write(LoginResult(ResulttoSent("Success", "Login Successful"), loggedInUser, Option(profilePic.head.mediaUrl), Option(hasClasses)))).as("application/json").withSession(userSession)
              case true => Ok(write(LoginResult(ResulttoSent("Success", "Login Successful"), loggedInUser, None, Option(hasClasses)))).as("application/json").withSession(userSession)
            }

        }
        result
      case None =>
        Ok(write(LoginResult(ResulttoSent("Failure", "Login Unsuccessful"), None, None, None))).as("application/json")
    }

  }

  /**
   * Render Forgot Password View
   */

  def renderForgotPasswordView = Action { implicit request =>
    Ok(views.html.recoverPassword("Recover Password Page"))
  }

  /**
   * Reset Account
   */

  def accountReset = Action { implicit request =>
    Ok(views.html.resetaccount())
  }

  def reset = Action { implicit request =>
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

  /**
   * Chatting Specific
   */
  //  def checkForChat(userId: String) = Action { implicit request =>
  //    val a = ChatActorObject.chatUsers.get(userId)
  //    if (a != None) Ok(a.get.toString)
  //    else Ok("")
  //  }

}
