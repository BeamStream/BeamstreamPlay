package controllers

import java.text.SimpleDateFormat
import java.util.Date
import org.bson.types.ObjectId
import models.OptionOfQuestion
import models.OptionOfQuestionDAO
import models.Question
import models.QuestionAccess
import models.QuestionPolling
import models.QuestionWithPoll
import models.ResulttoSent
import models.User
import net.liftweb.json.Serialization.write
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.ObjectIdSerializer
import models.UserMedia
import models.Comment
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

    val questionJsonMap = request.body.asJson.get
    val streamId = (questionJsonMap \ "streamId").as[String]
    val questionBody = (questionJsonMap \ "questionBody").as[String]
    val questionAccess = (questionJsonMap \ "questionAccess").as[String]
    val pollOptions = (questionJsonMap \ "pollOptions").asOpt[String]

    val userId = new ObjectId(request.session.get("userId").get)
    val user = User.getUserProfile(userId)

    val questionToAsk = new Question(new ObjectId, questionBody, userId,
      QuestionAccess.withName(questionAccess), new ObjectId(streamId), user.get.firstName, user.get.lastName, new Date, List(), List(), List(), List())
    val questionId = Question.addQuestion(questionToAsk)
    (pollOptions == None) match {
      case false =>
        val pollsList = pollOptions.get.split(",").toList
        for (pollsOption <- pollsList) {
          val optionOfPoll = new OptionOfQuestion(new ObjectId, pollsOption, List())
          val optionOfAPollId = OptionOfQuestionDAO.insert(optionOfPoll)
          Question.addPollToQuestion(optionOfAPollId.get, questionId)
        }
      case true =>
    }

    val questionObtained = Question.findQuestionById(questionId)
    val pollsOfquestionObtained = (questionObtained.get.pollOptions.isEmpty.equals(false)) match {
      case true =>
        (questionObtained.get.pollOptions) map {
          case pollId => QuestionPolling.findOptionOfAQuestionById(pollId).get
        }
      case false => Nil
    }

    val userMedia = UserMedia.getProfilePicForAUser(questionObtained.get.userId)
    val profilePicForUser = (!userMedia.isEmpty) match {
      case true => (userMedia.head.frameURL != "") match {
        case true => userMedia.head.frameURL
        case false => userMedia.head.mediaUrl
      }

      case false => ""
    }

    Ok(write(QuestionWithPoll(questionObtained.get, Option(profilePicForUser), None, pollsOfquestionObtained))).as("application/json")
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
  def rockTheQuestion(questionId: String) = Action { implicit request =>
    val totalRocks = Question.rockTheQuestion(new ObjectId(questionId), new ObjectId(request.session.get("userId").get))
    val totalRocksJson = write(totalRocks.toString)
    Ok(totalRocksJson).as("application/json")
  }

  /**
   * Rockers of a Question
   */
  def giveMeRockers(questionId: String) = Action { implicit request =>
    val rockers = Question.rockersNameOfAQuestion(new ObjectId(questionId))
    val rockersJson = write(rockers)
    Ok(rockersJson).as("application/json")
  }
  /**
   * Follow Question
   */

  def followQuestion(questionId: String) = Action { implicit request =>
    val followers = Question.followQuestion(new ObjectId(request.session.get("userId").get), new ObjectId(questionId))
    Ok(write(followers.toString)).as("application/json")
  }

  /**
   * Vote an option of a question (Polling)
   */
  def voteAnOptionOfAQuestion(optionId: String) = Action { implicit request =>
    val votes = QuestionPolling.voteTheOptionOfAQuestion(new ObjectId(optionId), new ObjectId(request.session.get("userId").get))
    val optionOfAQuestion = QuestionPolling.findOptionOfAQuestionById(new ObjectId(optionId))
    Ok(write(optionOfAQuestion)).as("application/json")
  }

  /**
   * Delete A Question
   */
  def deleteQuestion(questionId: String) = Action { implicit request =>
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
    val allQuestionForAStreamJson = write(Question.returnQuestionsWithPolls(allQuestionsForAStream))
    Ok(allQuestionForAStreamJson).as("application/json")
  }

  //==================================================================//
  //======Displays all the questions within a Stream sorted by rocks===//
  //================================================================//
  def getAllQuestionsForAStreamSortedbyRocks = Action { implicit request =>
    val streamIdJsonMap = request.body.asFormUrlEncoded.get
    val streamId = streamIdJsonMap("streamId").toList(0)
    val pageNo = streamIdJsonMap("pageNo").toList(0).toInt
    val questionsPerPage = streamIdJsonMap("limit").toList(0).toInt
    val getAllQuestionsForAStream = Question.getAllQuestionsForAStreamSortedbyRocks(new ObjectId(streamId), pageNo, questionsPerPage)
    val allQuestionsForAStreamJson = write(Question.returnQuestionsWithPolls(getAllQuestionsForAStream))
    Ok(allQuestionsForAStreamJson).as("application/json")
  }

  //==================================================================//
  //======Displays all the questions within a Stream for a keyword===//
  //================================================================//
  def getAllQuestionsForAStreambyKeyword = Action { implicit request =>
    val keywordJsonMap = request.body.asFormUrlEncoded.get
    val keyword = keywordJsonMap("keyword").toList(0)
    val streamId = keywordJsonMap("streamId").toList(0)
    val pageNo = keywordJsonMap("pageNo").toList(0).toInt
    val messagesPerPage = keywordJsonMap("limit").toList(0).toInt
    val allQuestionsForAStream = Question.getAllQuestionsForAStreambyKeyword(keyword, new ObjectId(streamId), pageNo, messagesPerPage)
    val allQuestionsForAStreamJson = write(Question.returnQuestionsWithPolls(allQuestionsForAStream))
    Ok(allQuestionsForAStreamJson).as("application/json")

  }

  /*
 * ***********************************************************REARCHITECTED CODE****************************************************************
 * ***********************************************************REARCHITECTED CODE****************************************************************
 */
  def getAllQuestionForAStream(streamId: String, sortBy: String, messagesPerPage: Int, pageNo: Int) = Action { implicit request =>

    val allQuestionsForAStream = (sortBy == "date") match {
      case true => Question.getAllQuestionForAStreamWithPagination(new ObjectId(streamId), pageNo, messagesPerPage)
      case false => (sortBy == "rock") match {
        case true => Question.getAllQuestionsForAStreamSortedbyRocks(new ObjectId(streamId), pageNo, messagesPerPage)
        case false => Nil
      }
    }

    val questionWithOtherInformation = allQuestionsForAStream map {
      case questionObtained =>

        val pollsOfquestionObtained = (questionObtained.pollOptions.isEmpty.equals(false)) match {
          case true =>
            (questionObtained.pollOptions) map {
              case pollId => QuestionPolling.findOptionOfAQuestionById(pollId).get
            }
          case false => Nil
        }

        val userMedia = UserMedia.getProfilePicForAUser(questionObtained.userId)
        val profilePicForUser = (!userMedia.isEmpty) match {
          case true => (userMedia.head.frameURL != "") match {
            case true => userMedia.head.frameURL
            case false => userMedia.head.mediaUrl
          }
          case false => ""
        }
        val comments = (questionObtained.comments.isEmpty) match {
          case false =>
            Comment.getAllComments(questionObtained.comments)
          case true => Nil
        }

        QuestionWithPoll(questionObtained, Option(profilePicForUser), Option(comments), pollsOfquestionObtained)

    }

    val allQuestionForAStreamJson = write(questionWithOtherInformation)
    Ok(allQuestionForAStreamJson).as("application/json")
  }

}

