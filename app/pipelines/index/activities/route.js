import Ember from 'ember';
import C from 'ui/utils/constants';

export default Ember.Route.extend({
  queryParams: {
    status: {
      refreshModel: true
    },
  },
  pipeline: Ember.inject.service(),
  model: function(params) {
    var status = params.status
    var pipelineStore = this.get('pipelineStore');
    var model = pipelineStore.findAll('activity',null,{forceReload:true});
    return model
  }
});
