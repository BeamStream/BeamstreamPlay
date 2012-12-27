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
import models.OptionOfQuestion
import models.OptionOfQuestionDAO
import models.QuestionPolling
import models.QuestionWithPoll

/**
 * This controller class is used to store and retrieve all the information about Question and Answers.
 *
 * @author Kishen
 */

object QuestionController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  /**
   * Asking A New Question
   */

  def newQuestion = Action { implicit request =>

    val questionJsonMap = request.body.asFormUrlEncoded.get
    val streamId = questionJsonMap("streamId").toList(0)
    val questionBody = questionJsonMap("questionBody").toList(0)
    val questionAccess = questionJsonMap("questionAccess").toList(0)

    val userId = new ObjectId(request.session.get("userId").get)
    val user = User.getUserProfile(userId)
    val questionToAsk = new Question(new ObjectId, questionBody, userId,
      QuestionAccess.withName(questionAccess), new ObjectId(streamId), user.firstName, user.lastName, new Date, List(), List(), List(), List())
    val questionId = Question.addQuestion(questionToAsk)

    /**
     * Add  Poll To Question
     */
    if (questionJsonMap.contains(("pollsOptions"))) {
      val pollsOptions = questionJsonMap("pollsOptions").toList(0)
      val pollsList = pollsOptions.split(",").toList
      for (pollsOption <- pollsList) {
        val optionOfPoll = new OptionOfQuestion(new ObjectId, pollsOption, List())
        val optionOfAPollId = OptionOfQuestionDAO.insert(optionOfPoll)
        Question.addPollToQuestion(optionOfAPollId.get, questionId)
      }
    }

    val questionObtained = Question.findQuestionById(questionId)
    var pollsOfquestionObtained: List[OptionOfQuestion] = List()
    if (questionObtained.get.pollOptions.isEmpty.equals(false)) {
      for (pollId <- questionObtained.get.pollOptions) {
        val pollObtained = QuestionPolling.findOptionOfAQuestionById(pollId)
        pollsOfquestionObtained ++= List(pollObtained.get)
      }
    }
    Ok(write(new QuestionWithPoll(questionObtained.get, pollsOfquestionObtained))).as("application/json")
  }

  /**
   * Get All Questions For A User
   */

  def getAllQuestionsForAUser = Action { implicit request =>
    val questionIdJsonMap = request.body.asFormUrlEncoded.get
    val allQuestionsForAUser = Question.getAllQuestionsForAUser(new ObjectId(request.session.get("userId").get))
    val allQuestionForAStreamJson = write(allQuestionsForAUser)
    Ok(write(allQuestionForAStreamJson)).as("application/json")
  }

  /**
   * Rock the Question
   */
  def rockTheQuestion = Action { implicit request =>
    val questionIdJsonMap = request.body.asFormUrlEncoded.get
    val id = questionIdJsonMap("questionId").toList(0)
    val totalRocks = Question.rockTheQuestion(new ObjectId(id), new ObjectId(request.session.get("userId").get))
    val totalRocksJson = write(totalRocks.toString)
    Ok(totalRocksJson).as("application/json")
  }

  /**
   * Rockers of a Question
   */
  def giveMeRockers = Action { implicit request =>
    val questionIdJsonMap = request.body.asFormUrlEncoded.get
    val id = questionIdJsonMap("questionId").toList(0)
    val rockers = Question.rockersNameOfAQuestion(new ObjectId(id))
    val rockersJson = write(rockers)
    Ok(rockersJson).as("application/json")
  }
  /**
   * Follow Question
   */

  def followQuestion = Action { implicit request =>
    val questionIdJsonMap = request.body.asFormUrlEncoded.get
    val questionId = questionIdJsonMap("questionId").toList(0)
    val followers = Question.followQuestion(new ObjectId(request.session.get("userId").get), new ObjectId(questionId))
    Ok(write(followers.toString)).as("application/json")
  }

  /**
   * Vote an option of a question (Polling)
   */
  def voteAnOptionOfAQuestion = Action { implicit request =>
    val optionOfAQuestionIdJsonMap = request.body.asFormUrlEncoded.get
    val optionOfAQuestionId = optionOfAQuestionIdJsonMap("optionOfAQuestionId").toList(0)
    val votes = QuestionPolling.voteTheOptionOfAQuestion(new ObjectId(optionOfAQuestionId), new ObjectId(request.session.get("userId").get))
    Ok(write(votes.toString)).as("application/json")
  }

  /**
   * Delete A Question
   */

  def deleteQuestion = Action { implicit request =>
    val questionIdJsonMap = request.body.asFormUrlEncoded.get
    val questionId = questionIdJsonMap("questionId").toList(0)
    val questionDeleted = Question.deleteQuestionPermanently(new ObjectId(questionId), new ObjectId(request.session.get("userId").get))
    if (questionDeleted == true) Ok(write(new ResulttoSent("Success", "Question Has Been Deleted")))
    else Ok(write(new ResulttoSent("Failure", "You're Not Authorised To Delete This Question")))
  }

  //==================================================//
  //======Displays all the question within a Stream===//
  //==================================================//
  def getAllQuestionForAStreamWithPagination = Action { implicit request =>
    val streamIdJsonMap = request.body.asFormUrlEncoded.get
    val streamId = streamIdJsonMap("streamId").toList(0)
    val pageNo = streamIdJsonMap("pageNo").toList(0).toInt
    val messagesPerPage = streamIdJsonMap("limit").toList(0).toInt
    val allQuestionsForAStream = Question.getAllQuestionForAStreamWithPagination(new ObjectId(streamId), pageNo, messagesPerPage)

    var questionsWithPolls: List[QuestionWithPoll] = List()
    var pollsOfquestionObtained: List[OptionOfQuestion] = List()

    for (question <- allQuestionsForAStream) {
      if (question.pollOptions.size != 0) {
        for (pollId <- question.pollOptions) {
          val pollObtained = QuestionPolling.findOptionOfAQuestionById(pollId)
          pollsOfquestionObtained ++= List(pollObtained.get)
        }
        questionsWithPolls ++= List(new QuestionWithPoll(question, pollsOfquestionObtained))
      } else {
        questionsWithPolls ++= List(new QuestionWithPoll(question, pollsOfquestionObtained))
      }
    }
    val allQuestionForAStreamJson = write(questionsWithPolls)
    Ok(allQuestionForAStreamJson).as("application/json")
  }

}

