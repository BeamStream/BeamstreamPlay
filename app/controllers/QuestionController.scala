package controllers
import play.api.mvc.Controller
import play.api._
import play.api.mvc._
import play.api.mvc.Response
import models.Stream
import play.api.data._
import play.api.data.Forms._
import play.api.Play.current
import models.User
import org.bson.types.ObjectId
import play.api.cache.Cache
import models.Media
import models.UserType
import java.io.File
import java.util.Date
import models.QuestionAccess
import models.Message
import models.User
import models.Question
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import java.text.SimpleDateFormat
import utils.EnumerationSerializer
import utils.ObjectIdSerializer
import java.net.URL
import models.ResulttoSent
import play.api.libs.json._

/**
 * This controller class is used to store and retrieve all the information about Question and Answers.
 *
 * @author Kishen
 */

object QuestionController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  /*
 * 
 * Asking A New Question
 */

  def newQuestion = Action { implicit request =>

    val questionJsonMap = request.body.asFormUrlEncoded.get
    val question = questionJsonMap("data").toList(0)
    val questionJson = net.liftweb.json.parse(question)
    val questionBody = (questionJson \ "question").extract[String]
    val streamId = new ObjectId((questionJson \ "streamId").extract[String])
    val questionAccess = (questionJson \ "access").extract[String]
    val userId = new ObjectId(request.session.get("userId").get)
    val user = User.getUserProfile(userId)
    val date = new Date
    val questionToAsk = new Question(new ObjectId, questionBody, userId,
      QuestionAccess.withName(questionAccess), streamId, user.firstName, user.lastName, date, 0, List(), List(), 0, List())
    val questionId = Question.addQuestion(questionToAsk)
    val questionObtained = Question.findQuestionById(questionId)
    Ok(write(List(questionObtained))).as("application/json")

  }

  /**
  def questions = Action { implicit request =>
    val profileName = User.getUserProfile((new ObjectId(request.session.get("userId").get)))
    val questions = Question.getAllQuestionsForAUser(new ObjectId(request.session.get("userId").get))
    Ok
  }

  def getAllQuestionsForAUser = Action { implicit request =>
    val questionIdJsonMap = request.body.asFormUrlEncoded.get
    println(" userId : " + request.session.get("userId").get)
    val allQuestionsForAUser = Question.getAllQuestionsForAUser(new ObjectId(request.session.get("userId").get))
    val allQuestionForAStreamJson = write(allQuestionsForAUser)
    println(" Questions for the user :" + allQuestionsForAUser);
    Ok(allQuestionForAStreamJson).as("application/json")
  }


  
  /*
   * Rock the document
   */
  def rockTheQuestion = Action { implicit request =>
    val questionIdJsonMap = request.body.asFormUrlEncoded.get
    val id = questionIdJsonMap("documentId").toList(0)
    val totalRocks = Question.rockedIt(new ObjectId(id), new ObjectId(request.session.get("userId").get))
    val totalRocksJson = write(totalRocks.toString)
    Ok(totalRocksJson).as("application/json")
  }

  /*
    * Rockers of a document
    */
  def giveMeRockers = Action { implicit request =>
    val questionIdJsonMap = request.body.asFormUrlEncoded.get
    val id = questionIdJsonMap("questionId").toList(0)
    val rockers = Question.rockersNames(new ObjectId(id))
    val rockersJson = write(rockers)
    Ok(rockersJson).as("application/json")
  }
*/
  
}

