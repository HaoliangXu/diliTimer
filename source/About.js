enyo.kind({
   name: "dili.About",
   kind: "VFlexBox",
   align: "center",
   events: {
      onBackClick: ""
   },
   components: [
      {kind: "RowGroup", defaultKind: "HFlexBox", components: [
         {content: "I am a little count down timer."}, 
         {content: "I can count up to 100 hours, accurated to 1 second."},
         {content: "I can wake up your device when time is up."},
         {content: "You will see more features in Preferences in app menu"},
         {content: "And, even more features coming in next update"},
         {content: "If you have any advice or commemts for me, please leave a review in 'App Catalog'."},
         {content: "Thank you!"},
      ]},
      {kind: "Button", caption: "OK", onclick: "doBackClick"},
   ],
});
