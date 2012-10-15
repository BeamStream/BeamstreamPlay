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
    val audioExtensionsList: List[String] = List(".mp3", ".wav", ".aiff", ".au", ".bwf", ".cda", ".amr", ".ogg", ".MP3", ".WAV", ".AIFF", ".AU", ".BWF", ".CDA", ".AMR", ".OGG")
    val filesFound = DocumentDAO.find(MongoDBObject("userId" -> userId, "documentType" -> "Other")).toList
    for (file <- filesFound) {
      val fileName = file.documentURL
      val i = fileName.lastIndexOf(".")
      val extensionToMatch = fileName.substring(i)
      if (audioExtensionsList.contains(extensionToMatch)) audioFiles ++= List(file)
    }
    audioFiles
  }

  //----------------------------//
  // Get All Presentation Files //
  //---------------------------//
  def getAllPPTFiles(userId: ObjectId): List[Document] = {
    var pptFiles: List[Document] = List()
    val pptExtensionsList: List[String] = List(".odg", ".odp", ".pps", ".ppsx", ".ppt", ".pptm", ".pptx", ".sda", ".sdd", ".sxd", ".sxi", ".uof", ".uop",
      ".ODG", ".ODP", ".PPS", ".PPSX", ".PPT", ".PPTM", ".PPTX", ".SDA", ".SDD", ".SXD", ".SXI", ".UOF", ".UOP")
    val filesFound = DocumentDAO.find(MongoDBObject("userId" -> userId, "documentType" -> "Other")).toList
    for (file <- filesFound) {
      val fileName = file.documentURL
      val i = fileName.lastIndexOf(".")
      val extensionToMatch = fileName.substring(i)
      if (pptExtensionsList.contains(extensionToMatch)) pptFiles ++= List(file)
    }
    pptFiles
  }
  
  //----------------------//
  // Get All PDF Files //
  //--------------------//
  def getAllPDFFiles(userId: ObjectId): List[Document] = {
    var pdfFiles: List[Document] = List()
    val pdfExtensionsList: List[String] = List(".pdf",".PDF")
    val filesFound = DocumentDAO.find(MongoDBObject("userId" -> userId, "documentType" -> "Other")).toList
    for (file <- filesFound) {
      val fileName = file.documentURL
      val i = fileName.lastIndexOf(".")
      val extensionToMatch = fileName.substring(i)
      if (pdfExtensionsList.contains(extensionToMatch)) pdfFiles ++= List(file)
    }
    pdfFiles
  }
  
  //----------------------//
  // Get All DOCS Files //
  //--------------------//
  def getAllDOCSFiles(userId: ObjectId): List[Document] = {
    var documentsFiles: List[Document] = List()
    val documentFilesExtensionsList: List[String] = List(".doc",".docx",".txt",".rtf",",DOC",".DOCX",".TXT",".RTF")
    val filesFound = DocumentDAO.find(MongoDBObject("userId" -> userId, "documentType" -> "Other")).toList
    for (file <- filesFound) {
      val fileName = file.documentURL
      val i = fileName.lastIndexOf(".")
      val extensionToMatch = fileName.substring(i)
      if (documentFilesExtensionsList.contains(extensionToMatch)) documentsFiles ++= List(file)
    }
    documentsFiles
  }

}