enyo.kind({
   name: "dili.Help",
   kind: "VFlexBox",
   align: "center",
   events: {
      onBackClick: "",
   },
   components: [
      {kind: "RowGroup", defaultKind: "HFlexBox", components: [
         {content: "Who am I?"},
         {className: "enyo-item-secondary", content: "I am the little app, my name is 'diliTimer'. I will be your timer, whenever you need a timer"},
         {content: "How to start?"},
         {className: "enyo-item-secondary", content: "In the main panel (tap the 'OK' button below to go to the panel), tap a few of that bunch of buttons(hh:mm:ss) to choose in how long you want me to alarm. Then tap 'start' to start"},
         {content: "What is Background Timer?"},
         {className: "enyo-item-secondary", content: "In Preference view(tap Preference in menu), you can select Background Timer. Then I will work even after closing me. But I will not run in background, so don't worry about your battery"},
         {content: "You want your own ringtone?"},
         {className: "enyo-item-secondary", content: "Copy your audio file to the [Ringtones] folder in USB mode. Restart me. In Preference view(tap Preference in menu), choose Custom Audio in Alarm Sound Type. Then you can select your audio file in Sound Name"},
         //{content: ""},
         //{className: "enyo-item-secondary", content: ""},
      ]},
      {kind: "Button", caption: "OK", onclick: "doBackClick"},
   ],
});
