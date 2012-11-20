package models
import java.io.InputStream
import org.bson.types.ObjectId


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

case class Poll(id : ObjectId , name:String , assosiates:List[ObjectId])


