package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import org.joda.time.DateTime
import org.bson.types.ObjectId
import utils.MongoHQConfig
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import java.util.Date
import java.net.URL

/**
 * This class is used to store and retrieve all the information about documents.
 * 
 * @author Kishen 
 */

/*
 * Enumeration for the document access 
 * 
 * Private - Only available for the owner
 * Public - Available to all
 * Restricted - Available to a restricted list of users
 * Stream - Available to all the Sub-streams and current members of this stream
 */
object DocumentAccess extends Enumeration {
  type DocumentAccess = Value
  val Private = Value(0, "Private")
  val Public = Value(1, "Public")
  val Restricted = Value(2, "Restricted")
  val Stream = Value(3,"Stream")

}

/*
 * Enumeration for the document type
 */
object DocType extends Enumeration {
  type DocType = Value
  val GoogleDocs = Value(0, "GoogleDocs")
  val YoutubeVideo = Value(1, "YoutubeVideo")
  val Other = Value(3, "Other")
}

case class Document(@Key("_id") id: ObjectId, 
                                name: String, 
                                url: String, 
                                docType: DocType.Value, 
                                userId: ObjectId, 
                                access: DocumentAccess.Value, 
                                streamId: ObjectId,
                                creationDate: Date, 
                                lastUpdateDate: Date, 
                                rocks: Int, 
                                rockers: List[ObjectId], 
                                comments : List[ObjectId])

case class DocumentForm(name: String)
object Document {

  implicit val formats = DefaultFormats

  def allDocuments(): List[Document] = Nil

/*
 * Add a document
 */
  def addDocument(document : Document, userId : ObjectId) : ObjectId = {
      val docId = DocumentDAO.insert(document)
      User.addDocumentToUser(userId,document.id)
      docId.get
   }

  /*
   * Remove document
   */
  def removeDocument(document : Document) {
    DocumentDAO.remove(document)

  }

 /*
  * Names of a rockers for a document
  */
  def rockersNames(docId: ObjectId): List[String] = {
    val docRocked = DocumentDAO.find(MongoDBObject("_id" -> docId)).toList(0)
    val rockersName = User.giveMeTheRockers(docRocked.rockers)
    rockersName
  }
    
  /*
   * Find document by name
   */

  def findDocumentByName(name: String): List[Document] = {
    val regexp = (""".*""" + name + """.*""").r
    for (document <- DocumentDAO.find(MongoDBObject("name" -> regexp)).toList) yield document
  }

  /*
   * Get all documents for a user
   */
  def getAllDocumentsForAUser(userId: ObjectId): List[Document] = {

    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    println(" getAllDocumentsForAUser : "+ user);
    println(" getAllDocumentsForAUser : Documents "+ user.documents);
    getAllDocuments(user.documents)
  }

  /*
   * Get all Documents List
   */

  def getAllDocuments(documentIdList: List[ObjectId]): List[Document] = {
    var documentList: List[Document] = List()

    for (documentId <- documentIdList) {
      val doc = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList
      documentList ++= doc
    }

    documentList
  }
  
   /*
   *  Update the Rockers List and increase the count by one 
   */

  def rockedIt(documentId: ObjectId, userId: ObjectId): Int = {
  
    
    val documentToRock = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
    
    documentToRock.rockers.contains(userId) match { 
    
           // If the document is already rocked by the user, return the current rock count without updating
	    case true => 
		    documentToRock.rocks

            // Otherwise, update the rocker and count
	    case false =>        

	    DocumentDAO.update(MongoDBObject("_id" -> documentId), documentToRock.copy(rockers = (documentToRock.rockers ++ List(userId))), false, false, new WriteConcern)

	    val updatedDocument = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
	    DocumentDAO.update(MongoDBObject("_id" -> documentId), updatedDocument.copy(rocks = (updatedDocument.rocks + 1)), false, false, new WriteConcern)

	    val document = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
	    document.rocks
    
          }

  }
  
  /*
   * Change the access of a document
   */
   def changeAccess(documentId: ObjectId, newAccess: DocumentAccess.Value) = {
    val document = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
    DocumentDAO.update(MongoDBObject("_id" -> documentId), document.copy(access = newAccess), false, false, new WriteConcern)
  }

  /*
   * Total number of rocks for a particular document
   */
   def totalRocks(documentId: ObjectId): Int = {
    val document = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
    document.rocks
  }
   
   def findDocumentById(docId: ObjectId): Document = {
    val doc = DocumentDAO.findOneByID(docId)
    doc.get
  }
  
    /*
   * add Comment to message
   */
    def addCommentToDocument(documentId: ObjectId, commentId : ObjectId) {
      val document = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
      DocumentDAO.update(MongoDBObject("_id" -> documentId), document.copy(comments = (document.comments ++ List(commentId))), false, false, new WriteConcern)
  }
   
}

object DocumentDAO extends SalatDAO[Document, ObjectId](collection = MongoHQConfig.mongoDB("document"))