import Ember from 'ember';
import ThrottledResize from 'ui/mixins/throttled-resize';
import Util from 'ui/utils/util';
import { alternateLabel } from 'ui/utils/platform';
import AnsiUp from 'npm:ansi_up';

var typeClass = {
  0: 'log-combined',
  1: 'log-stdout',
  2: 'log-stderr',
};
export default Ember.Component.extend(ThrottledResize, {
  instance: null,
  alternateLabel: alternateLabel,
  showProtip: true,
  status: 'connecting',
  socket: null,
  pipeline: Ember.inject.service(),
  logHeight: 300,

  onlyCombinedLog: Ember.computed.alias('instance.tty'),
  which: 'combined',
  isCombined: Ember.computed.equal('which', 'combined'),
  isStdOut: Ember.computed.equal('which', 'stdout'),
  isStdErr: Ember.computed.equal('which', 'stderr'),

  stdErrVisible: true,
  stdOutVisible: true,

  actions: {

    cancel: function() {
      this.disconnect();
      this.sendAction('dismiss');
    },

    clear: function() {
      var body = this.$('.log-body')[0];
      body.innerHTML = '';
      body.scrollTop = 0;
    },

    scrollToTop: function() {
      this.$('.log-body').animate({ scrollTop: '0px' });
    },

    scrollToBottom: function() {
      var body = this.$('.log-body');
      body.stop().animate({ scrollTop: (body[0].scrollHeight + 1000) + 'px' });
    },

    changeShow: function(which) {
      this.set('which', which);
      this.set('stdErrVisible', (which === 'combined' || which === 'stderr'));
      this.set('stdOutVisible', (which === 'combined' || which === 'stdout'));
      Ember.run.next(this, function() {
        this.send('scrollToBottom');
      });
    },
  },

  didInsertElement: function() {
    this._super();
    Ember.run.next(this, 'exec');
  },

  exec: function() {
    this.connect();
  },

  connect: function() {

    this.set('status', 'initializing');
    var body = this.$('.log-body')[0];
    var $body = $(body);
    var onmessage = (message) => {
      this.set('status', 'connected');

      var isFollow = ($body.scrollTop() + $body.outerHeight() + 10) >= body.scrollHeight;

      //var framingVersion = message.data.substr(0,1); -- Always 0
      var type = parseInt(message.substr(1, 1), 10); // 0 = combined, 1 = stdout, 2 = stderr

      body.innerHTML = '';
      message.trim().split(/\n/).forEach((line) => {
        var match = line.match(/^\[?([^ \]]+)\]?\s?/);
        var dateStr, msg;
        if (match) {
          msg = line.substr(match[0].length);
          var date = new Date(match[1]*1);
          debugger
          dateStr = '<span class="log-date">' + Util.escapeHtml(date.toLocaleDateString()) + ' ' + Util.escapeHtml(date.toLocaleTimeString()) + ' </span>';
        } else {
          msg = line;
          dateStr = '<span class="log-date">Unknown Date</span>';
        }

        body.insertAdjacentHTML('beforeend',
          '<div class="log-msg ' + typeClass[type] + '">' +
          dateStr +
          AnsiUp.ansi_to_html(Util.escapeHtml(msg)) +
          '</div>'
        );
      });

      if (isFollow) {
        Ember.run.next(() => {
          this.send('scrollToBottom');
        });
      }
    };

    var instance = this.get('instance');
    var step = instance.step;
    var activity = instance.activity;
    var params = `?activityId=${activity.id}&stageOrdinal=${step[0]}&stepOrdinal=${step[1]}`;
    var url = ("ws://" + window.location.host + this.get('pipeline.pipelinesEndpoint') + '/ws/log' + params);
    var socket = new WebSocket(url);
    this.set('socket', socket);
    socket.onopen = () => {
      this.set('status', 'connected');
    };
    socket.onmessage = (message) => {
      this.set('status', 'connected');
      var msg = JSON.parse(message.data);
      if (msg.data) {
        onmessage(msg.data);
      }
    }
    socket.onclose = () => {
      if (this.isDestroyed || this.isDestroying) {
        return;
      }
      this.set('status', 'disconnected');
    };
  },

  disconnect: function() {
    this.set('status', 'closed');

    var socket = this.get('socket');
    if (socket) {
      socket.close();
      this.set('socket', null);
    }
  },

  onResize: function() {
    this.$('.log-body').css('height', Math.max(200, ($(window).height() - this.get('logHeight'))) + 'px');
  },

  willDestroyElement: function() {
    this.disconnect();
    this._super();
  }
});
