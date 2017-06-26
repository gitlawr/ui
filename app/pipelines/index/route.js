import Ember from 'ember';
import C from 'ui/utils/constants';

export default Ember.Route.extend({
	pipeline: Ember.inject.service(),
  model: function() {
    var pipelineStore = this.get('pipelineStore');
    pipelineStore.find('pipeliens');
    var model = pipelineStore.find('pipelines',null, {url: this.get('pipelineStore.baseUrl')+'/pipelines', forceReload: true, filter: {all: 'false'}});
    return model
  },
  // setDefaultRoute: Ember.on('activate', function() {
  //   this.set(`session.${C.SESSION.CONTAINER_ROUTE}`,'containers');
  // })
});
