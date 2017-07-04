import Ember from 'ember';
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

class StepType {
  constructor(type, val) {
    switch (type) {
      case 'scm':
        this.type = 'scm'
        this.repository = ''
        this.branch = ''
        break
      case 'task':
        this.type = 'task'
        this.image = '',
          this.command = '',
          this.name = '',
          this.parameters = {}
        break
    }
    if (val && typeof val === 'object') {
      for (var item in val) {
        if (val.hasOwnProperty(item)) {
          this[item] = val[item]
        }
      }
    }
  }
}

var validationErrors = (module)=>{
  var errors=[]
  switch(module.type){
    case 'scm':
      if(module.repository.indexOf('.git')===-1){
        errors.push('Repository should be a valid git address!')
      }
      break;
    case 'task':
      if(module.image.trim()===''){
        errors.push('"Image" is required!')
      }
    default:
      break;
  }
  return errors
}
export default Ember.Component.extend(ModalBase, {
  classNames: ['large-modal', 'alert'],
  modalOpts: Ember.computed.alias('modalService.modalOpts'),
  model: null,
  type: 'task',
  errors: null,
  editingModels: Ember.Object.create({}),
  init() {
    this._super(...arguments);

    var opts = this.get('modalOpts');
    var objectParameter = {};
    var type = this.get('type')
    if (opts.params) {
      if (opts.params.parameters) {
        for (var i = 0; i < opts.params.parameters.length; i++) {
          var value = opts.params.parameters[i].split('=');
          var k = value[0];
          var v = value[1];
          objectParameter[k] = v;
        }
      }
      this.set('type', opts.params.type)
      var model = new StepType(opts.params.type, {
        ...opts.params,
        parameters: objectParameter
      })
      this.get('editingModels').set(opts.params.type, model);
    } else {
      if (opts.stepMode === 'scm') {
        this.set('type', 'scm')
      }
      this.get('editingModels').set(this.get('type'), new StepType(this.get('type')))
    }
  },
  observeTypeChange: function() {
    var type = this.get('type');
    var models = this.get('editingModels')
    models[type] || models.set(type, new StepType(type))
  }.observes('type'),

  editing: function() {
    return this.get('modalOpts.type') === 'edit' ? true : false
  }.property('modalOpts.type'),

  doneSaving() {
    this.send('cancel');
  },
  actions: {
    add: function(success) {
      var model = this.get('editingModels')[this.get('type')]
      var errors = validationErrors(model)
      if(errors.length>0){
        this.set('errors',errors)
        success(false)
        return true
      }
      var arryParameters = convertObjectToArry(model.parameters)
      this.get('modalOpts').cb({
        ...model,
        parameters: arryParameters
      });
      this.get('modalService').toggleModal();
    },
    edit: function() {
      var arryParameters = convertObjectToArry(model.parameters)
      this.get('modalOpts').cb({
        ...this.get('editingModels')[this.get('type')],
        parameters: arryParameters
      });
      this.get('modalService').toggleModal();
    },
    remove: function() {
      this.get('modalOpts').rmCb();
      this.get('modalService').toggleModal();
    },
    cancel: function() {
      var type = this.get('type')
      debugger
      if (type === "scm"&&!this.get('modalOpts.params.repository')) {
        this.get('router').transitionTo('pipelines.index.pipelines')
      }
      this.get('modalService').toggleModal();
    }
  }
});
