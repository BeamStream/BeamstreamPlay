package models

import com.mongodb.casbah.Imports._
import utils.MongoHQConfig
import java.util.Date
import java.util.regex.Pattern
import models.mongoContext._
import scala.language.postfixOps
import com.novus.salat.annotations.raw.Key
import com.novus.salat.dao.SalatDAO

/**
 * Enumeration for the Question access
 *
 * Private - Only available for the owner
 * Public - Available to all
 * Restricted - Available to a restricted list of users
 * Stream - Available to all the Sub-streams and current members of this stream
 */

case class Question(@Key("_id") id: ObjectId,
  questionBody: String,
  userId: ObjectId,
  questionAccess: Access.Value,
  questionType: Type.Value,
  streamId: ObjectId,
  firstNameofQuestionAsker: String,
  lastNameofQuestionAsker: String,
  creationDate: Date,
  rockers: List[ObjectId],
  comments: List[ObjectId],
  answers: List[ObjectId],
  followers: List[ObjectId],
  pollOptions: List[ObjectId] = Nil,
  answered: Boolean = false,
  anyPreviewImageUrl: Option[String] = None,
  docIdIfAny: Option[ObjectId] = None)

object Question {

  /**
   * Add a Question (Modified)
   */
  def addQuestion(question: Question): Option[ObjectId] = {
    QuestionDAO.insert(question)
  }

  /**
   * Remove Question (Modified)
   */
  def removeQuestion(question: Question) {
    QuestionDAO.remove(question)
  }

  /**
   * Find Question by Id
   */

  def findQuestionById(questionId: ObjectId): Option[Question] = {
    QuestionDAO.findOneById(questionId)
  }

  /**
   * Rock The Question
   */
  def rockTheQuestion(questionId: ObjectId, userId: ObjectId): Int = {

    val questionToRock = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    questionToRock.rockers.contains(userId) match {
      case true =>
        QuestionDAO.update(MongoDBObject("_id" -> questionId), questionToRock.copy(rockers = (questionToRock.rockers filterNot (List(userId) contains))), false, false, new WriteConcern)
        val updatedQuestion = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
        updatedQuestion.rockers.size
      case false =>
        QuestionDAO.update(MongoDBObject("_id" -> questionId), questionToRock.copy(rockers = (questionToRock.rockers ++ List(userId))), false, false, new WriteConcern)
        val updatedQuestion = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
        updatedQuestion.rockers.size
    }
  }

  /**
   * Names of a rockers for a Question (Modified)
   */
  def rockersNameOfAQuestion(questionId: ObjectId): List[String] = {
    val questionRocked = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    User.giveMeTheRockers(questionRocked.rockers)
  }

  /**
   * Get all Questions List  (Modified)
   */

  def getAllQuestions(questionsIdList: List[ObjectId]): List[Question] = {
    questionsIdList map {
      case questionId => QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    }

  }

  /**
   * Change the access of a Question
   */
  def changeAccess(questionId: ObjectId, newAccess: Access.Value): WriteResult = {
    val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    QuestionDAO.update(MongoDBObject("_id" -> questionId), question.copy(questionAccess = newAccess), false, false, new WriteConcern)
  }

  /**
   * Total number of rocks for a particular Question
   */

  def totalRocks(questionId: ObjectId): Int = {
    val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    question.rockers.size
  }

  /**
   *     add Comment to message
   */
  def addAnswerToQuestion(questionId: ObjectId, answerId: ObjectId) {
    val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    QuestionDAO.update(MongoDBObject("_id" -> questionId), question.copy(answers = (question.answers ++ List(answerId)) /*, answered = true*/ ), false, false, new WriteConcern)
  }

  /**
   * Pagination For Questions
   */

  def getAllQuestionForAStreamWithPagination(streamId: ObjectId, pageNumber: Int, questionPerPage: Int): List[Question] = {
    QuestionDAO.find(MongoDBObject("streamId" -> streamId)).sort(orderBy = MongoDBObject("creationDate" -> -1)).skip((pageNumber - 1) * questionPerPage).limit(questionPerPage).toList
  }

  /**
   * Sort Question within a stream on the basis of total rocks (#403)
   */

  def getAllQuestionsForAStreamSortedbyRocks(streamId: ObjectId, pageNumber: Int, messagesPerPage: Int): List[Question] = {
    QuestionDAO.find(MongoDBObject("streamId" -> streamId)).sort(orderBy = MongoDBObject("rockers" -> -1, "timeCreated" -> -1)).skip((pageNumber - 1) * messagesPerPage).limit(messagesPerPage).toList
  }

