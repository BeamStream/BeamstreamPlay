package models
import java.io.InputStream
import com.novus.salat.dao.SalatDAO
import com.novus.salat.annotations._
import org.bson.types.ObjectId
import com.novus.salat.global._
import utils.MongoHQConfig

/*
 * JSON format for response 
 * @purpose :  Success or failure
 */
case class ResulttoSent(status: String,
  message: String)

//Resultant Class Details
case class ClassWithNoOfUsers(usersMap: Map[String, Int],
  classToReturn: Class)

case class OptionOfQuestion(@Key("_id") id: ObjectId,
  name: String,
  assosiates: List[ObjectId])

case class OnlineUsers(@Key("_id") id: ObjectId, firstName: String, lastName: String, profileImageUrl: String)

object OptionOfQuestionDAO extends SalatDAO[OptionOfQuestion, ObjectId](collection = MongoHQConfig.mongoDB("optionofquestion"))

// Question With Polls
case class QuestionWithPoll(question : Question , polls : List[OptionOfQuestion])




