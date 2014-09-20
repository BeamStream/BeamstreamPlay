define(['baseView','../../lib/jquery.meio.mask','../../lib/extralib/jquery.embedly.min','text!templates/professorRegistration.tpl','text!templates/professorRegistrationSyllabus.tpl','../model/professorRegistration','../model/testQuizesDeadlines'],
  function(BaseView, MaskedInput, JqueryEmbedly, ProfessorRegistration, ProfessorRegistrationSyllabus, Professor, TestQuizesDeadlines){
  var Registration;
  Registration = BaseView.extend({
    events: {
      'click .submit' : 'submitCreateStream',
      'click .invite' : 'submitInviteOthers',
      'click .days-of-week' : 'addActiveClass',
      'click .add-grade' : 'addGrade',
      'click .remove-grade' : 'removeGrade',
      'click .edit-grade' : 'editGrade',
      'click .save-grade' : 'saveGrade',
      'click .add' : 'addPercentage',
      'click .minus' : 'subtractPercentage',
      'keyup .class-intro-textarea' : 'classInfoTextareaIsComplete',
      'keyup .attendance-makeup-work' : 'attendanceTextareaIsComplete',
      'click .add-link' : 'addResourceLink',
      'click .add-attachemnt' : 'addAttachment',
      'keyup #cellNumber' : 'formatCellNumber',
      'click .add-resource' : 'renderResourcePreview',
      'click .closeResourcePreview' : 'removeResourcePreview',
      'click .add-test-quiz-deadline' : 'addTestQuizDeadline',
      'click .remove-tqdResource' : 'removeTestQuizDeadlineResource'
    },

    initialize: function(){
      this.model = new Professor;
      this.model.on('change', this.render, this); // not needed but used to show console log on line 19
      this.render();
    },

    render: function(){
      compiledClasInformationTemplate = Handlebars.compile(ProfessorRegistration);
      compiledSyllabusTemplate = Handlebars.compile(ProfessorRegistrationSyllabus);
      this.$el.html(compiledClasInformationTemplate).append(compiledSyllabusTemplate);
      console.log('my model ',this.model.attributes) // what is currently in the model
      return this;
    },

    submitInviteOthers: function(e) {
      e.preventDefault();
      console.log('invite others!');
    },

    submitCreateStream: function(e) {
      e.preventDefault();
      this.model.set({
        schoolName: this.$el.find('input[name="school-name"]').val(),
        streamName: this.$el.find('input[name="streamName"]').val(),
        classCode: this.$el.find('input[name="classCode"]').val(),
        classTime: this.$el.find('input[name="classTime"]').val(),
        daysOfWeek: this.$el.find('input[name="daysofWeek"]').val(),
        termTimeFrame: this.$el.find('select[name="termTimeFrame"]').val(),
        email: this.$el.find('input[name="email"]').val(),
        cellNumber: this.$el.find('input[name="cellNumber"]').val(),
        officeHours: this.$el.find('input[name="officeHours"]').val(),
        days: this.$el.find('input[name="days"]').val(),
        classAccess: this.$el.find('input[name="classAccess"]').val(),
        classIntro: this.$el.find('input[name="classIntro"]').val(),
        gradesDetermined: this.$el.find('input[name="gradesDetermined"]').val(),
        studyResources: this.$el.find('input[name="studyResources"]').val(),
        testsQuizesDeadlines: this.$el.find('input[name="testsQuizesDeadlines"]').val(),
        attendanceAndMakeup: this.$el.find('input[name="attendanceAndMakeup"]').val()
      }, {silent: true});
      this.model.trigger('classSaved')
    },

    addActiveClass: function(e){
      e.preventDefault();
      $(e.target).toggleClass('active');
      var day = $(e.target).attr('name');
      this.model.toggleDay(day);
    },

    addGrade: function(e){
      e.preventDefault();
      var gradeTitle = this.$el.find('input[name="graded-for"]').val();
      if(gradeTitle.length === 0){ return; };
      this.$el.find('input[name="graded-for"]').val('').focus();
      var gradePercentageButtons = '<div class="btn-group"><button class="btn btn-small minus" name="minus">-</button><button class="btn btn-small percentage-display"><span class="percentage">20</span>%</button><button class="btn btn-small add" name="plus">+</button></div>';
      var gradeCriteriaDiv = '<div class="grade-criteria">TYPE: <span class="grade-title">  '+gradeTitle+'</span> <span class="amount">AMOUNT: '+gradePercentageButtons+' <i class="icon-pencil icon-large edit-grade"></i> <i class="icon-remove icon-large remove-grade"></i></span></div>';
      $('.add-graded-for').prepend(gradeCriteriaDiv);
      this.model.addGrade(gradeTitle,20);
      // Add completed text
      if($('.grade-criteria').length > 0){ $(e.target).closest('.accordion-group').find('.completed').css({'display':'block'})};
    },

    removeGrade: function(e){
      e.preventDefault();
      if($('.grade-criteria').length === 1){ $(e.target).closest('.accordion-group').find('.completed').css({'display':'none'})};
      var grade = $(e.target).closest('.grade-criteria').find('.grade-title').text().trim();
      this.model.removeGrade(grade);
      $(e.target).parent().parent().remove();
    },

    removeTestQuizDeadlineResource: function(e){
      e.preventDefault();
      var resourceTitle = $(e.target).parent().find('#test-quiz-title').text();
      this.model.removeTestsQuizesDeadlines(resourceTitle);
      if($('.grade-criteria').length === 1){ $(e.target).closest('.accordion-group').find('.completed').css({'display':'none'})};
      $(e.target).parent().remove();
    },

    editGrade: function(e){
      e.preventDefault();
      var gradeVal = $(e.target).parent().parent().find('.grade-title').text();
      $(e.target).parent().parent().find('.grade-title').html('<input class="grade-edit" type="text" value="'+gradeVal+'">').focus();
      $(e.target).replaceWith('<i class="icon-pencil icon-large save-grade"></i>');
    },

    saveGrade: function(e){
      e.preventDefault();
      var savedGrade = $(e.target).parent().parent().find('.grade-edit').val();
      $(e.target).parent().parent().find('.grade-title').html(savedGrade);
      $(e.target).replaceWith('<i class="icon-pencil icon-large edit-grade"></i>');
    },

    addPercentage: function(e){
      e.preventDefault();
      var currentPercentage = parseInt($(e.target).parent().find('.percentage').text());
      if(currentPercentage < 100){
        $(e.target).parent().find('.percentage').text(currentPercentage + 1);
      };
    },

    subtractPercentage: function(e){
      e.preventDefault();
      var currentPercentage = parseInt($(e.target).parent().find('.percentage').text());
      if (currentPercentage > 0) {
        $(e.target).parent().find('.percentage').text(currentPercentage - 1);
      };
    },

    classInfoTextareaIsComplete: function(e){
      var textAreaLength = $(e.target).closest('.class-intro-textarea').val().length;
      if(textAreaLength === 0) {
        $(e.target).closest('.accordion-group').find('.completed').css({'display':'none'});
      };
      if(textAreaLength > 0) {
        $(e.target).closest('.accordion-group').find('.completed').css({'display':'block'});
      };
    },

    attendanceTextareaIsComplete: function(e){
      var textAreaLength = $(e.target).closest('.attendance-makeup-work').val().length;
      if(textAreaLength === 0) { $(e.target).closest('.accordion-group').find('.completed').css({'display':'none'})};
      if(textAreaLength > 0) { $(e.target).closest('.accordion-group').find('.completed').css({'display':'block'})};
    },

    addResourceLink: function(e) {
      e.preventDefault();
      $('#url').preview({key:'4d205b6a796b11e1871a4040d3dc5c07'});
      $(".addResourceLinkToSyllabus").on("click", this.submitResourceLink);
      $( "#dialog-modal" ).dialog("open");
    },

    addAttachment: function(e) {
      e.preventDefault();
      var newwindow = window.open('uploadNow/upload','name','height=400,width=400');
      if (window.focus) {newwindow.focus()}
    },

    formatCellNumber: function(e) {
      e.preventDefault();
      $("#cellNumber").setMask('(999) 999-9999');
    },

    submitResourceLink: function(e) {
      e.preventDefault();
      var imageNumber;
      var leftPixels = parseInt($(e.target).closest('#dialog-modal').find(".images").css('left'));
      if(leftPixels < 0) {
        imageNumber = Math.abs(leftPixels/100) + 1; // find which image is currently being displayed
      } else {
        imageNumber = 1;
      }
      var previewImage = $(e.target).closest('#dialog-modal').find( ".images li:nth-child(" + imageNumber + ") img" ).attr( "src" );
      var link = $('#url').val();
      $( "#dialog-modal" ).dialog("close");
      if(link !== undefined) {
        var linkDiv = $('<div>'+link+'</div>');
        linkDiv.addClass('resource-link').hide();
        $('.study-resources').prepend('<input type="hidden" id="resourceLink" value="'+link+'" />');
      }
    },

    renderResourcePreview: function(e) {
      var linkHeader = $('.resource-title').val();
      var resourceDiv = '<div class="resource">'+ linkHeader + ' <i class="icon-remove icon-large closeResourcePreview"></i></div>';
      if(linkHeader.length !== 0){
        $('.study-resources').prepend(resourceDiv);
      };
      if($('.resource').length > 0){ $(e.target).closest('.accordion-group').find('.completed').css({'display':'block'})};
      return false;
    },

    removeResourcePreview: function(e) {
      e.preventDefault();
      if($('.resource').length === 1){ $(e.target).closest('.accordion-group').find('.completed').css({'display':'none'})};
      $(e.target).parent().remove();
    },

    addTestQuizDeadline: function(e) {
      e.preventDefault();
      var resourceTitle = $(e.target).parent().find('.resource-title').val();
      var resourceType = $(e.target).parent().find('select').val();
      var dueDate =  $(e.target).parent().find('#datepicker').val();
      this.model.addTestsQuizesDeadlines(resourceTitle,resourceType,dueDate);
      this.renderTestQuizDeadlinesResource();
      return false;
    },

    renderTestQuizDeadlinesResource: function(e) {
      var title = $('.test-quizes-form-container').find('.resource-title').val();
      var type = $('.test-quizes-form-container').find('select').val();
      var date = $('#datepicker').val();
      var resourcePreview = '<div class="grade-criteria"><span id="test-quiz-title">' + title + '</span> ' + type + ' ' + date +' <i class="icon-remove icon-large remove-tqdResource"></i></span></div>';
      $('.test-quizes-form-container').prepend(resourcePreview);
    }

  })
  return Registration;
});
