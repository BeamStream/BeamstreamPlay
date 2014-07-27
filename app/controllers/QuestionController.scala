package controllers

import java.text.SimpleDateFormat
import java.util.Date
import org.bson.types.ObjectId
import models.OptionOfQuestion
import models.OptionOfQuestionDAO
import models.Question
import models.Access
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
import models.Type
import play.api.mvc.AnyContent
import play.api.libs.json.Json
import models.Stream

/**
 * This controller class is used to store and retrieve all the information about Question and Answers.
 *
 * @author Kishen
 */

object QuestionController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter: SimpleDateFormat = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  /**
   * Asking A New Question
   */

  def newQuestion: Action[AnyContent] = Action { implicit request =>
    val questionJsonMap = request.body.asJson.get
    val streamId = (questionJsonMap \ "streamId").as[String]
    val questionBody = (questionJsonMap \ "questionBody").as[String]
    val questionAccess = (questionJsonMap \ "questionAccess").as[String]
    val pollOptions = (questionJsonMap \ "pollOptions").asOpt[String]

    val userId = new ObjectId(request.session.get("userId").get)
    val user = User.getUserProfile(userId)

    val questionToAsk = new Question(new ObjectId, questionBody, userId,
      Access.withName(questionAccess), Type.Text, new ObjectId(streamId), user.get.firstName, user.get.lastName, new Date, Nil, Nil, Nil, Nil)
    val questionId = Question.addQuestion(questionToAsk)
    (pollOptions == None) match {
      case false =>
        val pollsList = pollOptions.get.split(",").toList
        for (pollsOption <- pollsList) {
          val optionOfPoll = new OptionOfQuestion(new ObjectId, pollsOption, Nil)
          val optionOfAPollId = OptionOfQuestionDAO.insert(optionOfPoll)
          Question.addPollToQuestion(optionOfAPollId.get, questionId.get)
        }
      case true =>
    }

    val questionObtained = Question.findQuestionById(questionId.get)
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

    Ok(write(QuestionWithPoll(questionObtained.get, false, false, false, Option(profilePicForUser), None, None, pollsOfquestionObtained))).as("application/json")
  }

  /**
   * Get All Questions For A User
   */

  def getAllQuestionsForAUser: Action[AnyContent] = Action { implicit request =>
    val allQuestionsForAUser = Question.getAllQuestionsForAUser(new ObjectId(request.session.get("userId").get))
    val allQuestionForAStreamJson = write(allQuestionsForAUser)
    Ok(write(allQuestionForAStreamJson)).as("application/json")
  }

  /**
   * Rock the Question
   */
  def rockTheQuestion(questionId: String): Action[AnyContent] = Action { implicit request =>
    val totalRocks = Question.rockTheQuestion(new ObjectId(questionId), new ObjectId(request.session.get("userId").get))
    val totalRocksJson = write(totalRocks.toString)
    Ok(totalRocksJson).as("application/json")
  }

  /**
   * Rockers of a Question
   */
  def giveMeRockers(questionId: String): Action[AnyContent] = Action { implicit request =>
    val rockers = Question.rockersNameOfAQuestion(new ObjectId(questionId))
    val rockersJson = write(rockers)
    Ok(rockersJson).as("application/json")
  }
  /**
   * Follow Question
   */

  def followQuestion(questionId: String): Action[AnyContent] = Action { implicit request =>
    val followers = Question.followQuestion(new ObjectId(request.session.get("userId").get), new ObjectId(questionId))
    Ok(write(followers.toString)).as("application/json")
  }

  /**
   * Vote an option of a question (Polling)
   */
  def voteAnOptionOfAQuestion(optionId: String): Action[AnyContent] = Action { implicit request =>
    val votes = QuestionPolling.voteTheOptionOfAQuestion(new ObjectId(optionId), new ObjectId(request.session.get("userId").get))
    val optionOfAQuestion = QuestionPolling.findOptionOfAQuestionById(new ObjectId(optionId))
    Ok(write(optionOfAQuestion)).as("application/json")
  }

  /**
   * Delete A Question
   */
  def deleteQuestion(questionId: String): Action[AnyContent] = Action { implicit request =>
    val userId = request.session.get("userId")
    userId match {
      case None => Ok(write(new ResulttoSent("Failure", "User not Found")))
      case Some(user) =>
        val questionDeleted = Question.deleteQuestionPermanently(new ObjectId(questionId), new ObjectId(user))
        questionDeleted match {
          case true => Ok(write(new ResulttoSent("Success", "Question has been Deleted")))
          case false => Ok(write(new ResulttoSent("Failure", "You're Not Authorised To Delete This Question")))
        }
    }
  }

  //==================================================//
  //======Displays all the question within a Stream===//
  //==================================================//

  /*def getAllQuestionForAStreamWithPagination: Action[AnyContent] = Action { implicit request =>
    val streamIdJsonMap = request.body.asFormUrlEncoded.get
    val streamId = streamIdJsonMap("streamId").toList(0)
    val pageNo = streamIdJsonMap("pageNo").toList(0).toInt
    val messagesPerPage = streamIdJsonMap("limit").toList(0).toInt
    val allQuestionsForAStream = Question.getAllQuestionForAStreamWithPagination(new ObjectId(streamId), pageNo, messagesPerPage)
    val userId = new ObjectId(request.session.get("userId").get)
    val allQuestionForAStreamJson = write(Question.returnQuestionsWithPolls(userId, allQuestionsForAStream))
    Ok(allQuestionForAStreamJson).as("application/json")
  }*/

  //==================================================================//
  //======Displays all the questions within a Stream sorted by rocks===//
  //================================================================//
  /*def getAllQuestionsForAStreamSortedbyRocks: Action[AnyContent] = Action { implicit request =>
    val streamIdJsonMap = request.body.asFormUrlEncoded.get
    val streamId = streamIdJsonMap("streamId").toList(0)
    val pageNo = streamIdJsonMap("pageNo").toList(0).toInt
    val questionsPerPage = streamIdJsonMap("limit").toList(0).toInt
    val getAllQuestionsForAStream = Question.getAllQuestionsForAStreamSortedbyRocks(new ObjectId(streamId), pageNo, questionsPerPage)
    val userId = new ObjectId(request.session.get("userId").get)
    val allQuestionsForAStreamJson = write(Question.returnQuestionsWithPolls(userId, getAllQuestionsForAStream))
    Ok(allQuestionsForAStreamJson).as("application/json")
  }*/

  //==================================================================//
  //======Displays all the questions within a Stream for a keyword===//
  //================================================================//
  /*def getAllQuestionsForAStreambyKeyword: Action[AnyContent] = Action { implicit request =>
    val keywordJsonMap = request.body.asFormUrlEncoded.get
    val keyword = keywordJsonMap("keyword").toList(0)
    val streamId = keywordJsonMap("streamId").toList(0)
    val pageNo = keywordJsonMap("pageNo").toList(0).toInt
    val messagesPerPage = keywordJsonMap("limit").toList(0).toInt
    val allQuestionsForAStream = Question.getAllQuestionsForAStreambyKeyword(keyword, new ObjectId(streamId), pageNo, messagesPerPage)
    val userId = new ObjectId(request.session.get("userId").get)
    val allQuestionsForAStreamJson = write(Question.returnQuestionsWithPolls(userId, allQuestionsForAStream))
    Ok(allQuestionsForAStreamJson).as("application/json")

  }*/

  /**
   * ***********************************************************REARCHITECTED CODE****************************************************************
   */

  private def questionWithOtherInformation(allQuestionsForAStream: List[Question], userId: ObjectId): List[QuestionWithPoll] = {
    allQuestionsForAStream map {
      case questionObtained =>

        val pollsOfquestionObtained = (questionObtained.pollOptions.isEmpty.equals(false)) match {
          case true =>
            (questionObtained.pollOptions) map {
              case pollId => QuestionPolling.findOptionOfAQuestionById(pollId).get
            }
          case false => Nil
        }

        val isRocked = Question.isARocker(questionObtained.id, userId)
        val isFollowed = Question.isAFollower(questionObtained.id, userId)
        val profilePicForUser = UserMedia.getProfilePicUrlString(questionObtained.userId)

        //val isFollowerOfQuestionPoster = User.isAFollower(questionObtained.userId, userId)
        /*val comments = (questionObtained.comments.isEmpty) match {   //H12 Heroku
          case false =>
            Comment.getAllComments(questionObtained.comments)
          case true => Nil
        }
        val answers = (questionObtained.answers.isEmpty) match {
          case false =>
            Comment.getAllComments(questionObtained.answers)
          case true => Nil
        }
*/
        QuestionWithPoll(questionObtained, isRocked, isFollowed, false, Option(profilePicForUser), Option(questionObtained.comments.length), Option(questionObtained.answers.length), pollsOfquestionObtained)

    }

  }

  /**
   * Get All Questions For A Stream
   */
  def getAllQuestionForAStream(streamId: String, sortBy: String, questionsPerPage: Int, pageNo: Int): Action[AnyContent] = Action { implicit request =>
    val userId = new ObjectId(request.session.get("userId").get)
    val allQuestionsForAStream = (sortBy == "date") match {
      case true => Question.getAllQuestionForAStreamWithPagination(new ObjectId(streamId), pageNo, questionsPerPage)
      case false => (sortBy == "rock") match {
        case true => Question.getAllQuestionsForAStreamSortedbyRocks(new ObjectId(streamId), pageNo, questionsPerPage)
        case false =>
          val answers = Comment.getAllCommentsForAKeyword(sortBy, new ObjectId(streamId))
          val answerIds = answers map {answer => answer.id}
          Question.getAllQuestionsForAStreambyKeyword(sortBy, new ObjectId(streamId), pageNo, questionsPerPage, answerIds)
      }
    }
    val questionsObtainedWithOtherInformation = questionWithOtherInformation(allQuestionsForAStream, userId)
    val allQuestionForAStreamJson = write(questionsObtainedWithOtherInformation)
    Ok(allQuestionForAStreamJson).as("application/json")
  }

  /**
   * Get All Answered Or UnAnswered Question For A Stream
   */
  def getAllAnswerdQuestionForAStream(streamId: String, messagesPerPage: Int, pageNo: Int, answerStatus: String): Action[AnyContent] = Action { implicit request =>
    val userId = new ObjectId(request.session.get("userId").get)
    val allAnsweredOrUnAnsweredQuestionsForAStream = Question.getAllAnsweredQuestionsForAStream(new ObjectId(streamId), messagesPerPage, pageNo, answerStatus)
    val questionsObtainedWithOtherInformation = questionWithOtherInformation(allAnsweredOrUnAnsweredQuestionsForAStream, userId)
    val allQuestionForAStreamJson = write(questionsObtainedWithOtherInformation)
    Ok(allQuestionForAStreamJson).as("application/json")
  }

  /**
   * All Answer of a Question
   */

  def answers(questionId: String): Action[AnyContent] = Action { implicit request =>
    val answers = Question.answers(new ObjectId(questionId))
    val answersOfThisQuestion = answers.map {
      case answer =>
        val answerObtained = Comment.findCommentById(answer)
        answerObtained.get
    }
    Ok(write(answersOfThisQuestion)).as("application/json")
  }

  def canDeleteTheAnswer(answerId: String, questionId: String): Action[AnyContent] = Action { implicit request =>
    val answerToBeremoved = Comment.findAnswerById(new ObjectId(answerId))
    val userId = request.session.get("userId").get
    val question = Question.findQuestionById(new ObjectId(questionId))
    question match {
      case Some(question) =>
        val stream = Stream.findStreamById(question.streamId)
        stream match {
          case Some(stream) =>
            (stream.creatorOfStream == userId) match {
              case true => Ok("true")
              case false =>
                (question.userId == userId) match {
                  case true => Ok("true")
                  case false =>
                    (answerToBeremoved.get.userId == userId) match {
                      case true => Ok("true")
                      case false => Ok("false")
                    }
                }
            }
          case None => Ok("false")
        }
      case None => Ok("false")
    }
  }

  /**
   * Delete an Answer
   */

  def deleteTheAnswer(answerId: String, questionId: String): Action[AnyContent] = Action { implicit request =>
    val answerToBeRemoved = Comment.findAnswerById(new ObjectId(answerId))
    answerToBeRemoved match {
      case Some(answer) =>
        Comment.removeComment(answer)
        Question.removeAnswerFromQuestion(new ObjectId(answerId), new ObjectId(questionId))
        Ok(write(new ResulttoSent("Success", "Answer Has Been Deleted")))
      case None => Ok(write(new ResulttoSent("Failure", "You're Not Authorised To Delete This Answer")))
    }
  }

  def noOfUnansweredQusetions(streamId: String): Action[AnyContent] = Action { implicit request =>
    val unansweredQuestions = Question.getNoOfUnansweredQuestions(new ObjectId(streamId))
    Ok(Json.obj("count" -> unansweredQuestions))
  }

  def markAQuestionAsAnswered(questionId: String): Action[AnyContent] = Action { implicit request =>
    val questionMarkedAsAnswered = Question.markAQuestionAsAnswered(new ObjectId(questionId))
    Ok(Json.obj("response" -> questionMarkedAsAnswered))
    /*questionMarkedAsAnswered match {
      case true => Ok(Json.obj("response" -> questionMarkedAsAnswered))
      case false => Ok("Failure")
    }*/
  }

}

