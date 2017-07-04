import Ember from 'ember';

export default Ember.Route.extend({
  pipeline: Ember.inject.service(),
  model: function(params) {
    var pipelineStore = this.get('pipelineStore');
    var activities = pipelineStore.find('activity',params.pipeline_id)
    return Ember.RSVP.hash({
        activities: activities
      }).then(({activities})=>{
        return {
          activities
        }
      });
  },
});
