package utils

import java.io.File
import java.io.FileInputStream
import java.io.FileReader

import scala.collection.JavaConversions.asScalaBuffer

import org.apache.poi.ss.usermodel.WorkbookFactory
import org.bson.types.ObjectId

import au.com.bytecode.opencsv.CSVReader
import models.School

object ReadingSpreadsheetUtil/* extends App*/ {

  /**
   * Read Schools From Spreadsheet and Save In Database If  Not Exist Already
   */
  /*def readExcelSheetOfSchool {
    val fileContainingSchools = new File("/home/neelkanth/Desktop/List of Schools (copy).csv")
    val inputStream = new FileInputStream(fileContainingSchools)
    val sheetContainingSchools = WorkbookFactory.create(inputStream).getSheetAt(0)
    val rowsOftheSheet = sheetContainingSchools.rowIterator
    while (rowsOftheSheet.hasNext) {
      val row = rowsOftheSheet.next
      val cellsOfTheRow = row.cellIterator
      while (cellsOfTheRow.hasNext) {
        val school = new School(new ObjectId, cellsOfTheRow.next.toString, "")
        val schoolListContainingThisSchoolName = School.findSchoolByName(cellsOfTheRow.next.toString)
        if (schoolListContainingThisSchoolName.isEmpty) School.addNewSchool(school)
      }
    }
  }*/

  def readCSVOfSchools(stream: java.io.InputStream) {
//    println("00000000000000000000" + file.length())
    val reader = new CSVReader(new java.io.InputStreamReader(stream))
    println(">>>>>>>>>>>>>>>>>>>>>>>" + reader)
    for (row <- reader.readAll) {
      println("------------------------------")
      val schoolNameToSave = row(1) + ", " + row(3)
      println("<<<<<<<<<<<<<<<<<<<<<<<")
      val schoolToCreate = new School(new ObjectId, schoolNameToSave, "")
      println("{{{{{{{{{{{{{{{{{{{{{{{{{{")
      val schoolId = School.addNewSchool(schoolToCreate)
      println("}}}}}}}}}}}}}}}}}}}}}}}}}}}}")
    }
  }

  //Calling Function
//  readCSVOfSchools

}
