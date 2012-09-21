package controllers
import org.bson.types.ObjectId
import models.ProfileImageProviderCache
import models.ResulttoSent
import models.User
import models.User
import models.UserMedia
import net.liftweb.json.Serialization.read
import net.liftweb.json.Serialization.write
import net.liftweb.json.DefaultFormats
import net.liftweb.json.parse
import play.api.data.Forms._
import play.api.mvc._
import play.api.mvc.Controller
import play.api.mvc.Response
import play.api.mvc.Response
import play.api._
import play.libs._
import play.mvc.Http.Request
import utils._
import play.api.libs.json.JsValue
import play.api.libs.json.Json
import play.cache.Cache
import utils.SocialGraphEmbeddedNeo4j
import org.neo4j.graphdb.Node


object UserController extends Controller {

  var activeUsersInTheSystem: List[ObjectId] = List()

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

    val authenticatedUser = getAuthenticatedUser(userEmailorName, userPassword)

    authenticatedUser match {
      case Some(user) =>
        val jsonStatus = new ResulttoSent("success", "Login Successfull")
        val statusToSend = write(jsonStatus)
        val userSession = request.session + ("userId" -> user.id.toString)
        val authenticatedUserJson = write(user)
        //        if(rememberMe==true) Ok(statusToSend).as("application/json").withCookies(Cookie("userName",user.email),Cookie("password",user.password)).withSession(userSession)
        //        else  Ok(statusToSend).as("application/json").withSession(userSession)
        /*
        Cache.set("ActiveUsersInTheSystem", activeUsersInTheSystem ++ List(new ObjectId(request.session.get("userId").get)))
        println(Cache.get("ActiveUsersInTheSystem"))
        */
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

  // 

  /*
   * Reducing active user on sign Out
   */

  def signOut = Action { implicit request =>
    /*
    Cache.set("ActiveUsersInTheSystem", activeUsersInTheSystem -- List(new ObjectId(request.session.get("userId").get)))
    println(Cache.get("ActiveUsersInTheSystem"))
    */
    Ok.withNewSession
  }

  /*
   *  Find User By ID 
   *  @Purpose :Returns the user JSON on Stream page load
   * @Purpose : public profile of a user
   */

  def returnUserJson = Action { implicit request =>
    val loggedInUserId = new ObjectId(request.session.get("userId").get)
    val loggedInUser = User.findUserbyId(loggedInUserId)
    val loggedInUserJson = write(loggedInUser)
    Ok(loggedInUserJson).as("application/json")
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
    SocialGraphEmbeddedNeo4j.clearDb()
    SocialGraphEmbeddedNeo4j.createDb()
    var node:Node = SocialGraphEmbeddedNeo4j.findBSNode(24, "Joe", "Shmoe")
    var node2:Node = SocialGraphEmbeddedNeo4j.createBSNode(72, "Michael", "Vick", node)
    print("node1: " + node.getProperty("firstName"))
    print("node2: " + node2.getProperty("firstName"))
    print("relationship: " + node2.getRelationships())
    SocialGraphEmbeddedNeo4j.shutDown()
    Ok(write(new ResulttoSent("Success", "Users added to Social stack")))
  }
  
  
 
  

}