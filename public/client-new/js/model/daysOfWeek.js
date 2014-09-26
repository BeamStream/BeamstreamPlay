define(['baseModel'], function(BaseModel) {
  var DaysOfWeek = BaseModel.extend({
    defaults: {
      day: ''
    }
  });

  return DaysOfWeek;
});