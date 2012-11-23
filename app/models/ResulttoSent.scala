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

//case class DocResulttoSent(docId: ObjectId,
//  docUrl: String,
//  previewImageUrl: String,
//  docDescription: String,
//  var message: Option[Message] = None)

//Resultant Class Details
case class ClassWithNoOfUsers(usersMap: Map[String, Int],
  classToReturn: Class)

case class OptionOfQuestion(@Key("_id") id: ObjectId,
  name: String,
  assosiates: List[ObjectId])
  
  
  

object OptionOfQuestionDAO extends SalatDAO[OptionOfQuestion, ObjectId](collection = MongoHQConfig.mongoDB("optionofquestion"))






