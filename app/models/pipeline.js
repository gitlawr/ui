import Resource from 'ember-api-store/models/resource';

export default Resource.extend({
  type: 'pipeline',
  router: Ember.inject.service(),
  actions:{
    run: function() {
      return this.doAction('run')
      .then((res)=>{
        this.get('router').transitionTo('pipelines.activity', res.data.id)
      });
    }
  },
  availableActions: function() {
    var a = this.get('actions');

    return [
      { label: 'action.run',          icon: 'icon icon-play',   action: 'run',         enabled: true },
      // { divider: true },
      // { label: 'action.upgrade',      icon: 'icon icon-edit',   action: 'update',     enabled: true },
    ];
  }.property('actions.{run,update}'),

  validationErrors(){
    var errors=[]
    if(this.get('name')===''){
      errors.push('"Pipeline Name" is required')
    }
    return errors;
  }
});
