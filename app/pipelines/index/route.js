import Ember from 'ember';
import C from 'ui/utils/constants';

export default Ember.Route.extend({
	pipeline: Ember.inject.service(),
  model: function() {
    var store = this.get('store');
    var url = this.get('pipeline').get('pipelinesEndpoint');
    var model = store.find('pipeline', null, {url: url+'/pipelines', forceReload: true, filter: {all: 'false'}});
    return model
  },
  setDefaultRoute: Ember.on('activate', function() {
    this.set(`session.${C.SESSION.CONTAINER_ROUTE}`,'containers');
  })
});