  /**
   *   Get All Answered & UnAnswered Question For A Stream
   */
  def getAllAnsweredQuestionsForAStream(streamId: ObjectId, pageNumber: Int, messagesPerPage: Int, answerStatus: String): List[Question] = {
    (answerStatus == "answered") match {
      case true =>
        QuestionDAO.find(MongoDBObject("streamId" -> streamId, "answered" -> true)).sort(orderBy = MongoDBObject("timeCreated" -> -1)).skip((pageNumber - 1) * messagesPerPage).limit(messagesPerPage).toList
      case false =>
        QuestionDAO.find(MongoDBObject("streamId" -> streamId, "answered" -> false)).sort(orderBy = MongoDBObject("timeCreated" -> -1)).skip((pageNumber - 1) * messagesPerPage).limit(messagesPerPage).toList
    }
  }

  /**
   * FInd All Private To Class Questions For A User
   */

  def getAllPrivateToAClassQuestionForAUser(userId: ObjectId): List[Question] = {
    QuestionDAO.find(MongoDBObject("userId" -> userId, "questionAccess" -> "PrivateToClass")).toList
  }

  /**
   * FInd All Private To School Questions For A User
   */

  def getAllPrivateToASchoolQuestionForAUser(userId: ObjectId): List[Question] = {
    QuestionDAO.find(MongoDBObject("userId" -> userId, "questionAccess" -> "PrivateToSchool")).toList
  }

  /**
   * Delete A Question (Either Stream Admin Or The User Who Has Posted The Question)
   */

  def deleteQuestionPermanently(questionId: ObjectId, userId: ObjectId): Boolean = {
    val question = Question.findQuestionById(questionId) //.get
    question match {
      case None => false
      case Some(questionToRemove) =>
        val commentsOfQuestionToBeRemoved = questionToRemove.comments
        val streamObtained = Stream.findStreamById(questionToRemove.streamId)

        val deletedQuestionSuccessfully = (questionToRemove.userId == userId || streamObtained.get.creatorOfStream == userId) match {
          case true =>
            QuestionDAO.remove(questionToRemove)
            commentsOfQuestionToBeRemoved map {
              case commentId =>
                val commentToBeremoved = Comment.findCommentById(commentId)
                if (commentToBeremoved != None) Comment.removeComment(commentToBeremoved.get)
            }
            true
          case false => false
        }
        deletedQuestionSuccessfully
    }
  }

  /**
   * Get All Questions For A User
   */
  def getAllQuestionsForAUser(userId: ObjectId): List[Question] = {
    QuestionDAO.find(MongoDBObject("userId" -> userId)).toList
  }

  /**
   * Follow Question
   */

  def followQuestion(userIdOfFollower: ObjectId, questionId: ObjectId): Int = {
    val questionToFollow = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    (questionToFollow.followers.contains(userIdOfFollower)) match {
      case true =>
        QuestionDAO.update(MongoDBObject("_id" -> questionId), questionToFollow.copy(followers = (questionToFollow.followers filterNot (List(userIdOfFollower) contains))), false, false, new WriteConcern)
        val updatedQuestionWithAddedIdOfFollower = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
        updatedQuestionWithAddedIdOfFollower.followers.size
      case false =>
        QuestionDAO.update(MongoDBObject("_id" -> questionId), questionToFollow.copy(followers = (questionToFollow.followers ++ List(userIdOfFollower))), false, false, new WriteConcern)
        val updatedQuestionWithAddedIdOfFollower = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
        updatedQuestionWithAddedIdOfFollower.followers.size
    }
  }

  /**
   * add Comment to Question
   */
  def addCommentToQuestion(commentId: ObjectId, questionId: ObjectId): WriteResult = {
    val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    QuestionDAO.update(MongoDBObject("_id" -> questionId), question.copy(comments = (question.comments ++ List(commentId))), false, false, new WriteConcern)
  }

  /**
   * Remove Comment from Question
   */
  def removeCommentFromQuestion(commentId: ObjectId, questionId: ObjectId): WriteResult = {
    val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    QuestionDAO.update(MongoDBObject("_id" -> questionId), question.copy(comments = (question.comments filterNot (List(commentId)contains))), false, false, new WriteConcern)
  }
  /**
   * Remove Answer from Question
   */
  def removeAnswerFromQuestion(answerId: ObjectId, questionId: ObjectId): WriteResult = {
    val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    QuestionDAO.update(MongoDBObject("_id" -> questionId), question.copy(answers = (question.answers filterNot (List(answerId)contains))), false, false, new WriteConcern)
  }

  /**
   *  add Poll to Question
   */
  def addPollToQuestion(pollId: ObjectId, questionId: ObjectId): WriteResult = {
    val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    QuestionDAO.update(MongoDBObject("_id" -> questionId), question.copy(pollOptions = question.pollOptions ++ List(pollId)), false, false, new WriteConcern)
  }

