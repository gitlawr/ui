import Ember from 'ember';

export default Ember.Component.extend({
  hintAry: null,
  matchedArry: null,
  positionX: 0,
  positionY: 0,
  positionStyle: function(){
    var positionX = this.get('positionX'), positionY=this.get('positionY');
    return [
      'position: fixed',
      `top: ${positionY}px`, 
      `left: ${positionX}px`,
      `z-index: 9999`
    ].join(';')
  }.property('positionX','positionY'),
  startStr: '$',
  triggerInputEle: null,
  hidden: true,
  triggerClickHint: null,
  matchedIndex: -1,
  cursorPosition: -1,
  originalScrollTop : null,
  hiddenClass:function(){
    var hd = this.get('hidden');
    return hd?'hide':'';
  }.property('hidden'),
  showHint(y,x){
    this.set('positionX',x);
    this.set('positionY',y);
    this.set('hidden',false);
  },
  setTriggerInputEle(ele){
    this.set('triggerInputEle',ele)
  },
  getCursorCoordinates(value){
    var lines = value.split(/[\n\r]/g);
    var maxI = lines.length - 1;
    return {
      x: (lines[maxI].length-1)*8,
      y: (maxI+1)*24+8
    }
  },
  startHint(ele,cb){
    this.set('triggerInputEle',ele)
    var el = this.get('triggerInputEle');
    if(!el){
      this.setTriggerInputEle(null)
      this.set('triggerClickHint',null);
      this.set('hidden',true);
      return false;
    }
    var $el = this.$(el);
    var value = $el.val();
    var cursorPosition = $el.getCursorPosition();
    this.set('cursorPosition',cursorPosition);
    var cursorValue = value.slice(0, cursorPosition);
    
    var matched = false;
    var hintAry = this.get('hintAry');
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
        var offset = $el.offset();
        debugger
        this.set('matchedArry',matchedArry);
        var cursorCoordinates = this.getCursorCoordinates(cursorValue);
        var oT = this.$(window).scrollTop();
        var originalCoordinates = {
          top: offset.top+cursorCoordinates.y,
          left: offset.left+cursorCoordinates.x
        };
        this.set('originalCoordinates',originalCoordinates);
        this.showHint(originalCoordinates.top-oT,originalCoordinates.left);
        this.set('triggerClickHint',cb);
        return true;
      }
    }
    this.setTriggerInputEle(null)
    this.set('triggerClickHint',null);
    this.set('hidden',true);
    return false;
    
  },
  actions: {
    clickHint(val){
      var triggerClickHint = this.get('triggerClickHint');
      triggerClickHint&&triggerClickHint(val)
      var triggerInputEle = this.get('triggerInputEle');
      var matchedIndex = this.get('matchedIndex');
      var cursorPosition = this.get('cursorPosition');
      var value = $(triggerInputEle).val();
      if(matchedIndex !==-1 && triggerInputEle){
        $(triggerInputEle).val(value.slice(0,matchedIndex).concat(val).concat(value.slice(cursorPosition,value.length)));
      }
    }
  },
  didRender(){
    // extend Jquery
    if(window.jQuery||window.$){
      jQuery.fn.E_INPUT_HINT = this;

      jQuery.fn.getCursorPosition = function() {
        var el = $(this).get(0);
        var pos = 0;
        if('selectionStart' in el) {
            pos = el.selectionStart;
        } else if('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
      }
    }
    var clickHiden = ()=>{
      this.set('hidden',true);
    };
    var scrollPosition = ()=>{
      var hd = this.get('hidden');
      if(hd){
        return
      }
      var el = this.get('triggerInputEle');
      var $el = this.$(el);
      var offset = $el.offset();
      var originalCoordinates = this.get('originalCoordinates');
      this.showHint(originalCoordinates.top-this.$(window).scrollTop(),originalCoordinates.left);
    };
    this.$(document).on('click.hint', clickHiden).on('scroll.hint', scrollPosition);
  },
  willDestroyElement(){
    this.$(document).off('click.hint');
    this.$(document).off('scroll.hint');
    this._super(...arguments);
  }
});
