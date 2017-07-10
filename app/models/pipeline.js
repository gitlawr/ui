import Resource from 'ember-api-store/models/resource';

export default Resource.extend({
  type: 'pipeline',
  router: Ember.inject.service(),
  actions:{
    run: function() {
      return this.doAction('run')
      .then((res)=>{
        this.get('router').transitionTo('pipelines.activity', res.id)
      });
    },
    edit: function(){
      this.get('router').transitionTo('pipelines.pipeline', this.get('id'))
    },
    remove: function(){
      return this.doAction('remove')
      .then((res)=>{
        
      });
    }
  },
  availableActions: function() {
    var a = this.get('actions');

    return [
      { label: 'action.run',          icon: 'icon icon-play',   action: 'run',         enabled: true },
      { divider: true },
      { label: 'action.edit',          icon: 'icon icon-edit',   action: 'edit',         enabled: true },
      { divider: true },
      { label: 'action.remove',      icon: 'icon icon-trash',   action: 'remove',     enabled: true },
    ];
  }.property('actions.{run,remove}'),

  validationErrors(){
    var errors=[]
    if(!this.get('name')){
      errors.push('"Pipeline Name" is required')
    }
    return errors;
  }
});