  /**
   * get all questions within a stream on the basis of keyword
   */
  def getAllQuestionsForAStreambyKeyword(keyword: String, streamId: ObjectId, pageNumber: Int, questionsPerPage: Int, answerIds: List[ObjectId]): List[Question] = {
    //    val keyWordregExp = (""".*""" + keyword + """.*""").r
    val keyWordregExp = Pattern.compile(keyword, Pattern.CASE_INSENSITIVE)
    val keywordQuestions = QuestionDAO.find(MongoDBObject("questionBody" -> keyWordregExp, "streamId" -> streamId)).skip((pageNumber - 1) * questionsPerPage).limit(questionsPerPage).toList
    val answerQuestions = answerIds map {
      answerId =>
        QuestionDAO.find(MongoDBObject("answers" -> answerId, "streamId" -> streamId))
          .skip((pageNumber - 1) * questionsPerPage)
          .limit(questionsPerPage)
          .toList
    }
    if (answerQuestions.length >= 1) {
      (answerQuestions(0) ++ keywordQuestions).distinct
    } else {
      keywordQuestions
    }
  }

  /**
   * ****************************************Rearchitecture*****************************************************
   */

  /**
   * Takes a List of Questions and Return Question with respective polls
   */

  def returnQuestionsWithPolls(userId: ObjectId, allQuestionsForAStream: List[Question]): List[QuestionWithPoll] = {

    allQuestionsForAStream map {
      case question =>
        val userMedia = UserMedia.getProfilePicForAUser(question.userId)
        val profilePicForUser = (!userMedia.isEmpty) match {
          case true => (userMedia.head.frameURL != "") match {
            case true => userMedia.head.frameURL
            case false => userMedia.head.mediaUrl
          }
          case false => ""
        }

        val comments = Comment.getAllComments(question.comments)
        val answers = Comment.getAllComments(question.answers)

        val pollsOfquestionObtained = (question.pollOptions.size.equals(0) == false) match {
          case true =>
            question.pollOptions map {
              case pollId =>
                val pollObtained = QuestionPolling.findOptionOfAQuestionById(pollId)
                pollObtained.get
            }
          case false => Nil
        }

        val isRocked = Question.isARocker(question.id, userId)
        val isFollowed = Question.isAFollower(question.id, userId)
        val isFollowerOfQuestionPoster = User.isAFollower(question.userId, userId)

        QuestionWithPoll(question, isRocked, isFollowed, isFollowerOfQuestionPoster, Option(profilePicForUser), Option(question.comments.length), Option(question.answers.length), pollsOfquestionObtained)
    }

  }

  /**
   * Is a follower
   * Purpose: identify if the user is following a question or not
   * @param  questionId is the id of the question to be searched
   * @param  userId is the id of follower
   */

  def isAFollower(questionId: ObjectId, userId: Object): Boolean = {
    val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)

    question.followers.contains(userId)

  }

  /**
   * Is a Rocker
   * Purpose: identify if the user has rocked a message or not
   * @param  questionId is the id of the question to be searched
   * @param  userId is the id of follower
   */

  def isARocker(questionId: ObjectId, userId: Object): Boolean = {
    val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)

    question.rockers.contains(userId)

  }

  /**
   * Get Answer of a question
   */

  def answers(questionId: ObjectId): List[ObjectId] = {
    val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList
    question.isEmpty match {
      case true => Nil
      case false => question.head.answers
    }
  }

  /**
   * Delete a answer
   */

  /* def deleteAnswerPermanently(answerId: ObjectId, questionId: ObjectId, userId: ObjectId): Boolean = {
    val answerToBeRemoved = Comment.findAnswerById(answerId)
    answerToBeRemoved match {
      case Some(answer) =>
        Comment.removeComment(answer)
        true
      case None => false
    }
  }*/

  def getNoOfUnansweredQuestions(streamId: ObjectId): Int = {
    val unansweredQuestions = QuestionDAO.find(MongoDBObject("streamId" -> streamId, "answered" -> false)).toList
    unansweredQuestions.length
  }

  def markAQuestionAsAnswered(questionId: ObjectId): Boolean = {
    val questionToBeMarkedAsanswered = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    (questionToBeMarkedAsanswered.answers.size > 0) match {
      case true =>
        QuestionDAO.update(MongoDBObject("_id" -> questionId), questionToBeMarkedAsanswered.copy(answered = true), false, false, new WriteConcern)
        true
      case false => false
    }
  }
}

object QuestionDAO extends SalatDAO[Question, ObjectId](collection = MongoHQConfig.mongoDB("question"))
