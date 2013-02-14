package controllers

import play.api.mvc._

object Deadlines extends Controller {

  def index = Action {
    Ok(views.html.deadlines.deadlines("Deadline Page."))
  }
    
}


