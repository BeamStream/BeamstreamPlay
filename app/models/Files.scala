package models
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import scala.collection.immutable.List

object Files {

  //----------------------//
  // Get All Audio Files //
  //--------------------//
  def getAllAudioFiles(userId: ObjectId): List[Document] = {
    var audioFiles: List[Document] = List()
    val audioExtensionsList: List[String] = List(".mp3")

    val filesFound = DocumentDAO.find(MongoDBObject("userId" -> userId, "documentType" -> "Other")).toList

    for (file <- filesFound) {
      val fileName = file.documentURL
      val i = fileName.lastIndexOf(".")
      val extensionToMatch = fileName.substring(i)
      if (audioExtensionsList.contains(extensionToMatch)) audioFiles ++= List(file)
    }
    audioFiles
  }
  
  
   //---------------------//
  // Get All Video Files //
  //--------------------//
  def getAllVideoFiles(userId: ObjectId): List[Document] = {
    var audioFiles: List[Document] = List()
    val audioExtensionsList: List[String] = List(".mp4",".flv")

    val filesFound = DocumentDAO.find(MongoDBObject("userId" -> userId, "documentType" -> "Other")).toList

    for (file <- filesFound) {
      val fileName = file.documentURL
      val i = fileName.lastIndexOf(".")
      val extensionToMatch = fileName.substring(i)
      if (audioExtensionsList.contains(extensionToMatch)) audioFiles ++= List(file)
    }
    audioFiles
  }

}