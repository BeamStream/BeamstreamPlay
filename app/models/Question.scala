package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import org.joda.time.DateTime
import org.bson.types.ObjectId
import utils.MongoHQConfig
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import java.util.Date
import java.net.URL

/*
 * Enumeration for the Question access 
 * 
 * Private - Only available for the owner
 * Public - Available to all
 * Restricted - Available to a restricted list of users
 * Stream - Available to all the Sub-streams and current members of this stream
 */
object QuestionAccess extends Enumeration {
  type QuestionAccess = Value
  val Public = Value(0, "Public")
  val PrivateToClass = Value(1, "PrivateToClass")
  val PrivateToSchool = Value(2, "PrivateToSchool")
  //  val Restricted = Value(2, "Restricted")
  //  val Stream = Value(3, "Stream")

}

case class Question(@Key("_id") id: ObjectId,
  questionBody: String,
  userId: ObjectId,
  questionAccess: QuestionAccess.Value,
  streamId: ObjectId,
  firstNameofQuestionAsker: String,
  lastNameofQuestionAsker: String,
  creationDate: Date,
  rocks: Int,
  rockers: List[ObjectId],
  answers: List[ObjectId],
  follows: Int,
  followers: List[ObjectId])

object Question {

  /*
 * Add a Question (Modified)
 */
  def addQuestion(question: Question): ObjectId = {
    val questionId = QuestionDAO.insert(question)
    questionId.get
  }

  /*
   * Remove Question (Modified)
   */
  def removeQuestion(question: Question) {
    QuestionDAO.remove(question)
  }

  /*
 * Find Question by Id
 */

  def findQuestionById(questionId: ObjectId): Option[Question] = {
    val question = QuestionDAO.findOneByID(questionId)
    question
  }

  /*
 * Rock The Question
 */
  def rockTheQuestion(questionId: ObjectId, userId: ObjectId): Int = {

    val questionToRock = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    questionToRock.rockers.contains(userId) match {
      case true =>
        QuestionDAO.update(MongoDBObject("_id" -> questionId), questionToRock.copy(rockers = (questionToRock.rockers -- List(userId))), false, false, new WriteConcern)
        val updatedQuestion = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
        QuestionDAO.update(MongoDBObject("_id" -> questionId), updatedQuestion.copy(rocks = (updatedQuestion.rocks - 1)), false, false, new WriteConcern)
        val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
        question.rocks
      case false =>
        QuestionDAO.update(MongoDBObject("_id" -> questionId), questionToRock.copy(rockers = (questionToRock.rockers ++ List(userId))), false, false, new WriteConcern)
        val updatedQuestion = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
        QuestionDAO.update(MongoDBObject("_id" -> questionId), updatedQuestion.copy(rocks = (updatedQuestion.rocks + 1)), false, false, new WriteConcern)
        val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
        question.rocks
    }
  }

  /*
  * Names of a rockers for a Question (Modified)
  */
  def rockersNameOfAQuestion(questionId: ObjectId): List[String] = {
    val questionRocked = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    val rockersOfAQuestion = User.giveMeTheRockers(questionRocked.rockers)
    rockersOfAQuestion
  }

  /*
   * Get all Questions List  (Modified)
   */

  def getAllQuestions(questionsIdList: List[ObjectId]): List[Question] = {
    var questionsList: List[Question] = List()
    for (questionId <- questionsIdList) {
      val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList
      questionsList ++= question
    }
    questionsList
  }

  /*
    * Change the access of a Question
    */
  def changeAccess(questionId: ObjectId, newAccess: QuestionAccess.Value) = {
    val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    QuestionDAO.update(MongoDBObject("_id" -> questionId), question.copy(questionAccess = newAccess), false, false, new WriteConcern)
  }

  /*
    * Total number of rocks for a particular Question
    */

  def totalRocks(questionId: ObjectId): Int = {
    val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    question.rocks
  }

  /*
     *     add Comment to message
     */
  def addAnswerToQuestion(questionId: ObjectId, answerId: ObjectId) {
    val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    QuestionDAO.update(MongoDBObject("_id" -> questionId), question.copy(answers = (question.answers ++ List(answerId))), false, false, new WriteConcern)
  }

  /*
   * Sort Question within a stream on the basis of total rocks (#403)
   */

  def getAllQuestionsForAStreamSortedbyRocks(streamId: ObjectId, pageNumber: Int, messagesPerPage: Int) = {
    QuestionDAO.find(MongoDBObject("streamId" -> streamId)).sort(orderBy = MongoDBObject("rocks" -> -1, "timeCreated" -> -1)).skip((pageNumber - 1) * messagesPerPage).limit(messagesPerPage).toList
  }

  /*
   * FInd All Private To Class Questions For A User
   */

  def getAllPrivateToAClassQuestionForAUser(userId: ObjectId) = {
    QuestionDAO.find(MongoDBObject("userId" -> userId, "questionAccess" -> "PrivateToClass")).toList
  }

  /*
   * FInd All Private To School Questions For A User
   */

  def getAllPrivateToASchoolQuestionForAUser(userId: ObjectId) = {
    QuestionDAO.find(MongoDBObject("userId" -> userId, "questionAccess" -> "PrivateToSchool")).toList
  }
}

object QuestionDAO extends SalatDAO[Question, ObjectId](collection = MongoHQConfig.mongoDB("question"))
 

    
   
 
    
   
   
   

