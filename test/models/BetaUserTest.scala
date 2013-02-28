package models
import org.scalatest.FunSuite
import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest._
import org.scalatest.junit.JUnitRunner
import com.mongodb.casbah.commons.MongoDBObject
import org.joda.time.DateTime
import com.mongodb.casbah.commons.conversions.scala._
import org.joda.time.format.DateTimeFormatter
import org.joda.time.base.BaseDateTime
import org.joda.time.LocalDateTime
import org.bson.types.ObjectId
import java.text.DateFormat

/**
 * ********************************Re-architecture ***********************************************
 */
@RunWith(classOf[JUnitRunner])
class BetaUserTest extends FunSuite with BeforeAndAfter {

  before {
    BetaUserDAO.remove(MongoDBObject("emailId" -> ".*".r))
  }

  test("Add Beta User") {
    val betaUser = BetaUser(new ObjectId, "neelkanth@knoldus.com")
    val betaUserId = BetaUser.addBetaUser(betaUser)
    assert(betaUserId.get === betaUser.id)
  }

  test("Find Beta User") {
    val betaUser = BetaUser(new ObjectId, "neelkanth@knoldus.com")
    val betaUserId = BetaUser.addBetaUser(betaUser)
    assert(BetaUser.findBetaUserbyEmail("neelkanth@knoldus.com").size === 1)
  }

  after {
    BetaUserDAO.remove(MongoDBObject("emailId" -> ".*".r))
  }

}