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

object PreviewImage extends Controller {

  def addPreviewImage(docPreviewImageUrl: String) = {
    if (docPreviewImageUrl != null) {
      try {
        val url = new URL(docPreviewImageUrl)
        val connection = url.openConnection().asInstanceOf[HttpsURLConnection]
        connection.setRequestMethod("GET")
        //        connection.setDoOutput(true)
        //        val wr = new DataOutputStream(connection.getOutputStream())
        println("111111111111111111111111111" + connection.getContentLength())
        if (connection.getContentLength() != -1) {
          val in = connection.getInputStream()
          println("222222222222222222222222222222222222222")
          val mongoDBConnection = MongoConnection()("myTestDB")
          println("33333333333333333333333333333333333333")
          val gridFS = GridFS(mongoDBConnection, "image")
          println("444444444444444444444444444444444444")
          val gfsFile = gridFS.createFile(in)
          println("5555555555555555555555555555555555555")
          gfsFile.contentType_=("image/png")
          println("66666666666666666666666666666666666666666666")
          gfsFile.filename = (new PasswordHashingUtil).encryptThePassword(docPreviewImageUrl)
          println("----------------------------------------")
          gfsFile.save
          println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.")
          in.close
        }
      } catch {
        case e: Exception => println(e.getMessage())
      } finally {
        //      out.close
        //      in.close
      }
    }

  }

  def getPhoto(fileName: String) = Action { implicit request =>

    val mongoDBConnection = MongoConnection()("myTestDB")
    println("33333333333333333333333333333333333333")
    val gridFs = GridFS(mongoDBConnection, "image")
    println("44444444444444444444444444444444444444")
    gridFs.findOne(fileName) match {
      case None => NotFound
      case Some(img) => SimpleResult(
        ResponseHeader(200, Map(
          CONTENT_LENGTH -> img.length.toString,
          CONTENT_TYPE -> img.contentType.getOrElse("image/png"))),
        Enumerator.fromStream(img.inputStream))

    }
  }
}