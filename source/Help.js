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
         {content: "Background Timer"},
         {className: "enyo-item-secondary", content: "Remember the timer even after closing me. But I am not running in background, so don't worry about your battery"},
         //{content: ""},
         //{className: "enyo-item-secondary", content: ""},
      ]},
      {kind: "Button", caption: "OK", onclick: "doBackClick"},
   ],
});
