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
  
  val refreshToken = "1/LMMF-mRLuNabgh9xdP80hMKLh7CXn4_4uoIaJi1ejdU"

  test("Get all Documents from Google Docs") {
    running(FakeApplication()) {
      val accessToken = GoogleDocsUploadUtility.getNewAccessToken(refreshToken)
      val allGoogleDocs = GoogleDocsUploadUtility.getAllDocumentsFromGoogleDocs(accessToken)
      assert(allGoogleDocs(0)._1.getClass().toString() === "class java.lang.String")
    }
  }
  
  test("Upload a File to Google Docs") {
    running(FakeApplication()) {
      val fileToUpload = new File("/home/himanshu/hello.txt")
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
      val allGoogleDocs = GoogleDocsUploadUtility.getAllDocumentsFromGoogleDocs(accessToken)
      val deletedGoogleDoc = GoogleDocsUploadUtility.deleteAGoogleDocument(accessToken, allGoogleDocs(0)._2.split("/")(7))
      assert(deletedGoogleDoc === null)
    }
  }
  
}
