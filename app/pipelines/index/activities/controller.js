import Ember from 'ember';
export default Ember.Controller.extend({
  sortBy:'start_ts',
  filtered: function() {
    let out = this.get('model').map(ele=>{
      return {
        ...ele,
        name: ele.pipeline.name,
        repository: ele.pipeline.stages[0].steps[0].repository,
        branch: ele.pipeline.stages[0].steps[0].branch,
      }
    });
    return out;
  }.property('model.@each.status'),
});
