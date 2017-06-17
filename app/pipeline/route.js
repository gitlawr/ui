import Ember from 'ember';

export default Ember.Route.extend({
  pipeline: Ember.inject.service(),
  model: function(params) {
    var store = this.get('store');
    var url = this.get('pipeline').get('pipelinesEndpoint');
    var model = store.find('pipeline', null, { url: url + `/pipelines/${params.pipeline_id}`, forceReload: true, filter: { all: 'false' } });
    var pipline;
    return model.then((res) => {
      pipline = res;
      return Ember.RSVP.hash({
        activities: pipline.followLink('activitys')
      });
    }).then((hash) => {
      return {
        pipeline: pipline,
        activities: hash.activities
      }
    });
  },
});
