enyo.kind({
   name: "dili.Preferences",
   kind: enyo.VFlexBox,
   published: {
      audioFile: [],
   },
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
      {
         name: 'permitAsker',
         kind: 'PalmService',
         service: 'palm://com.palm.mediapermissions',
         method: 'request',
         onSuccess: 'getPermSuccess',
         onFailure: 'getPermFailure'
      },
      {
         kind: 'DbService',
         dbKind: 'com.palm.media.audio.file:1',
         onFailure: 'findAudioFailure',
         components: [
            {
               name: 'findAudio',
               method: 'find',
               onSuccess: 'findAudioSuccess',
            },
         ],
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
               {caption: "Custom Audio", value: 1},
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
            if (typeof inResponse.soundPath != 'string') {
               this.error('wrong sound path');
            } else {
               this.prefs.soundPath = inResponse.soundPath;
            }
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
      /*switch (o.soundType) {
         case 0:
            o.soundPath = this.$.soundPathLayout.$.soundPathSelector.value;
            break;
         case 1:
            o.soundPath = this.$.soundPathLayout.$.soundPathSelector.value;
      }*/
      o.soundPath = this.$.soundPathLayout.$.soundPathSelector.value;
      o.endTimeJSON = this.prefs.endTimeJSON;
      o.duration = this.prefs.duration;
      o.statu = this.prefs.statu;
      o.position = this.prefs.position;
      this.$.setPreferencesCall.call(o);
   },
   soundTypeSelected: function(inSender, inValue, inOldValue) {
      switch (inValue) {
         case 0:
            var o = {};//soundpathlayout component, soundpathselector
            var oi = [];//items of soundpathselector
            for (var i = 0; i < this.SYSTEMSOUNDS.length; i ++) {
               oi.push({caption: this.SYSTEMSOUNDS[i], value: i});
            }
            o = {name: "soundPathSelector", kind: "ListSelector", className: "enyo-subtext", contentPack: "end", flex: 1, items: oi};
            this.$.soundPathLayout.destroyComponents();
            this.$.soundPathLayout.createComponent({name: "sntitle", content: "Sound Name"});
            this.$.soundPathLayout.createComponent(o);
            this.$.soundPathLayout.render();
            break;
         case 1:
            this.$.permitAsker.call({rights:{'read': ['com.palm.media.audio.file:1']}});
            break;
      }
   },
   getPermSuccess: function(inSender, inResponse) {
      if (inResponse.returnValue === true && inResponse.isAllowed === true) {
         this.$.findAudio.call({query:
            {
               select: ['title', 'path'], 
               where: [{prop: 'isRingtone', op: '=', val: true}],
               from: 'com.palm.media.audio.file:1',
            }
         });
      } else {
         this.findAudioFailure(this, {error: 'did not get Permission'});
      }
   },
   getPermFailure: function(inSender, inError) {
      this.log(enyo.json.stringify(inError));
      this.$.soundTypeSelector.setValue(0);
      this.soundTypeSelected(this.$.soundTypeSelector);
      this.$.soundPathLayout.$.soundPathSelector.setValue(this.prefs.soundPath);
   },
   findAudioSuccess: function(inSender, inResponse) {
      this.setAudioFile(inResponse.results);
   },
   audioFileChanged: function() {
      if (this.audioFile.length === 0) {
         this.findAudioFailure(inSender, {error: 'no audiofile'});
         return
      }
      var o = {};//soundpathlayout component, soundpathselector
      var oi = [];//items of soundpathselector
      for (var i in this.audioFile) {
         oi.push({caption: this.audioFile[i].title, value: this.audioFile[i].path});
      }
      o = {name: "soundPathSelector", kind: "ListSelector", className: "enyo-subtext", contentPack: "end", flex: 1, items: oi};
      this.$.soundPathLayout.destroyComponents();
      this.$.soundPathLayout.createComponent({name: 'sntitle', content: 'Sound Name'});
      this.$.soundPathLayout.createComponent(o);
      this.$.soundPathLayout.render();
      if (typeof(this.prefs.soundPath) === 'string') {//when soundpath is saved in preference
         var soundPathValid = false;
         for (var i in this.audioFile) {
            if (this.audioFile[i].path === this.prefs.soundPath) {
               soundPathValid = true;
               break;
            }
         }
         if (soundPathValid) {
            this.$.soundPathLayout.$.soundPathSelector.setValue(this.prefs.soundPath);
         } else {
            this.findAudioFailure(this, {error: 'prefs.soundPath invalid'});
         }
      }
   },
   findAudioFailure: function(inSender, inError) {
      this.log(enyo.json.stringify(inError));
      this.$.soundTypeSelector.setValue(0);
      this.soundTypeSelected(this.$.soundTypeSelector);
      this.$.soundPathLayout.$.soundPathSelector.setValue(this.prefs.soundPath);
   },
   cancelChange: function() {
      this.$.backgroundTimerCheck.setState(this.prefs.backgroundTimer);
      this.$.alarmMsgInput.setValue(this.prefs.alarmMsg);
      this.$.soundTypeSelector.setValue(this.prefs.soundType);
      this.soundTypeSelected(this.$.soundTypeSelector, this.prefs.soundType);
      switch (this.prefs.soundType) {
         case 0:
            this.$.soundPathLayout.$.soundPathSelector.setValue(this.prefs.soundPath);
            break;
         case 1:
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
      var o = {};
      o[key] = value;
      this.$.setPreferencesCall.call(o);
   },
});
