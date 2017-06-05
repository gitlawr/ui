import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var store = this.get('store');
    var model = store.find('pipeline', null, {url: 'pipelines', forceReload: true, filter: {all: 'false'}});
    return model
  },
});
