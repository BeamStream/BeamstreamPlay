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

/**
 * This class is used to store and retrieve all the information about Question and Answers.
 * 
 * @author Kishen 
 */

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
  val Private = Value(0, "Private")
  val Public = Value(1, "Public")
  val Restricted = Value(2, "Restricted")
  val Stream = Value(3,"Stream")

}

case class Question(@Key("_id") id: ObjectId, 
                                name: String, 
                                userId: ObjectId, 
                                access: QuestionAccess.Value, 
                                streamId: ObjectId,
                                creationDate: Date, 
                                lastUpdateDate: Date, 
                                rocks: Int, 
                                rockers: List[ObjectId], 
                                answers : List[ObjectId])

case class QuestionForm(name: String)
object Question {

  implicit val formats = DefaultFormats

  def allQuestions(): List[Question] = Nil

/*
 * Add a Question
 */
  def addQuestion(question : Question) : ObjectId = {
      val questionId = QuestionDAO.insert(question)
      questionId.get
   }

  /*
   * Remove Question
   */
  def removeQuestion(question : Question) {
    QuestionDAO.remove(question)

  }

 /*
  * Names of a rockers for a Question
  */
  def rockersNames(questionId: ObjectId): List[String] = {
    val questionRocked = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    val rockersName = User.giveMeTheRockers(questionRocked.rockers)
    rockersName
  }
    
  /*
   * Find Question by name
   */

  def findQuestionByName(name: String): List[Question] = {
    val regexp = (""".*""" + name + """.*""").r
    for (question <- QuestionDAO.find(MongoDBObject("name" -> regexp)).toList) yield question
  }

  /*
   * Get all Questions for a user
   */
  def getAllQuestionsForAUser(userId: ObjectId): List[Question] = {

    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    getAllQuestions(user.questions)
  }

  /*
   * Get all Questions List
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
   *  Update the Rockers List and increase the count by one 
   */

  def rockedIt(questionId: ObjectId, userId: ObjectId): Int = {
  
    
    val questionToRock = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    
    questionToRock.rockers.contains(userId) match { 
    
           // If the question is already rocked by the user, return the current rock count without updating
	    case true => 
		    questionToRock.rocks

            // Otherwise, update the rocker and count
	    case false =>        

	    QuestionDAO.update(MongoDBObject("_id" -> questionId), questionToRock.copy(rockers = (questionToRock.rockers ++ List(userId))), false, false, new WriteConcern)

	    val updatedQuestion = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
	    QuestionDAO.update(MongoDBObject("_id" -> questionId), updatedQuestion.copy(rocks = (updatedQuestion.rocks + 1)), false, false, new WriteConcern)

	    val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
	    question.rocks
    
          }

  }
  
  /*
   * Change the access of a Question
   */
   def changeAccess(questionId: ObjectId, newAccess: QuestionAccess.Value) = {
    val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    QuestionDAO.update(MongoDBObject("_id" -> questionId), question.copy(access = newAccess), false, false, new WriteConcern)
  }

  /*
   * Total number of rocks for a particular Question
   */
   def totalRocks(questionId: ObjectId): Int = {
    val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
    question.rocks
  }
   
   def findQuestionById(questionId: ObjectId): Question = {
    val question = QuestionDAO.findOneByID(questionId)
    question.get
  }
  
    /*
   * add Comment to message
   */
    def addAnswerToQuestion(questionId: ObjectId, answerId : ObjectId) {
      val question = QuestionDAO.find(MongoDBObject("_id" -> questionId)).toList(0)
      QuestionDAO.update(MongoDBObject("_id" -> questionId), question.copy(answers = (question.answers ++ List(answerId))), false, false, new WriteConcern)
  }
   
}

object QuestionDAO extends SalatDAO[Question, ObjectId](collection = MongoHQConfig.mongoDB("question"))