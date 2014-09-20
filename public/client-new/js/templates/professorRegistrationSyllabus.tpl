<script>
$(function() {
  $( "#dialog-modal" ).dialog({
    autoOpen: false,
    modal: true,
    width: 700,
    height: 400,
    draggable: false,
    resizable: false,
    create: function (event) { $(event.target).parent().css({'position':'fixed','margin-left':'25%'});}
  });
  $( "#datepicker" ).datepicker();
});
</script>

<div class="professor-registration">
  <div class="syllabus-info">
    <div class="syllabus-header row-fluid">
      <div class="span3">
        <h5>SYLLABUS INFO</h5>
      </div>
<!--       <div>

      </div> -->
      <!-- <div>
      </div> -->
    <!-- <div class="span6 offset3"> -->
    <div class="span3 offset3">
      SYLLABUS <span class="percentageComplete">30</span>% COMPLETE
    </div>
      <div class="progress span3">
        <div class="bar syllabusProgressBar"></div>
      </div>
    </div>
    <!-- </div> -->
    <div class="accordion-group">
      <div class="accordion-heading">
        <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseOne">
          + Class Info/Intro
          <span class="completed">&#10003;
           Completed</span>
         </a>
       </div>
       <div id="collapseOne" class="accordion-body collapse">
        <div class="accordion-inner">
          <textarea class="class-intro-textarea" placeholder="You Rock!" name="classAccess"></textarea>
          <div class="icons">
            <i class="icon-pencil icon-large"></i> 
            <i class="icon-remove icon-large"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="accordion-group">
      <div class="accordion-heading">
        <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseTwo">
          + Grades Determined
          <span class="completed">&#10003;
           Completed</span>
         </a>
       </div>
       <div id="collapseTwo" class="accordion-body collapse">
        <div class="accordion-inner grades">
          <div class="add-graded-for">
            <input class="gradedfor" type="text" placeholder="Graded for..." name="graded-for">
            <button class="btn btn-inverse add-grade">ADD</button>
          </div>
        </div>
      </div>
    </div>

    <div class="accordion-group">
      <div class="accordion-heading">
        <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseThree">
          + Study Resources
          <span class="completed">&#10003;
           Completed</span>
         </a>
       </div>
       <div id="collapseThree" class="accordion-body collapse">
        <div class="accordion-inner study-resources-links">

          <div class="study-resources">
            <form>
              <input class="resource-title" type="text" placeholder="Resource Title" name="resource-title"> <span class="add-link"><i class="icon-link icon-large"></i>Add Link</span> <span class="add-attachemnt"><i class="icon-paper-clip icon-large"></i>Add Attachment</span>
              <button class="btn btn-inverse add-resource" type="submit">ADD</button>
            </form>
            <div id="dialog-modal" title="Add a Link">
              <p>Insert link here and press space for preview:</p>
              <form>
                <input id="url" type="text" name="url"/>

                <!-- Placeholder that tells Preview where to put the selector-->
                <div class="selector-wrapper"></div>
                <p><button class="btn btn-large btn-success addResourceLinkToSyllabus" type="submit">Add Resource Link</button></p>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </div>

    <div class="accordion-group">
      <div class="accordion-heading">
        <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseFour">
          + Tests, Quizes &amp; Assignments
          <span class="completed">&#10003;
           Completed</span>
         </a>
       </div>
       <div id="collapseFour" class="accordion-body collapse">
        <div class="accordion-inner test-quizzes-deadlines">
          <form class="test-quizes-form-container">
            <input class="resource-title" type="text" placeholder="Resource Title" name="resource-title"><select>
            <option>Test</option>
            <option>Quiz</option>
            <option>Assignments</option>
          </select>
          <input type="text" id="datepicker" placeholder="Due Date"/>
          <button class="btn btn-inverse add-test-quiz-deadline" type="submit">ADD</button>
        </form>
      </div>
    </div>
  </div>

  <div class="accordion-group">
    <div class="accordion-heading">
      <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseFive">
        + Attendace &amp; Make Up Work
        <span class="completed">&#10003;
         Completed</span>
       </a>
     </div>
     <div id="collapseFive" class="accordion-body collapse">
      <div class="accordion-inner">
        <textarea class="attendance-makeup-work" placeholder="Attendance"></textarea>
        <div class="icons">
          <i class="icon-pencil icon-large"></i> 
          <i class="icon-remove icon-large"></i>
        </div>
      </form>
    </div>
  </div>
</div>
</div>
</div>

