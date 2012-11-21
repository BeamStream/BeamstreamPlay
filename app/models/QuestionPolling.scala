package models

import org.bson.types.ObjectId

import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.WriteConcern

object QuestionPolling {
  
/**
   * Vote The Option Of A Question's Poll
   */

  def voteTheOptionOfAQuestion(optionOfAQuestionId: ObjectId, userId: ObjectId) = {

    val optionOfAQuestion = OptionOfQuestionDAO.find(MongoDBObject("_id" -> optionOfAQuestionId)).toList(0)
    (optionOfAQuestion.assosiates.contains(userId)) match {
      case true =>
        optionOfAQuestion.assosiates.size
      case false =>
        //Rocking a message
        OptionOfQuestionDAO.update(MongoDBObject("_id" -> optionOfAQuestionId), optionOfAQuestion.copy(assosiates = (optionOfAQuestion.assosiates ++ List(userId))), false, false, new WriteConcern)
        val updatedOptionOfQuestion = OptionOfQuestionDAO.find(MongoDBObject("_id" -> optionOfAQuestionId)).toList(0)
        updatedOptionOfQuestion.assosiates.size
    }
  }
  
   /*
 * Find OptionOfQuestion by Id
 */

  def findOptionOfAQuestionById(optionId: ObjectId): Option[OptionOfQuestion] = {
    val question = OptionOfQuestionDAO.findOneByID(optionId)
    question
  }

  
}