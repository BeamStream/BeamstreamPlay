package controllers
import play.api.mvc.Controller
import play.api._
import play.api.mvc._
import play.api.mvc.Response
import models.Stream
import play.api.data._
import play.api.data.Forms._
import play.api.Play.current
import models.User
import org.bson.types.ObjectId
import play.api.cache.Cache
import models.Media
import com.mongodb.gridfs.GridFSDBFile
import models.UserType
import java.io.File
import play.api.libs.iteratee.Enumerator
import java.util.Date
import models.DocumentAccess
import models.DocType
import models.Message
import models.Document
import models.User
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import java.text.SimpleDateFormat
import utils.EnumerationSerializer
import utils.ObjectIdSerializer
import java.net.URL
import models.ResulttoSent
import play.api.libs.json._

/**
 * This controller class is used to store and retrieve all the information about documents.
 * 
 * @author Kishen 
 */

object DocumentController extends Controller {

   implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  }  + new ObjectIdSerializer

/*
 * 
 * Add a document
 */
  
  def newDocument = Action { implicit request =>
    val documentJsonMap = request.body.asFormUrlEncoded.get
       
     (documentJsonMap.contains(("data"))) match {
     
        case false =>
           
           Ok(write(new ResulttoSent("Failure", "Document data not found !!!")))
        
        case true =>
        
	    val document = documentJsonMap("data").toList(0)
	    
	    val documentJson = net.liftweb.json.parse(document)
	    
	    val name = (documentJson \ "docName").extract[String]
            val url= (documentJson \ "docURL").extract[String]
            val access = (documentJson \ "docAccess").extract[String]
            val docType = (documentJson \ "docType").extract[String]

	    val userId = new ObjectId(request.session.get("userId").get)
	    val date = new Date
	    val documentToCreate = new Document(new ObjectId(), name, url, 
		DocType.withName(docType),userId,
		DocumentAccess.withName(access), userId, date, date, 0, List(), List())
	    val docId=Document.addDocument(documentToCreate,userId)
	    val docObtained = Document.findDocumentById(docId)
	    val docJson = write(List(docObtained))
	    Ok(docJson).as("application/json")
	}
  }

  def documents = Action { implicit request =>
    val profileName = User.getUserProfile((new ObjectId(request.session.get("userId").get)))
    val docs = Document.getAllDocumentsForAUser(new ObjectId(request.session.get("userId").get))
    Ok
  }

  def getAllDocumentsForAUser = Action { implicit request =>
    val documentIdJsonMap = request.body.asFormUrlEncoded.get
    val allDocumentsForAUser = Document.getAllDocumentsForAUser(new ObjectId(request.session.get("userId").get))
    val allDocumentForAStreamJson = write(allDocumentsForAUser)
    Ok(allDocumentForAStreamJson).as("application/json")
  }
  
  /*
   * Rock the document
   */
   def rockTheDocument = Action { implicit request =>
     val documentIdJsonMap = request.body.asFormUrlEncoded.get
     val id = documentIdJsonMap("documentId").toList(0)
     val totalRocks=Document.rockedIt(new ObjectId(id),new ObjectId(request.session.get("userId").get))
     val totalRocksJson=write(totalRocks.toString)
     Ok(totalRocksJson).as("application/json")
   }
   
   /*
    * Rockers of a document
    */
   def giveMeRockers =  Action { implicit request =>
     val documentIdJsonMap = request.body.asFormUrlEncoded.get
     val id = documentIdJsonMap("documentId").toList(0)
     val rockers=Document.rockersNames(new ObjectId(id))
     val rockersJson=write(rockers)
     Ok(rockersJson).as("application/json")
   }
   
   
   /*
    * Documents sorted by a creation date
    */
    
       def getAllDocumentsForCurrentUserSortedbyDate = Action { implicit request =>
   
         val allDocumentsForAUser = Document.getAllDocumentsForAUserSortedbyDate(new ObjectId(request.session.get("userId").get))
         val allDocumentsForAStreamJson = write(allDocumentsForAUser)
         Ok(allDocumentsForAStreamJson).as("application/json")
    }

}

