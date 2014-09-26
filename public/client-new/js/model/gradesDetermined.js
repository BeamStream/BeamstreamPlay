define(['baseModel'], function(BaseModel) {
  var GradesDetermined = BaseModel.extend({
    defaults: {
      title: '',
      amount: 0
    }
  });

  return GradesDetermined;
});