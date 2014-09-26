define(['baseModel'], function(BaseModel) {
  var TestQuizesDeadlines = BaseModel.extend({
    defaults: {
      resourceTitle: '',
      resourceType: '',
      dueDate: ''
    }
  });

  return TestQuizesDeadlines;
});