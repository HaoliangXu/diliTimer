enyo.kind({
   name: "MyPopup",
   kind: "VFlexBox",
   components:[
      {
         name: 'relaunchApp',
         kind: 'PalmService',
         service: 'palm://com.palm.applicationManager',
         method: 'launch',
      },
      {name: "msg", content: "TIME'S UP", align: "center", style: "margin: 10px"},
      {kind:"Button",name: "ButtonOK",caption: "OK", onclick: "buttonClick", style: "margin:10px"},
   ],
   create: function() {
      this.inherited(arguments);
      this.$.msg.setContent(enyo.windowParams.alarmMsg);
      if (!enyo.windowParams.notPhone){
         document.body.style.backgroundColor = "#000";
      }
   },
   buttonClick: function() {
      this.$.relaunchApp.call(
         {id: 'com.wikidili.dilitimer', params: {action: 'stopAlarm'}}
      );
      window.close();
   },
})
