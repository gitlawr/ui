import Ember from 'ember';
import NewOrEdit from 'ui/mixins/new-or-edit';
import ModalBase from 'ui/mixins/modal-base';

export default Ember.Component.extend(ModalBase, NewOrEdit, {
  classNames: ['large-modal', 'alert'],
  addStepFn: Ember.computed.alias('modalService.modalOpts'),
  model           : {
    type: 'task',
    image: 'busybox',
    command: 'sh',
    name: 'haha',
    variables: [
      {
        k: 'test',
        v: 'bar'
      }
    ]
  },
  clone           : null,
  errors          : null,

  init() {
    this._super(...arguments);
  },

  editing: function() {

  }.property('clone.id'),

  doneSaving() {
    this.send('cancel');
  },
  actions: {
    add: function(success){
      this.get('addStepFn')(this.get('model'))
      this.send('cancel');
    }
  }
});
