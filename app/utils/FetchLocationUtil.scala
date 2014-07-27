package utils

import play.api.Play
import java.net.URL
import java.io.BufferedReader
import java.io.InputStreamReader
import au.com.bytecode.opencsv.CSVReader
import scala.collection.JavaConversions.asScalaBuffer

object FetchLocationUtil {

  def getLocation(ipAddress: String): String = {
    val key: String = Play.current.configuration.getString("ipinfodb_api_key").get;
    val ipInfoDBURL = new URL("http://api.ipinfodb.com/v3/ip-city" + "/?key=" + key + "&ip=" + ipAddress + "&format=" + "json")
    val conn = ipInfoDBURL.openConnection

    val in = new BufferedReader(
      new InputStreamReader(conn.getInputStream))
    val response = new StringBuffer
    for (i <- 0 to 12) {
      response.append(in.readLine)
    }
    in.close()
    val nullExpr = "null".r
    val dataString = nullExpr.replaceAllIn(response.toString, "")
    val dataList = dataString.split(",").toList
    val listOfStates = FetchLocationUtil.getClass().getClassLoader().getResourceAsStream("ListOfStates.csv")
    val reader = new CSVReader(new java.io.InputStreamReader(listOfStates))
    var stateName: String = dataList(5).split(":")(1).toString()
    val name = stateName.substring(2, stateName.length() - 1)
    for (row <- reader.readAll) {
      if (row(0).toUpperCase() == name) {
        stateName = row(1)
      }
    }
    val cityName = dataList(6).split(":")(1).toString()
    if (stateName.length() == 2) {
      val location = cityName.substring(2, cityName.length() - 1).concat(", ").concat(stateName)
      location
    } else {
      val location = cityName.substring(2, cityName.length() - 1).concat(", ").concat(name)
      location
    }
  }
}
