import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var pipelineStore = this.get('pipelineStore');
    var pipeline = pipelineStore.find('pipeline',params.pipeline_id)
    return Ember.RSVP.hash({
        pipeline: pipeline
      }).then(({pipeline})=>{
        return {
          pipeline
        }
      });
  }
});