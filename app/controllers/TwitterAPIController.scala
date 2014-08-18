package controllers

import play.api.Logger
import play.api.Play
import play.api.mvc.Action
import play.api.mvc.AnyContent
import play.api.mvc.Controller
import twitter4j.Twitter
import twitter4j.TwitterException
import twitter4j.TwitterFactory
import twitter4j.auth.RequestToken
import twitter4j.conf.ConfigurationBuilder

object TwitterAPIController extends Controller{

  val currentUserId = "userId"
  var twitter: Twitter = null
  var requestToken: RequestToken = null

  /**
   * Login Through Twitter
   */
  def twitterLogin: Action[AnyContent] = Action { implicit request =>
    val cb: ConfigurationBuilder = new ConfigurationBuilder()
    val consumer_key = Play.current.configuration.getString("consumer_key").get
    val consumer_secret = Play.current.configuration.getString("consumer_secret").get
    try {
      cb.setDebugEnabled(true)
        .setOAuthConsumerKey(consumer_key)
        .setOAuthConsumerSecret(consumer_secret)
      val tf: TwitterFactory = new TwitterFactory(cb.build());
      twitter = tf.getInstance
      val callbackURL = getContextUrl + "/twitter/callback"
      requestToken = twitter.getOAuthRequestToken(callbackURL)
      Ok(requestToken.getAuthenticationURL)
    } catch {
      case ex: TwitterException => {
        Logger.error("Error During Login Through Twitter - " + ex)
        Ok//(views.html.RedirectMain("", "failure"))
      }
      case ex: Any => {
        Logger.error("Error During Login Through Twitter - " + ex)
        Ok//(views.html.RedirectMain("", "failure"))
      }
    }
  }

   /**
   * To get The root context from application.config
   */
  def getContextUrl: String = {
    Play.current.configuration.getString("server").get
  }

  /**
   * Twitter CallBack Request
   */
  def twitterCallBack: Action[AnyContent] = Action { implicit request =>
    //https://api.twitter.com/1/users/lookup.xml?user_id=702672206
    try {
      getVerifier(request.queryString) match {
        case None => Ok//(views.html.RedirectMain("", "failure"))
        case Some(oauth_verifier) =>
          twitter.getOAuthAccessToken(requestToken, oauth_verifier)
          val twitteruser = twitter.verifyCredentials
          val name = twitteruser.getName()
          val userNetwokId = twitteruser.getId().toString
          /*UserModel.findUserByEmail(name) match {
                case None =>
                  val password = EncryptionUtility.generateRandomPassword
                  val user = UserModel(new ObjectId, name, password)
                  val userOpt = UserModel.createUser(user)
                  userOpt match {
                    case None => Redirect("/").flashing("error" -> Messages("error"))
                    case Some(userId) =>
                      val userSession = request.session + ("userId" -> user.id.toString)
                      Ok(views.html.RedirectMain(user.id.toString, "success")).withSession(userSession)
                  }
                case Some(alreadyExistingUser) =>
                  val userSession = request.session + ("userId" -> alreadyExistingUser.id.toString)
                  Ok(views.html.RedirectMain(alreadyExistingUser.id.toString, "success")).withSession(userSession)
              }*/
          Ok(views.html.redirectMain("success"))
      	}
    } catch {
      case ex: TwitterException => {
        Logger.error("Error During Login Through Twitter - " + ex)
        Ok(views.html.redirectMain("failure"))
      }
      case ex: Any => {
        Logger.error("Error During Login Through Twitter - " + ex)
        Ok(views.html.redirectMain("failure"))
      }
    }
  }

  def getVerifier(queryString: Map[String, Seq[String]]): Option[String] = {
    val seq = queryString.get("oauth_verifier").getOrElse(Seq())
    seq.isEmpty match {
      case true => None
      case false => seq.headOption
    }
  }
}
