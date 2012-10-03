package utils

import au.com.bytecode.opencsv.CSVReader
import java.io.FileReader
import scala.collection.JavaConversions._

import java.io.FileInputStream
import java.util.Iterator
import org.apache.poi.ss.usermodel.Sheet
import org.apache.poi.ss.usermodel.WorkbookFactory
import java.io.File
import java.io.InputStream
import models.School
import org.bson.types.ObjectId

object ReadingSpreadsheet extends App {

  /**
   * Read Schools From Spreadsheet and Save In Database If  Not Exist Already
   */
  def readExcelSheetOfSchool {
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

  }

  def readCSVOfSchools {
    val reader = new CSVReader(new FileReader("/home/neelkanth/Desktop/List of Schools (copy).csv"))
    for (row <- reader.readAll) {
      val schoolNameToSave = row(1) + ", " + row(3)
      val schoolToCreate = new School(new ObjectId, schoolNameToSave, "")
      val schoolListContainingThisSchoolName = School.findSchoolByName(schoolNameToSave)
      if (schoolListContainingThisSchoolName.isEmpty) School.addNewSchool(schoolToCreate)

    }
  }
  readCSVOfSchools

}