import Ember from 'ember';
import NewOrEdit from 'ui/mixins/new-or-edit';
import ModalBase from 'ui/mixins/modal-base';

export default Ember.Component.extend(ModalBase, NewOrEdit, {
  classNames: ['large-modal', 'alert'],
  originalModel: Ember.computed.alias('modalService.modalOpts'),
  settings: Ember.inject.service(),

  clone           : null,
  primaryResource : Ember.computed.alias('originalModel'),
  errors          : null,

  init() {
    this._super(...arguments);
    console.log(this.get('originalModel'))
    this.set('model', this.get('originalModel'));
    Ember.run.scheduleOnce('afterRender', () => {
      this.$('INPUT')[0].focus();
    });
  },

  editing: function() {
    return !!this.get('clone.id');
  }.property('clone.id'),

  doneSaving() {
    this.send('cancel');
  }
});
