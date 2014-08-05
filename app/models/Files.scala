package models

import org.bson.types.ObjectId

import com.mongodb.casbah.commons.MongoDBObject

object Files {

  /**
   * Get All Audio Files
   */
  def getAllAudioFiles(userId: ObjectId): List[Document] = {
    var audioFilesToReturn: List[Document] = Nil
    val audioExtensionsList: List[String] = List(".mp3", ".wav", ".aiff", ".au", ".bwf", ".cda", ".amr", ".ogg", ".MP3", ".WAV", ".AIFF", ".AU", ".BWF", ".CDA", ".AMR", ".OGG")
    val filesFound = DocumentDAO.find(MongoDBObject("userId" -> userId, "documentType" -> "Other")).sort(orderBy = MongoDBObject("creationDate" -> -1)).toList
    filesFound map {
      case file =>
        val fileName = file.documentURL
        val i = fileName.lastIndexOf(".")
        val extensionToMatch = fileName.substring(i)
        (audioExtensionsList.contains(extensionToMatch)) match {
          case true => audioFilesToReturn ++= List(file)
          case false =>
        }
    }
    audioFilesToReturn

  }

  /**
   * Get All Presentation Files
   */
  def getAllPPTFiles(userId: ObjectId): List[Document] = {
    var pptFiles: List[Document] = Nil
    val pptExtensionsList: List[String] = List(".odg", ".odp", ".pps", ".ppsx", ".ppt", ".pptm", ".pptx", ".sda", ".sdd", ".sxd", ".sxi", ".uof", ".uop",
      ".ODG", ".ODP", ".PPS", ".PPSX", ".PPT", ".PPTM", ".PPTX", ".SDA", ".SDD", ".SXD", ".SXI", ".UOF", ".UOP")
    val filesFound = DocumentDAO.find(MongoDBObject("userId" -> userId, "documentType" -> "Other")).sort(orderBy = MongoDBObject("creationDate" -> -1)).toList
    filesFound map {
      case file =>
        val fileName = file.documentURL
        val i = fileName.lastIndexOf(".")
        val extensionToMatch = fileName.substring(i)
        (pptExtensionsList.contains(extensionToMatch)) match {
          case true => pptFiles ++= List(file)
          case false =>
        }
    }
    pptFiles
  }

  /**
   * Get All PDF Files
   */
  def getAllPDFFiles(userId: ObjectId): List[Document] = {
    var pdfFiles: List[Document] = Nil
    val pdfExtensionsList: List[String] = List(".pdf", ".PDF")
    val filesFound = DocumentDAO.find(MongoDBObject("userId" -> userId, "documentType" -> "Other")).sort(orderBy = MongoDBObject("creationDate" -> -1)).toList
    filesFound map {
      case file =>
        val fileName = file.documentURL
        val i = fileName.lastIndexOf(".")
        val extensionToMatch = fileName.substring(i)
        (pdfExtensionsList.contains(extensionToMatch)) match {
          case true => pdfFiles ++= List(file)
          case false =>
        }
    }
    pdfFiles
  }

  /**
   * Get All DOCS Files
   */
  def getAllDOCSFiles(userId: ObjectId): List[Document] = {
    var documentsFiles: List[Document] = Nil
    val documentFilesExtensionsList: List[String] = List(".doc", ".docx", ".txt", ".rtf", ".xls", ".xlsx", ",DOC", ".DOCX", ".TXT", ".RTF", ".XLS", ".XLSX", ".html", ".HTML")
    val filesFound = DocumentDAO.find(MongoDBObject("userId" -> userId, "documentType" -> "Other")).sort(orderBy = MongoDBObject("creationDate" -> -1)).toList
    filesFound map {
      case file =>
        val fileName = file.documentURL
        val i = fileName.lastIndexOf(".")
        val extensionToMatch = fileName.substring(i)
        (documentFilesExtensionsList.contains(extensionToMatch)) match {
          case true => documentsFiles ++= List(file)
          case false =>
        }
    }
    documentsFiles
  }

  /**
   * Get All File Types (V)
   */
  def getAllFileTypes(userId: ObjectId): List[Document] = {
    DocumentDAO.find(MongoDBObject("userId" -> userId)).sort(orderBy = MongoDBObject("creationDate" -> -1)).toList
  }

}
