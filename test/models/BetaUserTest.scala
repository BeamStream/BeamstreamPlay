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

@RunWith(classOf[JUnitRunner])
class BetaUserTest extends FunSuite with BeforeAndAfter {

  test("Add Beta User & Find Beta User") {
    val betaUser = BetaUser(new ObjectId, UserType.Educator, "neelkanth@knoldus.com")
    BetaUser.addBetaUser(betaUser)
    assert(BetaUser.findBetaUserbyEmail("neelkanth@knoldus.com").size === 1)
    assert(BetaUser.findBetaUserbyEmail("neelkanth@knoldus.com").head.userType === UserType.Educator)
  }

  after {
    BetaUserDAO.remove(MongoDBObject("emailId" -> ".*".r))
  }

}