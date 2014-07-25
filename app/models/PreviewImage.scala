package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import org.bson.types.ObjectId
import utils.MongoHQConfig
import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.WriteConcern
import models.mongoContext._
import java.net.HttpURLConnection
import java.io.InputStream
import java.io.OutputStream
import java.net.URL
import utils.PasswordHashingUtil
import javax.net.ssl.HttpsURLConnection
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.DataOutputStream
import java.io.BufferedOutputStream
import java.io.FileOutputStream
import java.io.File
import com.mongodb.casbah.MongoConnection
import com.mongodb.casbah.gridfs.GridFS
import com.mongodb.casbah.Implicits._
import play.api.mvc.SimpleResult
import play.api.mvc.ResponseHeader
import play.api.libs.iteratee.Enumerator
import play.api.mvc.Action
import play.api.mvc.Controller
import play.api.libs.concurrent.Execution.Implicits._
import play.api.Logger

object PreviewImage extends Controller {

  def addPreviewImage(docPreviewImageUrl: String) = {
    if (docPreviewImageUrl != null) {
      try {
        val url = new URL(docPreviewImageUrl)
        val connection = url.openConnection().asInstanceOf[HttpsURLConnection]
        connection.setRequestMethod("GET")
        if (connection.getContentLength() != -1) {
          val in = connection.getInputStream()
          val mongoDBConnection = MongoConnection()("myTestDB")
          val gridFS = GridFS(mongoDBConnection, "image")
          val gfsFile = gridFS.createFile(in)
          gfsFile.contentType_=("image/png")
          gfsFile.filename = docPreviewImageUrl
          gfsFile.save
          in.close
        }
      } catch {
        case ex: Exception => Logger.error("This error occurred while Adding Preview Image of Google Docs :- ", ex)
      } finally {
        //      out.close
        //      in.close
      }
    }

  }

  /*def getPhoto(previewImageUrl: String) = Action { implicit request =>

    val mongoDBConnection = MongoConnection()("myTestDB")
    val gridFs = GridFS(mongoDBConnection, "image")
    val fileName = (new PasswordHashingUtil).encryptThePassword(previewImageUrl)
    gridFs.findOne(fileName) match {
      case None => NotFound
      case Some(img) => SimpleResult(
        ResponseHeader(200, Map(
          CONTENT_LENGTH -> img.length.toString,
          CONTENT_TYPE -> img.contentType.getOrElse("image/png"))),
        Enumerator.fromStream(img.inputStream))
    }
  }*/
}
