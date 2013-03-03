package controllers
import org.bson.types.ObjectId
import org.neo4j.graphdb.Node
import models.ResulttoSent
import models.User
import models.User
import net.liftweb.json.Serialization.read
import net.liftweb.json.Serialization.write
import net.liftweb.json.DefaultFormats
import net.liftweb.json.parse
import play.api.Play.current
import play.api.data.Forms._
import play.api.libs.json.JsValue
import play.api.libs.json.Json
import play.api.mvc._
import play.api.mvc.Controller
import play.api.mvc.Response
import play.api._
import play.libs._
import play.mvc.Http.Request
import utils._
import utils.SocialGraphEmbeddedNeo4j
import utils.onlineUserCache
import scala.collection.immutable.List
import models.UserMedia
import models.OnlineUsers

object UserController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
  } + new ObjectIdSerializer

  /*
 * Find and Authenticate the user to proceed
 */
  def findUser = Action { implicit request =>

    val userJsonMap = request.body.asFormUrlEncoded.get
    val user = userJsonMap("data").toList(0)
    val userJson = net.liftweb.json.parse(user)
    val userEmailorName = (userJson \ "email").extract[String]
    val userPassword = (userJson \ "password").extract[String]

    val encryptedPassword = (new PasswordHashing).encryptThePassword(userPassword)

    val authenticatedUser = getAuthenticatedUser(userEmailorName, encryptedPassword)

    authenticatedUser match {
      case Some(user) =>
        val jsonStatus = new ResulttoSent("success", "Login Successfull")
        val statusToSend = write(jsonStatus)
        val userSession = request.session + ("userId" -> user.id.toString)
        val authenticatedUserJson = write(user)
        val noOfOnLineUsers = onlineUserCache.setOnline(user.id.toString)
        println("Online Users" + noOfOnLineUsers)
        Ok(statusToSend).withSession(userSession)

      case None =>
        val jsonStatus = new ResulttoSent("failure", "Login Unsuccessfull")
        val statusToSend = write(jsonStatus)
        Ok(statusToSend).as("application/json")
    }

  }

  def getAuthenticatedUser(userEmailorName: String, userPassword: String): Option[User] = {
    userPassword.isEmpty match {
      case true =>
        User.findUserComingViaSocailSite(userEmailorName)
      case false =>
        User.findUser(userEmailorName, userPassword)
    }
  }

  /*
   * Register User via social sites
   * Deprecated in favor of SocialController.authenticateUser
   */

  def registerUserViaSocialSite = Action { implicit request =>
    val tokenList = request.body.asFormUrlEncoded.get.values.toList(0)
    val token = tokenList(0)
    val apiKey = Play.current.configuration.getString("janrain_apiKey").get
    val URL = "https://rpxnow.com/api/v2/auth_info"

    val promise = WS.url(URL).setQueryParameter("format", "json").setQueryParameter("token", token).setQueryParameter("apiKey", apiKey).get
    val res = promise.get
    val body = res.getBody

    Ok(body).as("application/json")

  }

  /*
   * Get all Contact data via social sites
   * Deprecated in favor of SocialController.authenticateUser
   */

  def getContactsViaSocialSite = Action { implicit request =>
    val tokenList = request.body.asFormUrlEncoded.get.values.toList(0)
    val token = tokenList(0)
    val apiKey = Play.current.configuration.getString("janrain_apiKey").get
    val URL = "https://rpxnow.com/api/v2/auth_info"

    val promise = WS.url(URL).setQueryParameter("format", "json").setQueryParameter("token", token).setQueryParameter("apiKey", apiKey).get
    val res = promise.get
    val body = res.getBody

    val json = Json.parse(body)
    val identifier = (json \ "profile" \ "identifier").as[String]

    val URL2 = "https://rpxnow.com/api/v2/get_contacts"
    val promise2 = WS.url(URL2).setQueryParameter("format", "json").setQueryParameter("identifier", identifier).setQueryParameter("apiKey", apiKey).get
    val res2 = promise2.get
    val body2 = res2.getBody

    Ok(body2).as("application/json")

  }

  /*
   * Reducing active user on sign Out
   */

  def signOut = Action { implicit request =>
    val noOfOnLineUsers = onlineUserCache.setOffline(request.session.get("userId").get)
    println("Online Users" + noOfOnLineUsers)
    Ok.withNewSession
  }

  /**
   * Get All Online Users
   */

  def getAllOnlineUsers = Action { implicit request =>

    var onlineUsersAlongWithDetails: List[OnlineUsers] = List()
    (onlineUserCache.returnOnlineUsers.isEmpty == true) match {
      case false =>
        for (userIdList <- onlineUserCache.returnOnlineUsers) {
          for (eachUserId <- userIdList.asInstanceOf[List[String]]) {
            val userWithDetailedInfo = User.getUserProfile(new ObjectId(eachUserId))
            val profilePicForUser = UserMedia.getProfilePicForAUser(new ObjectId(eachUserId))
            if (profilePicForUser.isEmpty) {
              onlineUsersAlongWithDetails ++= List(new OnlineUsers(userWithDetailedInfo.id, userWithDetailedInfo.firstName,
                userWithDetailedInfo.lastName, ""))
            } else {
              onlineUsersAlongWithDetails ++= List(new OnlineUsers(userWithDetailedInfo.id, userWithDetailedInfo.firstName,
                userWithDetailedInfo.lastName, profilePicForUser(0).mediaUrl))
            }
          }
        }
        Ok(write(onlineUsersAlongWithDetails)).as("application/json")
      case true => Ok(write(onlineUsersAlongWithDetails)).as("application/json")
    }
  }

  /**
   * Invite User To join Beamstream
   */
  def inviteUserToBeamstream = Action { implicit request =>
    val userJsonMap = request.body.asFormUrlEncoded.get
    val emailList = userJsonMap("data").toList.head.split(",").toList
    for (eachEmail <- emailList) SendEmail.inviteUserToBeamstream(eachEmail)
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
      val loggedInUserId = new ObjectId(userId.get)
      val loggedInUser = User.getUserProfile(loggedInUserId)
      val loggedInUserJson = write(loggedInUser)
      Ok(loggedInUserJson).as("application/json")
    }
  }

  /*
   * Password Recovery
   * @purpose : Send a mail to user with password
   */
  def forgotPassword = Action { implicit request =>
    val emailIdJsonMap = request.body.asFormUrlEncoded.get
    val emailId = emailIdJsonMap("email").toList(0)
    val passwordSent = User.forgotPassword(emailId)
    (passwordSent.equals(true)) match {
      case true => Ok(write(new ResulttoSent("Success", "Password Sent")))
      case false => Ok(write(new ResulttoSent("Failure", "No User Found")))
    }

  }

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
      SendEmail.inviteUserToBeamstreamWithReferral(friend.emailaddress, userId.toString())
    }
    SocialGraphEmbeddedNeo4j.shutDown()
    Ok(write(new ResulttoSent("Success", "Users added to Social stack")))
    return true
  }

  /*
 * Deactivate User On Browser Closed Event
 */
  def browserClosed = Action { implicit request =>
    println("Got A Hit On Browser Close Event")
    val noOfOnLineUsers = onlineUserCache.setOffline(request.session.get("userId").get)
    println("Online Users" + noOfOnLineUsers)
    Ok
  }

  /**
   * Follow User
   */

  def followUser = Action { implicit request =>
    val userIdToFollowJsonMap = request.body.asFormUrlEncoded.get
    val userId = userIdToFollowJsonMap("userId").toList(0)
    val followers = User.followUser(new ObjectId(request.session.get("userId").get), new ObjectId(userId))
    Ok(write(followers.toString)).as("application/json")
  }

  /**
   * ------------------------- Re architecture  -----------------------------------------------------------------------------------
   */
  
/*
 * Find and Authenticate the user to proceed.  This a modification to FindUser as a GET
 */
  def loginUser(username:String, password:String) = Action { implicit request =>

    val encryptedPassword = (new PasswordHashing).encryptThePassword(password)

    val authenticatedUser = getAuthenticatedUser(username, encryptedPassword)

    authenticatedUser match {
      case Some(user) =>
        val jsonStatus = new ResulttoSent("success", "Login Successful")
        val statusToSend = write(jsonStatus)
        val userSession = request.session + ("userId" -> user.id.toString)
        val authenticatedUserJson = write(user)
        val noOfOnLineUsers = onlineUserCache.setOnline(user.id.toString)
        println("Online Users" + noOfOnLineUsers)
        Ok(statusToSend).withSession(userSession)

      case None =>
        val jsonStatus = new ResulttoSent("failure", "Login Unsuccessful")
        val statusToSend = write(jsonStatus)
        Ok(statusToSend).as("application/json")
    }

  }

}
