enyo.kind({
   name: "MyPopup",
   kind: "VFlexBox",
   components:[
      {content: "This is a popup alert"},
      {kind:"Button"},
   ],
   constructor: function() {
      this.inherited(arguments);
      enyo.log("create popup kind")
   }
})
