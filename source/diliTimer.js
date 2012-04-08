enyo.kind({
  name:  'dili.diliTimer',
  kind: "VFlexBox",
  components: [
    {kind: enyo.ApplicationEvents, onApplicationRelaunch: "relaunchHandler"},
    {name: "makeSysSound", kind : "PalmService",
        service : "palm://com.palm.audio/systemsounds",
        method : "playFeedback",
        onSuccess : "makeSoundSuccess",
        onFailure : "makeSoundFailure"
    },
    {name: "timerHandler", kind: "dili.AlarmController",
        onSetupAlarmSuccess: "setupAlarmSuccess",
        onClearAlarmSuccess: "clearAlarmSuccess",
        onSetupAlarmFailure: "setupAlarmFailure",
        onClearAlarmFailure: "clearAlarmFailure"
    },
    {kind: "PageHeader", components: [
       {name: "simpleTimer", flex:1,kind: "dili.TimerController",
        onSimpleTimerStop: "simpleTimerStopped",
        onSimpleTimerPause: "simpleTimerPaused",
        onSimpleTimerResume: "simpleTimerResumed",
          onSimpleTimerStart: 'simpleTimerStarted',
          onSimpleTimerEnd: 'simpleTimerEnded'
       },
    ]},
    {kind: "Pane",flex:1,components:[
       {kind:"Scroller", components:[
         {name:"timeSetter", flex:1,kind:"dili.TimePickerGroup",
            onTimeChange: "handleTimeChange"
         },
       ]},
    ]},
  ],

  create: function () {
    var initialDuration = 0;
    this.inherited(arguments);
    this.$.simpleTimer.setTimerDuration(initialDuration);
    var DeviceInfo = enyo.fetchDeviceInfo();
    //this.log(DeviceInfo);
    this.relaunchHandler();
  },

////////////////////////////simpleTimer
     simpleTimerStopped: function () {
        this.simpleTimerEnded();
        this.$.timerHandler.clearAlarm("dili");
     },
     simpleTimerPaused: function() {
        this.$.timerHandler.clearAlarm("dili");
     },
     simpleTimerResumed: function() {
       var td = this.$.simpleTimer.getTimerDuration() - this.$.simpleTimer.getTimerPosition();
       this.log(td);
       var startTime = new Date();
       var endTime = new Date(startTime.getTime() + td * 1000);
       var endTimeString = timeU.DOtoS(endTime);
       this.$.timerHandler.setupAlarm("dili", endTimeString,
           {"id":"com.wikidili.dilitimer","params":{"action":"alarmWakeup"}}
       );
     },

  simpleTimerStarted: function () {
     this.simpleTimerResumed();
    this.$.timeSetter.disableAll();
  },
  simpleTimerEnded: function () {
    this.$.timeSetter.enableAll();
  },

//////////////////////////////////////alarm
    setupAlarmSuccess: function() {
    },
    clearAlarmSuccess: function() {
    },
    setupAlarmFailure: function(inSender, inError, inRequest) {
        this.log(enyo.json.stringify(inError));
    },
    clearAlarmFailure: function() {
        this.log("Alarm clear failed");
    },

//////////////////////////////////////////////////application control
    relaunchHandler: function(inSender, inEvent) {
        if (enyo.windowParams.action == "alarmWakeup") {
            this.$.makeSysSound.call({"name": "dtmf_2"});
             enyo.windows.openPopup("source/popup/popup.html", "MyPopup", {}, {}, "100px", true);
        }
    },

////////////////////////////////////////////////sound control
    makeSoundSuccess: function(inSender, inResponse) {
    },          
    // Log errors to the console for debugging
    makeSoundFailure: function(inSender, inError, inRequest) {
        this.log(enyo.json.stringify(inError));
    },

///////////////////////////timePickerGroup
   handleTimeChange: function(inSender, inArray){
      //check if the values for timeGroupPicker are valid , or return false
      var a = [];
      for (var i = 0; i < 3; i++) {
            a[i] = parseInt(inArray[i].join(""),10);
            if (a[i] > inSender.max[i] && a[i] <  inSender.min[i]){
               this.warn("TimeChange to invalid value");
               return false;
            };
      }
      this.$.timeSetter.setValue(inArray);
      var newDuration = (a[0] * 60 + a[1]) * 60 + a[2];
      this.$.simpleTimer.setTimerDuration(newDuration);
   },
});
