import Ember from 'ember';

export default Ember.Route.extend({
  pipeline: Ember.inject.service(),
  queryParams: {
    status: {
      refreshModel: true
    },
  },
  model: function() {
    var pipeline = this.get('pipeline');
    if (!pipeline.ready || !pipeline.ready.ready) {
      return null
    }
    var pipelineStore = this.get('pipelineStore');
    var model = pipelineStore.find('setting',null,{forceReload: true});
    // return model
    return Ember.RSVP.hash({
        model: model
      }).then(({model})=>{
        return {
          settings: pipelineStore.createRecord(model.serialize())
        }
      });
  }
});
