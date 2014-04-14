package utils

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers.running
import play.api.test.FakeApplication

@RunWith(classOf[JUnitRunner])
class GoogleDocsUploadUtilityTest extends FunSuite {

  test("Get all Documents from Google Docs") {
    running(FakeApplication()) {
      val accessToken = GoogleDocsUploadUtility.getNewAccessToken("1/BnqpFU5AbhvOoto59JQMyS5R9UxUzaQNdlY-E70SIKU")
      val allGoogleDocs = GoogleDocsUploadUtility.getAllDocumentsFromGoogleDocs(accessToken)
      assert(allGoogleDocs(0)._1.getClass().toString() === "class java.lang.String")
    }
  }

  test("Create a New Google Document in Google Docs") {
    running(FakeApplication()) {
      val accessToken = GoogleDocsUploadUtility.getNewAccessToken("1/BnqpFU5AbhvOoto59JQMyS5R9UxUzaQNdlY-E70SIKU")
      val newGoogleDoc = GoogleDocsUploadUtility.createANewGoogleDocument(accessToken, "application/vnd.google-apps.document")
      assert(newGoogleDoc(0).getClass().toString() === "class java.lang.String")
    }
  }
  
  test("Delete a Google Document from Google Docs") {
    running(FakeApplication()) {
      val accessToken = GoogleDocsUploadUtility.getNewAccessToken("1/BnqpFU5AbhvOoto59JQMyS5R9UxUzaQNdlY-E70SIKU")
      val newGoogleDoc = GoogleDocsUploadUtility.createANewGoogleDocument(accessToken, "application/vnd.google-apps.document")
      val allGoogleDocs = GoogleDocsUploadUtility.getAllDocumentsFromGoogleDocs(accessToken)
      val deletedGoogleDoc = GoogleDocsUploadUtility.deleteAGoogleDocument(accessToken, allGoogleDocs(0)._2.split("/")(7))
      assert(deletedGoogleDoc === null)
    }
  }
  
}
