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
    duplicate: function(){
      this.get('router').transitionTo('pipelines.pipeline', this.get('id'),{queryParams:{
        mode:'duplicate'
      }})
    },
    edit: function(){
      this.get('router').transitionTo('pipelines.pipeline', this.get('id'))
    },
    remove: function(){
      return this.doAction('remove')
      .then((res)=>{
        
      });
    },
    activate: function(){
      return this.doAction('activate')
      .then((res)=>{
        
      });
    },
    deactivate: function(){
      return this.doAction('deactivate')
      .then((res)=>{
        
      });
    }
  },
  availableActions: function() {
    var isActivate = this.get('isActivate')
    return [
      { label: 'action.run',          icon: 'icon icon-play',   action: 'run',         enabled: true },
      { divider: true },
      { label: 'action.edit',          icon: 'icon icon-edit',   action: 'edit',         enabled: true },
      { label: 'action.duplicate',          icon: 'icon icon-copy',   action: 'duplicate',         enabled: true },
      { divider: true },
      { label: 'action.activate',          icon: 'icon icon-copy',   action: 'activate',         enabled: isActivate?false: true },
      { label: 'action.deactivate',          icon: 'icon icon-copy',   action: 'deactivate',         enabled: isActivate?true: false },
      { divider: true },
      { label: 'action.remove',      icon: 'icon icon-trash',   action: 'remove',     enabled: true },
    ];
  }.property('actions.{run,remove}','isActivate'),

  validationErrors(){
    var errors=[]
    if(!this.get('name')){
      errors.push('"Pipeline Name" is required')
    }
    return errors;
  }
});
