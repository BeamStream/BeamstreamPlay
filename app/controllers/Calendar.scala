package controllers

import play.api.mvc._

object Calendar extends Controller {

  def index = Action {
    Ok(views.html.calendar.index("Calendar Page."))
  }
    
}


