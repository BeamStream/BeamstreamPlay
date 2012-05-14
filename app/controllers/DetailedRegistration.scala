package controllers

import java.io.File
import models.DetailedRegForm
import models.User
import play.api.data.Forms._
import play.api.data._
import play.api.mvc._
import play.api._
import java.io.InputStream
import java.io.FileInputStream
import org.bson.types.ObjectId
import models.School
import models.Year
import models.DegreeExpected
import models.Degree
import java.text.DateFormat
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import net.liftweb.json.Extraction._
import net.liftweb.json.JsonDSL._
import net.liftweb.json.JsonAST.JObject

object DetailedRegistration extends Controller {

   implicit val formats = DefaultFormats
  /*
   * Map the field values from html
   */
  
  val detailed_regForm = Form(
    mapping(
      "schoolName" -> nonEmptyText)(DetailedRegForm.apply)(DetailedRegForm.unapply))

  def users = Action {
    Ok(views.html.detailed_reg(detailed_regForm))
  }

  /*
   * Sends the field values & profile related info to User Model for adding the info of a User
   */

  def addInfo = Action { implicit request =>
    
   println("Here's the JSON from Curl request"+ request.body )
    
   val schoolListJson=request.body.asJson.get.toString
   println("Here's the JSON String extracted"+ schoolListJson) 
    
    val s = net.liftweb.json.parse(schoolListJson).extract[List[School]]
   
    println("My Objects"+s)
   

    val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
    var schools: List[School] = List()

    val myschool1 = School(new ObjectId, "MPS", Year.FirstYear, DegreeExpected.Spring2012,
      "CSE", Degree.Masters, Option(true), Option(formatter.parse("12-07-2011")), List())
    val myschool2 = School(new ObjectId, "DPS", Year.FirstYear, DegreeExpected.Spring2012,
      "CSE", Degree.Masters, Option(true), Option(formatter.parse("12-07-2011")), List())

    schools ++= List(myschool1, myschool2)
    User.addInfo(schools, new ObjectId("4fb089e784ae623e5e02ef07"))

     Ok("Executed the Function")
   
  }
}