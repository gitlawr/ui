import Ember from 'ember';
import NewOrEdit from 'ui/mixins/new-or-edit';
import ModalBase from 'ui/mixins/modal-base';

export default Ember.Component.extend(ModalBase, NewOrEdit, {
  classNames: ['large-modal', 'alert'],
  modalOpts: Ember.computed.alias('modalService.modalOpts'),
  model: null,
  errors: null,

  init() {
    this._super(...arguments);
    
    var opts = this.get('modalOpts');
    if(opts.params){
      this.set('model',{...opts.params});
    }else{
      this.set('model', {
        type: 'task',
        image: null,
        command: null,
        name: '',
        variables: {}
      })
    }
  },

  editing: function() {
    return this.get('modalOpts.type') === 'edit' ? true : false
  }.property('modalOpts.type'),

  doneSaving() {
    this.send('cancel');
  },
  actions: {
    add: function(success) {
      this.get('modalOpts').cb({
        ...this.get('model')
      });
      this.send('cancel');
    },
    edit: function(){
      this.get('modalOpts').cb({
        ...this.get('model')
      });
      this.send('cancel');
    }
  }
});
