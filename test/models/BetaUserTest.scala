package models

import org.bson.types.ObjectId
import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import org.scalatest.junit.JUnitRunner
import utils.GoogleDocsUploadUtility

/**
 * ********************************Re-architecture ***********************************************
 */
@RunWith(classOf[JUnitRunner])
class BetaUserTest extends FunSuite with BeforeAndAfter {

  before {
//    BetaUserDAO.remove(MongoDBObject("emailId" -> ".*".r))
  }

  test("Google Doc Upload Test"){
    GoogleDocsUploadUtility.upload
  }
  
//  test("Add Beta User") {
//    val betaUser = BetaUser(new ObjectId, "neelkanth@knoldus.com")
//    val betaUserId = BetaUser.addBetaUser(betaUser)
//    assert(betaUserId.get === betaUser.id)	
//    
//  }
//
//  test("Find Beta User") {
//    val betaUser = BetaUser(new ObjectId, "neelkanth@knoldus.com")
//    val betaUserId = BetaUser.addBetaUser(betaUser)
//    assert(BetaUser.findBetaUserbyEmail("neelkanth@knoldus.com").size === 1)
//  }

  after {
//    BetaUserDAO.remove(MongoDBObject("emailId" -> ".*".r))
  }

}