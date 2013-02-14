package controllers

import play.api.mvc._

object Calendar extends Controller {

  def index = Action {
    Ok(views.html.calendar.calendar("Calendar Page."))
  }
    
}


