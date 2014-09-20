define(['baseModel', '../model/gradesDetermined','../model/testQuizesDeadlines', '../model/daysOfWeek'], function(BaseModel, GradesDetermined, TestQuizesDeadlines, DaysOfWeek) {

  var TestsQuizesDeadlinesCollection = Backbone.Collection.extend({model:TestQuizesDeadlines});
  var DaysOfWeekCollection = Backbone.Collection.extend({model:DaysOfWeek});
  var GradesDeterminedCollection = Backbone.Collection.extend({model:GradesDetermined});

  var Professor = BaseModel.extend({
    url: '/professorRegistration',
    defaults: {
      schoolName: '',
      streamName: '',
      classCode: '',
      classTime: '',
      daysOfWeek: new DaysOfWeekCollection(),
      termTimeFrame: '',
      email: '',
      cellNumber: '',
      officeHours: '',
      days: '',
      classAccess: '',
      classIntro: '',
      gradesDetermined: new GradesDeterminedCollection(),
      studyResources: '',
      testsQuizesDeadlines: new TestsQuizesDeadlinesCollection(),
      attendanceAndMakeup: ''
    },
    initialize: function() {
      // this.on('classSaved', this.save);
      this.on('classSaved', this.checkContents);
    }, 

    addTestsQuizesDeadlines: function(resourceTitle,resourceType,dueDate) {
      var TestsQuizesDeadlinesCollection = this.get('testsQuizesDeadlines');
      var resource = new TestQuizesDeadlines;
      resource.set({
        'resourceTitle': resourceTitle,
        'resourceType': resourceType,
        'dueDate': dueDate},
      {silent: true});
      TestsQuizesDeadlinesCollection.add(resource);
    },

    removeTestsQuizesDeadlines: function(resourceTitle) {
      var TestsQuizesDeadlinesCollection = this.get('testsQuizesDeadlines');
      var that = this;
      var resource = TestsQuizesDeadlinesCollection.find(function(that) { return that.get('resourceTitle') === resourceTitle; });
      TestsQuizesDeadlinesCollection.remove(resource);
    },

    toggleDay: function(day) {
      var DaysOfWeekCollection = this.get('daysOfWeek');
      var that = this;
      var resource = DaysOfWeekCollection.find(function(that) { return that.get('day') === day; });
      if(resource === undefined) {
        var newDay = new TestQuizesDeadlines;
        newDay.set({'day': day},{silent: true});
        DaysOfWeekCollection.add(newDay);
      } else {
        DaysOfWeekCollection.remove(resource);
      }
    },

    addGrade: function(title,amount){
      var GradesDeterminedCollection = this.get('gradesDetermined');
      var grade = new TestQuizesDeadlines;
      grade.set({
        'title': title,
        'amount': amount},
      {silent: true});
      GradesDeterminedCollection.add(grade);
    },

    removeGrade: function(gradeToDelete) {
      var GradesDeterminedCollection = this.get('gradesDetermined');
      var that = this;
      var grade = GradesDeterminedCollection.find(function(that) { return that.get('title') === gradeToDelete; });
      GradesDeterminedCollection.remove(grade);
    },

    checkContents: function() {
      // this.save() // for when the backend is set up
    }
  });



  return Professor;
});