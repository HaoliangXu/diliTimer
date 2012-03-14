enyo.kind({
  name:  'SimpleTimer',
  kind: "RowGroup",
  caption: "Simple Timer",
  published: {
    timerDuration: 30
  },
  events: {
    onSimpleTimerStart: "",
    onSimpleTimerEnd: ""
  },
  components: [
    {name: "animator", kind: enyo.Animator, easingFunc: enyo.easing.linear,
      duration: 30000, tick: 1000, onBegin: "beginAnimation",
     onAnimate: "stepAnimation", onEnd: "endAnimation"
    },
    {kind: "Control", layoutKind: "HFlexLayout", pack: "start", align: "center",
       components: [
        {name: 'timerProgress', kind: "ProgressBar", flex:1, minimum: 0,
           maximum: 30, position: 0
         }
    ]}
  ],

  create: function () {
    this.inherited(arguments);
    this.setCaption("Simple Timer (" + this.timerDuration + " seconds)");
    this.$.timerProgress.setMaximum(this.timerDuration);
    this.$.animator.setDuration(this.timerDuration * 1000);
  },

  start: function () {
    this.$.animator.play(0, this.timerDuration);
  },

  stepAnimation: function(inSender, inValue) {
    this.$.timerProgress.setPosition(inValue);
  },

  beginAnimation: function(inSender, inStart, inEnd) {
    this.$.timerProgress.setPosition(0);
    this.doSimpleTimerStart();
  },

  endAnimation: function(inSender, inValue) {
    this.$.timerProgress.setPosition(0);
    this.doSimpleTimerEnd();
  },

  timerDurationChanged: function() {
    this.setCaption("Simple Timer (" + this.timerDuration + " seconds)");
    this.$.timerProgress.setMaximum(this.timerDuration);
    this.$.animator.setDuration(this.timerDuration * 1000);
  }
});

enyo.kind({
  name:  'dili.diliTimer',
  kind:  'enyo.Control',
  components: [
    {name: "simpleTimer", kind: "SimpleTimer",
       onSimpleTimerStart: 'simpleTimerStarted',
       onSimpleTimerEnd: 'simpleTimerEnded'
    },
    {name: "timerHandler", kind: "dili.timerHandler",
        onSetupAlarmSuccess: "setupAlarmSuccess",
        onClearAlarmSuccess: "clearAlarmSuccess",
        onSetupAlarmFailure: "setupAlarmFailure",
        onClearAlarmFailure: "clearAlarmFailure"
    },
    {kind: "Control", layoutKind: "HFlexLayout", pack: "center", align: "center",
        components: [
        {name: "timeLimit", kind: "RadioGroup", width: "360px",
           onChange: "radioButtonSelected", components: [
             {name: "ten", caption: "10 Sec.", value: "10"},
             {name: "thirty", caption: "30 Sec.", value: "30"},
             {name: "sixty", caption: "60 Sec.", value: "60"}
      ]}
    ]},
    {kind: "Control", layoutKind: "HFlexLayout", pack: "center", align: "center",
      components: [
        {name: 'startTimer', kind:'Button', caption:'Start Timer',
           width: '360px', onclick:'timerStart'
        }
    ]}
  ],

  create: function () {
    var initialDuration = 10;
    this.inherited(arguments);
    this.$.timeLimit.setValue(initialDuration);
    this.$.simpleTimer.setTimerDuration(initialDuration);
    enyo.log("app start");
  },

  radioButtonSelected: function (inSender) {
    this.$.simpleTimer.setTimerDuration(inSender.getValue());
  },

  timerStart: function () {
    this.$.simpleTimer.start();
  },

  simpleTimerStarted: function () {
    var td = this.$.simpleTimer.getTimerDuration();
    //TODO time and date convertor
    td = "00:00:" + td;
    enyo.log(td);
    this.$.timerHandler.setupAlarm("wiki1", td, {"id":"com.wikidili.wikitimer.alarms","params":{"action":"alarmWakeup"}});
    this.$.startTimer.setDisabled(true);
    this.disableRadioGroup();
  },
    setupAlarmSuccess: function() {
        enyo.log("Alarm set");
    },
    clearAlarmSuccess: function() {
        enyo.log("Alarm clear");
    },
    setupAlarmFailure: function(inSender, inError, inRequest) {
        this.log(enyo.json.stringify(inError));
        enyo.log("Alarm set failed");
    },
    clearAlarmFailure: function() {
        enyo.log("Alarm clear failed");
    },

  simpleTimerEnded: function () {
    this.$.startTimer.setDisabled(false);
    this.enableRadioGroup();
  },
  disableRadioGroup: function () {
    this.$.ten.setDisabled(true);
    this.$.thirty.setDisabled(true);
    this.$.sixty.setDisabled(true);
  },
  enableRadioGroup: function () {
    this.$.ten.setDisabled(false);
    this.$.thirty.setDisabled(false);
    this.$.sixty.setDisabled(false);
  }

});

