package models

import org.bson.types.ObjectId

import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.WriteConcern

object QuestionPolling {

  /**
   * Vote The Option Of A Question's Poll
   */

  def voteTheOptionOfAQuestion(optionOfAQuestionId: ObjectId, userId: ObjectId): Int = {

    val optionOfAQuestion = OptionOfQuestionDAO.find(MongoDBObject("_id" -> optionOfAQuestionId)).toList(0)
    (optionOfAQuestion.voters.contains(userId)) match {
      case true =>
        optionOfAQuestion.voters.size
      case false =>
        //Rocking a message
        OptionOfQuestionDAO.update(MongoDBObject("_id" -> optionOfAQuestionId), optionOfAQuestion.copy(voters = (optionOfAQuestion.voters ++ List(userId))), false, false, new WriteConcern)
        val updatedOptionOfQuestion = OptionOfQuestionDAO.find(MongoDBObject("_id" -> optionOfAQuestionId)).toList(0)
        updatedOptionOfQuestion.voters.size
    }
  }: Int

  /*
 * Find OptionOfQuestion by Id
 */

  def findOptionOfAQuestionById(optionId: ObjectId): Option[OptionOfQuestion] = {
    val optionOfQuestion = OptionOfQuestionDAO.findOneById(optionId)
    optionOfQuestion
  }

}
