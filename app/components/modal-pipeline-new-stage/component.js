import Ember from 'ember';
import NewOrEdit from 'ui/mixins/new-or-edit';
import ModalBase from 'ui/mixins/modal-base';

export default Ember.Component.extend(ModalBase, NewOrEdit, {
  classNames: ['large-modal', 'alert'],
  modalOpts: Ember.computed.alias('modalService.modalOpts'),
  settings: Ember.inject.service(),
  model: null,
  clone: null,
  primaryResource: Ember.computed.alias('originalModel'),

  init() {
    this._super(...arguments);
    var opts = this.get('modalOpts');
    if (opts.mode === "edit") {
      this.set('model', opts.stage);
      this.set('editing', true)
    } else {
      this.set('model', {
        id: null,
        name: null,
        steps: []
      })
    }
  },
  editing: false,
  doneSaving() {
    this.send('cancel');
  },

  actions: {
    add: function(success) {
      success(true);
      this.get('modalOpts').cb({
        ...this.get('model'),
        id: Date.now()
      });
      this.send('cancel');
    },
    edit: function(success) {
      success(true)
      this.get('modalOpts').cb({
        ...this.get('model'),
        id: Date.now()
      })
      this.send('cancel');
    },
    remove: function() {
      this.get('modalOpts').rmCb();
      this.send('cancel');
    }
  }
});
