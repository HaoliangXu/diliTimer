enyo.kind({
   name: "dili.Preferences",
   kind: enyo.VFlexBox,
   events: {
      onReceive: "",
      onSave: "",
      onCancel: "",
      onGoback: "",
   },
   components: [
      {
         name: "getPreferencesCall",
         kind: "PalmService",
         service: "palm://com.palm.systemservice/",
         method: "getPreferences",
         onSuccess: "getPreferencesSuccess",
         onFailure: "getPreferencesFailure",
      },
      {
         name: "setPreferencesCall",
         kind: "PalmService",
         service: "palm://com.palm.systemservice/",
         method: "setPreferences",
         onSuccess: "setPreferencesSuccess",
         onFailure: "setPreferencesFailure",
      },
      {kind: "RowGroup", caption: "Preference", components:[
         {kind: "HFlexBox",align: "center", tapHighlight: false, components:[
            {content: "Background Timer"},
            {kind: "Spacer"},
            {name: "backgroundTimerCheck", kind: "ToggleButton", state: true},
         ]},
         {kind: "RowGroup", caption: "Alarm Message", components:[
            {name: "alarmMsgInput", kind: "Input", value:"TIME IS UP"},
         ]},
         {align: "center", components: [
            {content: "Alarm Sound Type"},
            {name: "soundTypeSelector", kind: "ListSelector", onChange: "soundTypeSelected", className: "enyo-subtext", contentPack: "end", flex: 1, items: [
               {caption: "System Sound", value: 0},
               {caption: "Custom Audio (comming soon)", value: 1},
            ]},
         ]},
         {name: "soundPathLayout", align: "center"},
         {kind: "HFlexBox", components:[
            {kind:"Spacer"},
            {name: "saveButton", kind: "Button", caption: "Save", onclick: "saveClick"},
            {name: "cancelButton", kind: "Button", caption: "Cancel", onclick: "doGoback"},
         ]},
      ]},
   ],
   create: function() {
      this.inherited(arguments);
      this.SYSTEMSOUNDS = [
         "appclose",
         "back_01",
         "browser_01",
         "card_01",
         "card_02",
         "card_03",
         "card_04",
         "card_05",
         "default_425hz",
         "delete_01",
         "discardingapp_01",
         "down2",
         "dtmf_0",
         "dtmf_1",
         "dtmf_2",
         "dtmf_3",
         "dtmf_4",
         "dtmf_5",
         "dtmf_6",
         "dtmf_7",
         "dtmf_8",
         "dtmf_9",
         "dtmf_asterisk",
         "dtmf_pound",
         "error_01",
         "error_02",
         "error_03",
         "focusing",
         "launch_01",
         "launch_02",
         "launch_03",
         "pagebacwards",
         "pageforward_01",
         "shuffle_02",
         "shuffle_03",
         "shuffle_04",
         "shuffle_05",
         "shuffle_06",
         "shuffle_07",
         "shuffle_08",
         "shuffling_01",
         "shutter",
         "switchingapps_01",
         "switchingapps_02",
         "switchingapps_03",
         "tones_3beeps_otasp_done",
         "unassigned",
         "up2",
      ];
      this.prefs = {};
      this.getPreferences();
   },
   getPreferencesSuccess: function(inSender, inResponse) {
      enyo.log("getPreferencesSuccess: " + enyo.json.stringify(inResponse));
      if (typeof inResponse.backgroundTimer != "boolean") {
         this.prefs.backgroundTimer = false;
         this.setPreferences("backgroundTimer", false);
      } else {
         this.prefs.backgroundTimer = inResponse.backgroundTimer;
      }
      if (typeof inResponse.alarmMsg != "string") {
         this.prefs.alarmMsg = "TIME IS UP";
         this.setPreferences("alarmMsg", "TIME IS UP");
      } else {
         this.prefs.alarmMsg = inResponse.alarmMsg;
      }
      if (typeof inResponse.soundType != "number") {
         this.prefs.soundType = 0;
         this.setPreferences("soundType", 0);
      } else {
         this.prefs.soundType = inResponse.soundType;
      }
      switch (this.prefs.soundType) {
         case 0:
            if (typeof inResponse.soundPath != "number") {
               this.prefs.soundPath = 14;
               this.setPreferences("soundPath", 14);
            } else {
               this.prefs.soundPath = inResponse.soundPath;
            }
            break;
         case 1:
            break;
         case 2:
            break;
      }
      if (typeof inResponse.endTimeJSON != "string") {
         var d = (new Date()).toJSON();
         this.prefs.endTimeJSON = d;
         this.setPreferences("endTimeJSON", d);
      } else {
         this.prefs.endTimeJSON = inResponse.endTimeJSON;
      }
      if (typeof inResponse.duration != "number") {
         this.prefs.duration = 0;
         this.setPreferences("duration", 0);
      } else {
         this.prefs.duration = inResponse.duration;
      }
      if (typeof inResponse.position != "number") {
         this.prefs.position = 0;
         this.setPreferences("position", 0);
      } else {
         this.prefs.position = inResponse.position;
      }
      if (typeof inResponse.statu != "string") {
         this.prefs.statu = "stopped";
         this.setPreferences("statu", "stopped");
      } else {
         this.prefs.statu = inResponse.statu;
      }
      this.cancelChange();
      this.doReceive();
   },
   getPreferencesFailure: function(inSender, inResponse) {
      enyo.log("getPreferencesFailure: " + enyo.json.stringify(inResponse));
   },
   setPreferencesSuccess: function(inSender, inResponse) {
      enyo.log("setPreferencesSuccess: " + enyo.json.stringify(inResponse));
      this.prefs.backgroundTimer = this.$.backgroundTimerCheck.state;
      this.prefs.alarmMsg = this.$.alarmMsgInput.value;
      this.prefs.soundType = this.$.soundTypeSelector.value;
      this.prefs.soundPath = this.$.soundPathLayout.$.soundPathSelector.value;
      this.doGoback();
      this.doSave();
   },
   setPreferencesFailure: function(inSender, inResponse) {
      enyo.log("setPreferencesFailure: " + enyo.json.stringify(inResponse));
   },
   saveClick: function() {
      var o = {};
      o.backgroundTimer = this.$.backgroundTimerCheck.state;
      o.alarmMsg = this.$.alarmMsgInput.value;
      o.soundType = this.$.soundTypeSelector.value;
      switch (o.soundType) {
         case 0:
            o.soundPath = this.$.soundPathLayout.$.soundPathSelector.value;
            break;
      }
      o.endTimeJSON = this.prefs.endTimeJSON;
      o.duration = this.prefs.duration;
      o.statu = this.prefs.statu;
      o.position = this.prefs.position;
      this.$.setPreferencesCall.call(o);
   },
   soundTypeSelected: function(inSender, inEvent) {
      switch (inSender.value) {
         case 0:
            var o = {};//soundpathlayout component, soundpathselector
            var oi = [];//items of soundpathselector
            for (var i = 0; i < this.SYSTEMSOUNDS.length; i ++) {
               oi.push({caption: this.SYSTEMSOUNDS[i], value: i});
            }
            o = {name: "soundPathSelector", kind: "ListSelector", value:0, className: "enyo-subtext", contentPack: "end", flex: 1, items: oi};
            this.$.soundPathLayout.destroyComponents();
            this.$.soundPathLayout.createComponent({name: "sntitle", content: "Sound Name"});
            this.$.soundPathLayout.createComponent(o);
            this.$.soundPathLayout.render();
            break;
         case 1:
            inSender.setValue(0);
            break;
         case 2:
            inSender.setValue(0);
            break;
      }
   },
   cancelChange: function() {
      this.$.backgroundTimerCheck.setState(this.prefs.backgroundTimer);
      this.$.alarmMsgInput.setValue(this.prefs.alarmMsg);
      this.$.soundTypeSelector.setValue(this.prefs.soundType);
      this.soundTypeSelected(this.$.soundTypeSelector);
      switch (this.prefs.soundType) {
         case 0:
            this.$.soundPathLayout.$.soundPathSelector.setValue(this.prefs.soundPath);
            break;
      }
   },
   getPreferences: function(key) {
      this.$.getPreferencesCall.call(
         {
            "keys": ["backgroundTimer", "alarmMsg", "soundType", "soundPath", "statu", "endTimeJSON", "duration", "position"],
         }
      );
   },
   setPreferences: function(key, value) {
      this.log(key + " " + value);
      var o = {};
      o[key] = value;
      this.$.setPreferencesCall.call(o);
   },
});
