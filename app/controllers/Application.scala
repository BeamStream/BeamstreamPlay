package controllers

import play.api._
import play.api.mvc._
import models.Quote

object Application extends Controller {
  
  def index = Action {
    Ok(views.html.index("Your new application is ready.", new Quote("This test is specified by a honest person","vikas")))
  }
  
}