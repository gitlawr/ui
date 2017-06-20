import Ember from 'ember';
import NewOrEdit from 'ui/mixins/new-or-edit';
import ModalBase from 'ui/mixins/modal-base';

var convertObjectToArry = function(obj) {
  var arry = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var value = obj[key]
      arry.push(key + '=' + value)
    }
  }
  return arry;
};

export default Ember.Component.extend(ModalBase, NewOrEdit, {
  classNames: ['large-modal', 'alert'],
  modalOpts: Ember.computed.alias('modalService.modalOpts'),
  model: null,
  errors: null,
  editingModels: {},
  init() {
    this._super(...arguments);

    var opts = this.get('modalOpts');
    var objectParameter = {};

    if (opts.params) {
      if(opts.params.parameters){
        for (var i = 0; i < opts.params.parameters.length; i++) {
          var value = opts.params.parameters[i].split('=');
          var k = value[0];
          var v = value[1];
          objectParameter[k] = v;
        }
      }
      this.set('model', {
        ...opts.params,
        stageInfo: opts.stageInfo,
        stageIndex: opts.stageIndex,
        parameters: objectParameter
      });
    } else {
      this.set('model', {
        type: 'task',
        image: null,
        command: null,
        name: '',
        parameters: {}
      })
    }
  },
  observeTypeChange: function(){
    var type = this.get('model.type');
    console.log(type)
  }.observes('model.type'),
  editing: function() {
    return this.get('modalOpts.type') === 'edit' ? true : false
  }.property('modalOpts.type'),

  doneSaving() {
    this.send('cancel');
  },
  actions: {
    add: function(success) {
      var model = this.get('model')
      var arryParameters = convertObjectToArry(model.parameters)
      this.get('modalOpts').cb({
        ...this.get('model'),
        parameters: arryParameters
      });
      this.send('cancel');
    },
    edit: function() {
      var arryParameters = convertObjectToArry(model.parameters)
      this.get('modalOpts').cb({
        ...this.get('model'),
        parameters: arryParameters
      });
      this.send('cancel');
    },
    remove: function() {
      this.get('modalOpts').rmCb();
      this.send('cancel');
    }
  }
});
