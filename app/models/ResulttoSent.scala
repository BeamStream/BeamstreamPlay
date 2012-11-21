package models
import java.io.InputStream
import com.novus.salat.global._
import org.bson.types.ObjectId
import com.novus.salat.annotations._
import com.novus.salat.dao.SalatDAO
import utils.MongoHQConfig


/*
 * JSON format for response 
 * @purpose :  Success or failure
 */
case class ResulttoSent(status: String,
  message: String)
  
  case class DocResulttoSent(docId: String,
  docUrl: String, previewImageUrl:String)

//Resultant Class Details
case class ClassWithNoOfUsers(usersMap:Map[String, Int] , classToReturn:Class)  

case class OptionOfQuestion(@Key("_id") id: ObjectId, name:String , assosiates:List[ObjectId])
object OptionOfQuestionDAO extends SalatDAO[Comment, ObjectId](collection = MongoHQConfig.mongoDB("optionofquestion"))

