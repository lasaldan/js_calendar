// 
// JAVSCRIPT CALENDAR GENERATOR
// Daniel Fuller
// July 12, 2011
//

// A few global variables
dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
monthLabels = ['January', 'February', 'March', 
               'April', 'May', 'June', 'July', 
               'August', 'September', 'October', 
               'November', 'December'];
now = new Date(); 

// A function that strips duplicates and sorts the array
// holding the calendar months and years we need to make
Array.prototype.unique = function() {
  a = new Array(); //temp array to hold results
  for(var i = 0; i < this.length; i++)
  {
    y = this[i][0];
    m = this[i][1];
    
    unique = true;
    for(var j = 0; j < a.length; j++)
      if(a[j][0] == y && a[j][1] == m)
        unique = false;
    if(unique)
      a[a.length] = [y,m];
  }
  // Custom sort function (yyyymm - yyyymm)
  a.sort(function(b,c){return (b[0]+""+b[1]) - (c[0]+""+c[1])});
  return a;
}

// Simple Object constructor for a Calendar object
function Calendar(options) {
  this.dates = options.dates;
  this.legend = options.legend || [];
  this.month = now.getMonth()
  this.year = now.getFullYear();
  
  requiredMonths = new Array();
  for(var i = 0; i < this.dates.length; i++)
  {
    a = [
      (this.dates[i].date.substring(0,4)),
      (this.dates[i].date.substring(5,7))
    ];
    requiredMonths[requiredMonths.length] = a;
  }
   
  requiredMonths = requiredMonths.unique();
  this.html = '';
}

// Method to generate the HTML code for the Calendar Object
Calendar.prototype.generateHTML = function(){
  this.html += '<div class="calendarWrapper">';
  
  //This loop generates the calendars for each month as a table
  for(d = 0; d < requiredMonths.length; d++)
  {
    this.month = parseInt(requiredMonths[d][1])-1;
    this.year = parseInt(requiredMonths[d][0]);
    
    var startingDay = new Date(this.year, this.month, 1);
    var startingDay = startingDay.getDay();
    
    var monthLength = 32 - new Date(this.year, this.month, 32).getDate();

    var monthName = monthLabels[this.month]
    var html = '<table cellpadding=0 cellspacing=0 class="calendar">';
    
    html += '<tr><th colspan="7">';
    html +=  monthName + " " + this.year;
    html += '</th></tr>';
    
    html += '<tr class="calendar-week">';
    for(var i = 0; i <= 6; i++ ){
      html += '<td>';
      html += dayLabels[i];
      html += '</td>';
    }
    
    html += '</tr><tr>';
    
    var day = 1;
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j <= 6; j++) { 
        html += '<td class="';
        //make date to a comparable string yyyy-mm-dd
        date = this.year+
          "-"+
          (this.month<10?"0":"")+(this.month+1)+
          "-"+
          (day<10?"0":"")+day;
        for (var k = 0; k < this.dates.length; k++)
        {
          if (date == this.dates[k].date &&
              day <= monthLength && (i > 0 || j >= startingDay))
            html += ' '+this.dates[k].event;
        }
        html += '">';
        if (day <= monthLength && (i > 0 || j >= startingDay)) {
          html += day;
          day++;
        }
        else
          html += "&nbsp;";
        html += '</td>';
      }
      if (day > monthLength) {
        break;
      } else {
        html += '</tr><tr>';
      }
    }
    html += '</tr></table>';

    this.html += html;
  }
    
  if(d == requiredMonths.length && this.legend.length > 0)
  {
    html = '<div class="calendar-legend">';
    for(var i = 0; i < this.legend.length; i++)
    {
      html += '<div class="calendar-legend-key '+
        this.legend[i].key+'"></div>';
      html += '<div class="calendar-legend-value">'+
        this.legend[i].value+"</div>";
    }
    html += '</div></div>';
    this.html += html;
  }
}

// Getter method for the Calendar Object
Calendar.prototype.getHTML = function() {
  return this.html;
}

// Main method to call to create a new Calendar
function generateCalendar(options) {

  var element = options.target || 0;
  var cal = new Calendar(options);
  
  cal.generateHTML();
  
  if(element != 0)
    document.getElementById('calendar').innerHTML = cal.getHTML();
  else
    return cal.getHTML();
}  