enyo.kind({
  name:  'dili.diliTimer',
  kind: "VFlexBox",
  components: [
    {kind: "AppMenu",
       components: [
          {caption: "Preferences", onclick: "showPreferences"},
          {caption: "Help", onclick: "showHelp"},
          {caption: "About", onclick: "showAbout"},
       ],
    },
    {name: "makeSysSound", kind: "PalmService", service: "palm://com.palm.audio/systemsounds", method: "playFeedback"},
    {kind: enyo.ApplicationEvents, onApplicationRelaunch: "relaunchHandler", onUnload: "unloadHandler", onLoad: "loadHandler", onBack: "backGesture"},
    {name: "timerHandler", kind: "dili.AlarmController",
        onSetupAlarmSuccess: "setupAlarmSuccess",
        onClearAlarmSuccess: "clearAlarmSuccess",
        onSetupAlarmFailure: "setupAlarmFailure",
        onClearAlarmFailure: "clearAlarmFailure"
    },
  ],

  create: function () {
   this.deviceInfo = (enyo.fetchDeviceInfo().screenWidth) > 500;
   var st = 
       {name: "simpleTimer", kind: "dili.TimerController",
        onSimpleTimerStop: "simpleTimerStopped",
        onSimpleTimerPause: "simpleTimerPaused",
        onSimpleTimerResume: "simpleTimerResumed",
          onSimpleTimerStart: 'simpleTimerStarted',
          onSimpleTimerEnd: 'simpleTimerEnded'
       };
    var pn = {kind: "Pane", flex:1, onSelectView: "viewSelected", transitionKind: "enyo.transitions.Simple", components:[
          {name: "mainView", kind:"Scroller", components:[
            {name:"timeSetter", flex:1,kind:"dili.TimePickerGroup",
               onTimeChange: "handleTimeChange"
            },
         ]},
          {name: "aboutView", kind:"Scroller", components:[
             {name:"about", flex:1, kind: "dili.About", onBackClick: "goBack"},
          ]},
          {name: "helpView", kind:"Scroller", components:[
             {name:"help", flex:1, kind: "dili.Help", onBackClick: "goBack"},
          ]},
          {name: "prefsView", kind:"Scroller", components:[
             {name: "preferences", kind: "dili.Preferences",
                onReceive: "prefsReceive",
                onSave: "prefsSave",
                onCancel: "prefsCancel",
                onGoback: "goBack",
             },
          ]},
       ]};
   var ph = {kind:"PageHeader"};
    if (this.deviceInfo) {
       ph.components = [];
       st.flex = 1;
       ph.components[0] = st;
       st = ph;
    } else {
       st.style = "margin: 5px";
    }
   this.createComponent(st,{owner: this});
   this.createComponent(pn,{owner: this});
    var initialDuration = 0;
    this.endTime = new Date();
    this.inherited(arguments);
    this.$.simpleTimer.setTimerDuration(initialDuration);
  },

///////////////////////////Pane
   viewSelected: function(inSender, inView, inPreviousView) {
      if (inPreviousView && inPreviousView.name && inPreviousView.name == "prefsView") {
          this.$.preferences.cancelChange();
      }
   },
   prefsSave: function() {
       if (this.$.simpleTimer.statu == this.$.simpleTimer.status.timing) {
          var endTimeString = timeU.DOtoS(this.endTime);
          this.$.timerHandler.setupAlarm("dili", endTimeString, true,
              {"id":"com.wikidili.dilitimer","params":{"action":"alarm"}}
          );
       }
   },
   goBack: function() {
      this.$.pane.selectViewByName("mainView");
   },
   prefsReceive: function() {
      this.relaunchHandler();
      if (this.$.preferences.prefs.statu == "timing") {
         var d = new Date();
         var e = new Date(this.$.preferences.prefs.endTimeJSON);
         d = d.getTime();
         e = e.getTime();
         if (e > d) {
            var position = parseInt((e - d)/1000, 10);
            position = this.$.preferences.prefs.duration - position;
            this.$.simpleTimer.changeStatu(this.$.preferences.prefs.statu, position, this.$.preferences.prefs.duration);
            var a = timeU.StoA(this.$.preferences.prefs.duration);
            this.$.timeSetter.setValue(a);
         }
      }
      if (this.$.preferences.prefs.statu == "paused") {
         this.log(this.$.preferences.prefs.position);
         this.$.simpleTimer.changeStatu(this.$.preferences.prefs.statu, this.$.preferences.prefs.position, this.$.preferences.prefs.duration);
         var a = timeU.StoA(this.$.preferences.prefs.duration);
         this.$.timeSetter.setValue(a);
         this.$.timeSetter.disableAll();
      }
   },

////////////////////////////AppMenu
   showHelp: function() {
      this.$.pane.selectViewByName("helpView");
   },
   showAbout: function() {
      this.$.pane.selectViewByName("aboutView");
   },
   showPreferences: function() {
      this.$.pane.selectViewByName("prefsView");
   },

////////////////////////////simpleTimer
     simpleTimerStopped: function () {
        this.endTime = new Date();
        this.simpleTimerEnded();
        this.$.timerHandler.clearAlarm("dili");
     },
     simpleTimerPaused: function() {
        this.endTime = new Date();
        this.$.timerHandler.clearAlarm("dili");
     },
     simpleTimerResumed: function() {
       var td = this.$.simpleTimer.getTimerDuration() - this.$.simpleTimer.getTimerPosition();
       var startTime = new Date();
       this.endTime = new Date(startTime.getTime() + td * 1000);
       var endTimeString = timeU.DOtoS(this.endTime);
       this.$.timerHandler.setupAlarm("dili", endTimeString, true,
           {"id":"com.wikidili.dilitimer","params":{"action":"alarm"}}
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
    backGesture: function(inSender, inEvent) {
       this.log();
       if (this.$.pane.getView().name != "mainView"){
          this.goBack();
       }
       inEvent.stopPropagation();
       inEvent.preventDefault();
    },
    unloadHandler: function(inSender, inEvent) {
       this.$.preferences.prefs.statu = this.$.simpleTimer.statu;
       this.$.preferences.prefs.position = this.$.simpleTimer.timerPosition;
       this.$.preferences.prefs.duration = this.$.simpleTimer.timerDuration;
       this.$.preferences.prefs.endTimeJSON = this.endTime.toJSON();
       if (!this.$.preferences.prefs.backgroundTimer) {
          this.$.preferences.prefs.statu = "stopped";
         this.$.timerHandler.clearAlarm("dili");
       }
       this.$.preferences.cancelChange();
       this.$.preferences.saveClick();
    },
    relaunchHandler: function(inSender, inEvent) {
        if (enyo.windowParams.action == "alarm") {
           var sp = this.$.preferences.SYSTEMSOUNDS[this.$.preferences.prefs.soundPath];
            this.$.makeSysSound.call({"name": sp});
            //TODO enyo.Dashboard
            //enyo.windows.addBannerMessage(this.$.preferences.prefs.alarmMsg,"{}");
            window.PalmSystem.playSoundNotification("vibrate");
            enyo.windows.openPopup("source/popup/popup.html", "MyPopup", {"alarmMsg": this.$.preferences.prefs.alarmMsg, "notPhone": this.deviceInfo}, {}, "100px", true);
        }
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
