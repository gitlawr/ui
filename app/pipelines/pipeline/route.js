import Ember from 'ember';

export default Ember.Route.extend({
  pipeline: Ember.inject.service(),
  queryParams: {
    mode: {
      refreshModel: true
    },
  },
  model: function(params) {
    var pipelineSvc = this.get('pipeline');
    if(!pipelineSvc.ready||!pipelineSvc.ready.ready){
      return null
    }
    var pipelineStore = this.get('pipelineStore');
    var pipeline = pipelineStore.find('pipeline',params.pipeline_id);
    return Ember.RSVP.hash({
        pipeline: pipeline
      }).then(({pipeline})=>{
        return {
          pipeline: pipelineStore.createRecord(pipeline.serialize())
        }
      });
  }
});
