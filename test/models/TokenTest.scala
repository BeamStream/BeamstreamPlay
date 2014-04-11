package models

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import java.text.DateFormat
import play.api.test.Helpers.running
import play.api.test.FakeApplication
import play.api.Play
import java.util.Date
import utils.TokenEmailUtil

@RunWith(classOf[JUnitRunner])
class TokenTest extends FunSuite with BeforeAndAfter {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)

  before {
    running(FakeApplication()) {
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    }
  }

  test("Update Token") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val tokenTobeCreated = Token(new ObjectId, userId.get.toString(), TokenEmailUtil.securityToken, false)
      Token.addToken(tokenTobeCreated)
      Token.updateToken(tokenTobeCreated.tokenString)
      val tokenAfterUpdate = TokenDAO.find(MongoDBObject()).size
      assert(tokenAfterUpdate === 1)
    }
  }

  after {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
    }
  }

}