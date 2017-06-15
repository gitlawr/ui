import Ember from 'ember';

export default Ember.Route.extend({
	pipeline: Ember.inject.service(),
  model: function(params) {
    var store = this.get('store');
    var url = this.get('pipeline').get('pipelinesEndpoint');
    var model = store.find('pipeline', null, {url: url+`/pipelines/${params.pipeline_id}`, forceReload: true, filter: {all: 'false'}});
    return model.then(function(res){
      return Ember.Object.create({
          pipeline: res
        });
    });
  }
});