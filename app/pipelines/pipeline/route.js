import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    mode: {
      refreshModel: true
    },
  },
  model: function(params) {
    var pipelineStore = this.get('pipelineStore');
    var pipeline = pipelineStore.find('pipeline',params.pipeline_id);
    return Ember.RSVP.hash({
        pipeline: pipeline
      }).then(({pipeline})=>{
        if(params.mode==='duplicate'){
          var newPipeline = pipelineStore.createRecord({
            type: 'pipeline',
            stages: pipeline.serialize().stages
          });
          return {
            pipeline: newPipeline
          };
        }
        return {
          pipeline: pipeline
        };
      });
  }
});
