import CodeMirror from 'codemirror';
import Service from 'ember-service';

export default Service.extend({
  init() {
    this._super(...arguments);
    this._instances = Object.create(null);
  },
  hintAry: [],
  fromTextArea(id, textarea) {
    return this.registerInstance(id, CodeMirror.fromTextArea(textarea));
  },

  instanceFor(id) {
    return this._instances[id];
  },

  registerInstance(id, instance) {
    this._instances[id] = instance;

    return instance;
  },

  signal(emitter, type, ...values) {
    CodeMirror.signal(emitter, type, ...values);
  },

  unregisterInstance(id) {
    delete this._instances[id];
  },
  getMatchedHint(value, editor){
    var hintAry = this.get('hintAry');
    var cursorPosition = editor.getCursor().ch;
    this.set('cursorPosition',cursorPosition);
    var cursorValue = editor.getLine(editor.lastLine()).slice(0, cursorPosition);
    
    var matched = false;
    var _$value = cursorValue.lastIndexOf('$');
    this.set('matchedIndex', _$value);
    _$value = cursorValue.slice(_$value,cursorValue.length);
    var matchedArry = [];
    if(_$value){
      for (var i = 0; i < hintAry.length; i++) {
        var item = hintAry[i];
        //if matched on end
        if((item.indexOf(_$value) === 0)){
          matched = true;
          matchedArry.push(item);
        }
      }
      if (matched) {
        return {matchedArry:matchedArry,index: cursorPosition - _$value};
      }
    }
    return {matchedArry:[],index:-1};
  }
});
