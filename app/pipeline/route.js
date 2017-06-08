import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var store = this.get('store');
    var model = store.find('pipeline', null, {url: `pipelines/${params.pipeline_id}`, forceReload: true, filter: {all: 'false'}});
    return model.then(function(res){
      return Ember.Object.create({
          pipeline: res
        });
    });
  },
});