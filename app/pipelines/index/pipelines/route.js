import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    status: {
      refreshModel: true
    },
  },
  model: function() {
    var pipelineStore = this.get('pipelineStore');
    var model = pipelineStore.findAll('pipeline',null,{forceReload: true});
    return model
  }
});
