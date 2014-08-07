package utils

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers.running
import play.api.test.FakeApplication
import java.io.File
import play.api.Play

@RunWith(classOf[JUnitRunner])
class GoogleDocsUploadUtilityTest extends FunSuite {
  
  val refreshToken = "1/YiX-z8yUjALGdNoctxhVI7RiuISgvf77dJijXdXn60k"

  test("Get all Documents from Google Docs") {
    running(FakeApplication()) {
      val accessToken = GoogleDocsUploadUtility.getNewAccessToken(refreshToken)
      val allGoogleDocs = GoogleDocsUploadUtility.getAllDocumentsFromGoogleDocs(accessToken, true)
      assert(allGoogleDocs.getClass.toString() === "class scala.collection.immutable.$colon$colon")
    }
  }
  
  test("Get few Documents from Google Docs") {
    running(FakeApplication()) {
      val accessToken = GoogleDocsUploadUtility.getNewAccessToken(refreshToken)
      val allGoogleDocs = GoogleDocsUploadUtility.getAllDocumentsFromGoogleDocs(accessToken, false)
      assert(allGoogleDocs.getClass.toString() === "class scala.collection.immutable.Nil$")
    }
  }
  
  test("Upload a File to Google Docs") {
    running(FakeApplication()) {
      val fileToUpload = new File("scalastyle-config.xml")
      val accessToken = GoogleDocsUploadUtility.getNewAccessToken(refreshToken)
      val result = GoogleDocsUploadUtility.uploadToGoogleDrive(accessToken, fileToUpload, "Himanshu", "*/*")
      assert(result.split(":")(0) === "https")
    }
  }

  test("Create a New Google Document in Google Docs") {
    running(FakeApplication()) {
      val accessToken = GoogleDocsUploadUtility.getNewAccessToken(refreshToken)
      val newGoogleDoc = GoogleDocsUploadUtility.createANewGoogleDocument(accessToken, "application/vnd.google-apps.document")
      assert(newGoogleDoc(0).getClass().toString() === "class java.lang.String")
    }
  }
  
  test("Delete a Google Document from Google Docs") {
    running(FakeApplication()) {
      val accessToken = GoogleDocsUploadUtility.getNewAccessToken(refreshToken)
      val newGoogleDoc = GoogleDocsUploadUtility.createANewGoogleDocument(accessToken, "application/vnd.google-apps.document")
      val allGoogleDocs = GoogleDocsUploadUtility.getAllDocumentsFromGoogleDocs(accessToken, true)
      val deletedGoogleDoc = GoogleDocsUploadUtility.deleteAGoogleDocument(accessToken, allGoogleDocs(0)._2.split("/")(5))
      assert(deletedGoogleDoc === null)
    }
  }
  
  test("Get GmailID of User") {
    running(FakeApplication()) {
      val accessToken = GoogleDocsUploadUtility.getNewAccessToken(refreshToken)
      val gmailId = GoogleDocsUploadUtility.getGmailId(accessToken)
      assert(gmailId === "hgupta735@gmail.com")
    }
  }
  
  test("Can a User Access a Google Doc") {
    running(FakeApplication()) {
      val accessToken = GoogleDocsUploadUtility.getNewAccessToken(refreshToken)
      val canAccessGoogleDoc = GoogleDocsUploadUtility.canAccessGoogleDoc(accessToken, accessToken, "")
      assert(canAccessGoogleDoc === false)
    }
  }
  
  test("Get Title of Google Doc") {
    running(FakeApplication()) {
      val accessToken = GoogleDocsUploadUtility.getNewAccessToken(refreshToken)
      val canAccessGoogleDoc = GoogleDocsUploadUtility.getGoogleDocData(accessToken, "")
      assert(canAccessGoogleDoc !== "Exception")
    }
  }
  
  test("Find Gmail Id of Google Doc Owner") {
    running(FakeApplication()) {
      val accessToken = GoogleDocsUploadUtility.getNewAccessToken(refreshToken)
      val canAccessGoogleDoc = GoogleDocsUploadUtility.findGmailIdOfDocOwner(accessToken, "")
      assert(canAccessGoogleDoc === "")
    }
  }
  
}
