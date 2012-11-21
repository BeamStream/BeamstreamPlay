package models
import java.io.InputStream
import org.bson.types.ObjectId
import com.novus.salat.annotations._


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


