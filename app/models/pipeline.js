import Ember from 'ember'
import Resource from 'ember-api-store/models/resource';
import { download } from 'ui/utils/util';

const ENUMS_STATUSCLASS = {
  'true': 'bg-success',
  'false': 'bg-info',
};

export default Resource.extend({
  type: 'pipeline',
  pipelineStore: Ember.inject.service('pipeline-store'),
  router: Ember.inject.service(),
  actions: {
    run: function() {
      return this.doAction('run')
        .then((res) => {
          this.get('router').transitionTo('pipelines.activity', res.id)
        });
    },
    duplicate: function() {
      this.get('router').transitionTo('pipelines.pipeline', this.get('id'), {
        queryParams: {
          mode: 'duplicate'
        }
      })
    },
    edit: function() {
      this.get('router').transitionTo('pipelines.pipeline', this.get('id'))
    },
    remove: function() {
      return this.doAction('remove').then(()=>{
        var store = this.get('pipelineStore');
        store._remove('pipeline',this);
      });
    },
    activate: function() {
      return this.doAction('activate');
    },
    deactivate: function() {
      return this.doAction('deactivate');
    },
    exportConfig: function() {
      download(this.linkFor('exportConfig'));
    },
    viewCode: function() {
      this.get('application').transitionToRoute('pipelines.view-config',this.get('id'));
    },
  },
  availableActions: function() {
    var isActivate = this.get('isActivate')
    let l = this.get('links');
    return [
      { label: 'action.run', icon: 'icon icon-play', action: 'run', enabled: true },
      { divider: true },
      { label: 'action.edit', icon: 'icon icon-edit', action: 'edit', enabled: true },
      { label: 'action.clone', icon: 'icon icon-copy', action: 'duplicate', enabled: true },
      { divider: true },
      { label:   'action.viewConfig',     icon: 'icon icon-files',          action: 'viewCode',         enabled: !!l.exportConfig },
      { label:   'action.exportConfig',   icon: 'icon icon-download',       action: 'exportConfig',     enabled: !!l.exportConfig },
      { divider: true },
      { label: 'action.activate', icon: 'icon icon-copy', action: 'activate', enabled: isActivate ? false : true },
      { label: 'action.deactivate', icon: 'icon icon-copy', action: 'deactivate', enabled: isActivate ? true : false },
      { divider: true },
      { label: 'action.remove', icon: 'icon icon-trash', action: 'remove', enabled: true },
    ];
  }.property('actions.{run,remove}', 'isActivate'),

  validationErrors() {
    var errors = []
    if (!this.get('name')) {
      errors.push('"Pipeline Name" is required');
    }
    var allStageNotEmpty = true
    var stages = this.get('stages');
    for(var i=0; i<stages.length;i++){
      var item = stages[i]
      if(!item.steps||item.steps.length===0){
        allStageNotEmpty = false
        break;
      }
    }
    if(!allStageNotEmpty){
      errors.push('Stage must contain at least one Step');
    }
    return errors;
  },
  images: function() {
    var images = [];
    var stages = this.get('stages');
    for (var i = 0; i < stages.length; i++) {
      var item = stages[i].steps;
      for(var j=0; j< item.length;j++){
        var itemJ = item[j];
        if(itemJ.type==="task"){
          var exist = images.findIndex(ele=>ele===itemJ.image);
          (exist===-1)&&images.push(itemJ.image);
        }
        if(itemJ.type==="build"){
          exist = images.findIndex(ele=>ele===itemJ.targetImage);
          (exist===-1)&&images.push(itemJ.targetImage);
        }
      }
    }
    return images;
  }.property('stages.@each.{steps.@each}'),
  repository: function() {
    return this.get('stages')[0].steps[0].repository
  }.property('stages'),
  branch: function() {
    return this.get('stages')[0].steps[0].branch
  }.property('stages'),
  statusClass: function() {
    var status = this.get('isActive')+'';
    return ENUMS_STATUSCLASS[status];
  }.property('isActive'),

});
