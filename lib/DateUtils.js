enyo.kind({
    name: "dili.dateUtils",
    kind: "Component",
    DOtoS: function(DO) {
        //DateObject to String
    	var Y = DO.getUTCFullYear();
	    var M = DO.getUTCMonth() + 1;
    	var D = DO.getUTCDate();
    	var h = DO.getUTCHours();
    	var m = DO.getUTCMinutes();
    	var s = DO.getUTCSeconds();
    	var Y = "" + Y;
    	if (M < 10) M = "0" + M;
    	if (D < 10) D = "0" + D;
    	if (h < 10) h = "0" + h;
    	if (m < 10) m = "0" + m;
    	if (s < 10) s = "0" + s;
    	//   "mm/dd/yyyy hh:mm:ss"
    	return M + "/" + D + "/" + Y + " " + h + ":" + m + ":" +s;

    },
    TtoS: function(seconds) {
        //time to string
       var string = "";
    	var sec = seconds % 60;
	    var min = (seconds - sec) / 60;
	var hour = parseInt(min / 60, 10);
	min -= hour * 60;
         if (hour < 10) string = "0";
            string += hour + ":";
         if (min < 10) string += "0";
    	string += min + ":";
	    if (sec < 10)
		    string += "0";
    	string += sec;
	    return string;
    },
    TtoTS: function() {
        //time to timeStamp
    },
    TStoT: function() {
        //timeStamp to time
    },
    typeOfTime: function() {
        //detect time type
    },
    timePlus: function() {
        //add time to time
    },
    OtoD: function(inArray) {
       //Array[[0,0],[0,0],[0,0]] to duration seconds
       var a = [];
         for (var i = 0; i < 3; i ++) {
            a[i] = this.AtoD(inArray[i]);
         }
         return (a[0] * 60 + a[1]) * 60 + a[2];
    },
    AtoD: function(inArray) {
       var a = 0;
       for (var i = 0; i < inArray.length; i ++) {
            a = a * 10 + inArray[i];
      }
      return a;
    },
});
