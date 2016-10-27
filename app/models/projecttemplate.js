import Ember from 'ember';
import Resource from 'ember-api-store/models/resource';
import PolledResource from 'ui/mixins/cattle-polled-resource';

var ProjectTemplate = Resource.extend(PolledResource, {
  access: Ember.inject.service(),

  actions: {
    edit: function() {
      this.get('router').transitionTo('settings.projects.edit-template', this.get('id'));
    },
  },

  displayStacks: function() {
    return (this.get('stacks')||[]).map((s) => s.get('name')).join(', ');
  }.property('stacks.@each.name'),

  canEdit: function() {
    return !this.get('isPublic') || this.get('access.admin');
  }.property('access.admin','isPublic'),

  availableActions: function() {
    var choices = [
      { label: 'action.edit',             icon: 'icon icon-edit',         action: 'edit',         enabled: this.get('canEdit')},
//      { label: 'action.clone',            icon: 'icon icon-copy',         action: 'clone',        enabled: true},
      { divider: true },
      { label: 'action.remove',           icon: 'icon icon-trash',        action: 'promptDelete', enabled: this.get('canEdit'), altAction: 'delete' },
      { label: 'action.viewInApi',        icon: 'icon icon-external-link',action: 'goToApi',      enabled: true },
    ];


    return choices;
  }.property('canEdit'),

  icon: 'icon icon-file',
});

// Projects don't get pushed by /subscribe WS, so refresh more often
ProjectTemplate.reopenClass({
  pollTransitioningDelay: 1000,
  pollTransitioningInterval: 5000,
});

export default ProjectTemplate;
