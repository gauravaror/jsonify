var tables= [];
var tablesdatatype = function (rowslength) { 
    this.tableRows = [];
    this.rowLength = rowslength;
    this.columnLength =0;
    this.totalDH = 0;
    this.validTable = false;
    this.heading = "";
}

var tableRows = function() {
    this.DH = [];
    this.DT = [];
    this.CombinedText = "";
    this.lengthDH = 0;
    this.lengthDT = 0;
    this.lengthChild = 0;
    this.validRow = false;
}

function compare(a,b) {
  if (a.last_nom < b.last_nom)
     return -1;
  if (a.last_nom > b.last_nom)
    return 1;
  return 0;
}


function getValidTableIfPossible(ctable) {
    var vTable = false;
    var cLength = -1;
    var cLengthArray = {};
    for (var j=0;j<ctable.tableRows.length;j++) {
        var cRow = ctable.tableRows[j]; 
        console.log("crow length"+cRow.lengthChild);
        if( cRow.CombinedText != "") {
            if(cLengthArray[cRow.lengthChild] !== undefined) {
                cLengthArray[cRow.lengthChild]++;
            } else {
                cLengthArray[cRow.lengthChild] = 1;
            }
        }
    }
    var sortable = [];
    for (var child in cLengthArray) {
        sortable.push([child, cLengthArray[child]])
        //console.log(child+" child "+cLengthArray[child]);
    }
    sortable.sort(function(a, b) {return -1*(a[1] - b[1])})
    if(sortable[0] && sortable[0][0]) {
        cLength = sortable[0][0];
        console.log("Clength: "+cLength+" "+sortable[0][1]+"  " +cLengthArray[cLength]);
        for (var j=0;j<ctable.tableRows.length;j++) {
            var cRow = ctable.tableRows[j];
            if(cRow.lengthChild  != cLength || cRow.CombinedText == "") {
                cRow.validRow = false;
                ctable.totalDH = ctable.totalDH - cRow.lengthDH;
                ctable.rowLength = ctable.rowLength - 1;
                console.log("invalidating the row");
            }
        }
        console.log("Clength: row length "+ctable.rowLength+"  " +ctable.totalDH );
        ctable.validTable = true;
    } else {
        ctable.validTable = false;
        
    }
    return cLength; 
    
}

function verifyPrintGoodTables(ctable) {
    var vTable = true;
    var cLength = -1;
    for (var j=0;j<ctable.tableRows.length;j++) {
        var cRow = ctable.tableRows[j];
        if(cLength == -1) {
            cLength = cRow.lengthChild;
        } else if ( cLength != cRow.lengthChild) {
            vTable = false;
        }
        if(cRow.lengthDH + cRow.lengthDT == cRow.lengthChild) {
            cRow.validRow = true;
        }
    }
    if(vTable) {
        console.log("table is valid: "+cLength);
        ctable.validTable = vTable;
        return cLength;
    } else {
        return getValidTableIfPossible(ctable);
    }
}

function cleanString(myString) {
    if(myString) {
        return myString.replace(/[\r\n]/g,"").replace(/\"/g,"").replace(/[^a-zA-Z0-9]/g,' ');;
    } else {
        console.log("undefined thing for cleaning");
        return "";
    }
}

function getJSONType1(table) {
    console.log("JSONizing with type 1,table.tableRows.length :"+table.tableRows.length);
    var array = {};
    var jsoncollection= {};
    var firstrow = -1;
    for(var i=0; i < table.tableRows.length; i++) {
        if (table.tableRows[i].validRow) {
            if(firstrow == -1 ) {
                if(table.tableRows[i].lengthDH > 0){
                    firstrow = i;
                    continue;
                } else {
                    return undefined;
                }
            }
            for( var j=0; j < table.columnLength; j++){
            //    console.log(cleanString(table.tableRows[0].DH[j])+" : "+cleanString(table.tableRows[i].DT[j]));
                array[cleanString(table.tableRows[firstrow].DH[j])] = cleanString(table.tableRows[i].DT[j]);
            }
            jsoncollection[i]=array;
            array = {};
       }
    }
    return(jsoncollection);
    //return(("{"+jsoncollection.toString()+"}"));
}

function getJSONType4(table) {
    console.log("JSONizing with type 1,table.tableRows.length :"+table.tableRows.length);
    var array = {};
    var jsoncollection= {};
    var firstrow = -1;
    for(var i=0; i < table.tableRows.length; i++) {
        if (table.tableRows[i].validRow) {
            if(firstrow == -1 ) {
                    firstrow = i;
                    continue;
            }
            for( var j=0; j < table.columnLength; j++){
            //    console.log(cleanString(table.tableRows[0].DH[j])+" : "+cleanString(table.tableRows[i].DT[j]));
                if( table.tableRows[firstrow].lengthDT > 0 && table.tableRows[firstrow].lengthDH == 0 && table.tableRows[i].lengthDT > 0 && table.tableRows[i].lengthDH == 0) {
                    array[cleanString(table.tableRows[firstrow].DT[j])] = cleanString(table.tableRows[i].DT[j]);
                } else if ( table.tableRows[firstrow].lengthDT > 0 && table.tableRows[firstrow].lengthDH == 0 && table.tableRows[i].lengthDT == 0 && table.tableRows[i].lengthDH >  0) {
                    array[cleanString(table.tableRows[firstrow].DT[j])] = cleanString(table.tableRows[i].DH[j]);
                } else if ( table.tableRows[firstrow].lengthDT == 0 && table.tableRows[firstrow].lengthDH > 0 && table.tableRows[i].lengthDT == 0 && table.tableRows[i].lengthDH >  0) {
                    array[cleanString(table.tableRows[firstrow].DH[j])] = cleanString(table.tableRows[i].DH[j]);
                } else if ( table.tableRows[firstrow].lengthDT == 0 && table.tableRows[firstrow].lengthDH > 0 && table.tableRows[i].lengthDT > 0 && table.tableRows[i].lengthDH ==  0) {
                    array[cleanString(table.tableRows[firstrow].DH[j])] = cleanString(table.tableRows[i].DT[j]);
                }
            }
            jsoncollection[i]=array;
            array = {};
       }
    }
    console.log(jsoncollection);
    return(jsoncollection);
    //return(("{"+jsoncollection.toString()+"}"));
}

function getJSONType2(table) {
    console.log("JSONizing with type 2");
    var array = {};
    for(var i=0; i < table.tableRows.length; i++) {
        if (table.tableRows[i].validRow) {
 //           console.log(cleanString(table.tableRows[i].DH[0])+" : "+cleanString(table.tableRows[i].DT[0]));
            array[cleanString(table.tableRows[i].DH[0])] = cleanString(table.tableRows[i].DT[0]);
        }
    }
    return(array);
}

function getJSONType3(table) {
    console.log("JSONizing with type 3");
    var array = {};
    for(var i=0; i < table.tableRows.length; i++) {
        if (table.tableRows[i].validRow) {
      //      console.log("lengths DT "+table.tableRows[i].lengthDT+" length DH"+table.tableRows[i].lengthDH);
                if(table.tableRows[i].lengthDT == 2) {
                    array[cleanString(table.tableRows[i].DT[0])] = cleanString(table.tableRows[i].DT[1]);
                } else if (table.tableRows[i].lengthDT == 1 && table.tableRows[i].lengthDH == 1 ) {
    //                console.log(table.tableRows[i].DH[0] +" DT length : "+table.tableRows[i].DT[0]); 
                    array[cleanString(table.tableRows[i].DH[0])] = cleanString(table.tableRows[i].DT[0]);
                } else if(table.tableRows[i].lengthDH == 2) {
                    array[cleanString(table.tableRows[i].DH[0])] = cleanString(table.tableRows[i].DH[1]);
                }
        }
    }
/*    array = array.reduce(function(m,i){
        var s = i.split(':');
        m[s.shift()] = s.join(':');
        return m;
    }, {});*/
    return (array);
}

function getJSON(table) {
    console.log("totalDH: "+table.totalDH+"table.columnLength: "+ table.columnLength+ "table.rowLength: "+table.rowLength);
    if(table.rowLength > 2){
        if(table.totalDH == table.columnLength ) {
            //console.log("Jsoning the table as type 1");
            return getJSONType1(table);
        } else if (table.totalDH == table.rowLength) {
            //console.log("Jsoning the table as type 2");
            return getJSONType2(table);        
        } else if ( table.totalDH == 0 && table.columnLength==2) {
            //console.log("Jsoning the table as type 3");
            return getJSONType3(table);
        } else if ( table.totalDH == 0 && table.columnLength > 2) {
            //console.log("Jsoning the table as type 3");
            return getJSONType4(table);
        } else if ( table.columnLength==2) {
            //console.log("Jsoning the table as type 3");
            return getJSONType3(table);
        } else if (table.columnLength > 2) {
            return getJSONType4(table);
        }
    } else {
        return undefined;
    }
}

function jsonizeValidTables() {
    console.log("jsoning the tables");
    var finaljsonobj = {};
    for (var i = 0;i < tables.length; i++) {
        if(tables[i].validTable) {
            var json = getJSON(tables[i]);
            if(json !== undefined && json != "{}") {
               finaljsonobj[tables[i].heading] = json;
            } else {
    //            console.log("This type of table yet not supported :"+"totalDH: "+tables[i].totalDH+"table.columnLength: "+ tables[i].columnLength+ "table.rowLength: "+tables[i].rowLength);
            }
        }
    }
/*    finaljsonobj = finaljsonobj.reduce(function(m,i){
        var s = i.split(':');
        m[s.shift()] = s.join(':');
        return m;
    }, {});*/
    return(JSON.stringify(finaljsonobj, undefined, 2));

}

exports.jsonifyTable = function(errors,window) {
    var $ = window.$;
    var tablenum = 0;
    //console.log("Number of table: "+$("table").length);
    $("table").each(function() {
            var handlesRowSpanDH = [];
            var handlesRowSpanDT = [];
            tablenum++;
            //console.log("New Table");
            var currenttable = new tablesdatatype($(this).find("tr").length);
            tables[tables.length] = currenttable;
            //console.log($(this).find("tr").length);
//            console.log("heading"+$(this).prev(":header").text());
            currenttable.heading =  $(this).prev(":header").text();
            var parent__ = $(this).parent();
            var max = 5;
            if(currenttable.heading  == "" && parent__ !== undefined && max >0 ) {
                currenttable.heading = parent__.prev(":header").text();
                parent__ = parent__.parent();
                max--;
//                console.log(parent__);
            }
            if(currenttable.heading  == "") {
                currenttable.heading = tablenum;
            }
            $(this).children("tr").each(function(){
                console.log("New table row");
                var currentTableRows = new tableRows();
//                currentTableRows.lengthDH = $(this).find("th").length;
  //              currentTableRows.lengthDT = $(this).find("td").length;
                currentTableRows.lengthChild = $(this).children().length;
//                console.log("TH NODES: "+$(this).find("th").length);
  //              console.log("TD NODES: "+$(this).find("td").length);
    //            console.log("Children: "+$(this).children().length);
                    //console.log($(this).text());
                currentTableRows.CombinedText = "";
                for(var i=0;i< handlesRowSpanDH.length;i++) {
                    if(handlesRowSpanDH[i].count > 0) {
                        currentTableRows.DH[currentTableRows.DH.length] = handlesRowSpanDH[i].text;
                        currentTableRows.CombinedText = currentTableRows.CombinedText + handlesRowSpanDH[i].text;
                        console.log("TH(rowspan): "+handlesRowSpanDH[i].text);
                        currenttable.totalDH++;
                        handlesRowSpanDH[i].count--;
                        currentTableRows.lengthDH++;  
                        currentTableRows.lengthChild++; 
                    }
                }
                for(var i=0;i< handlesRowSpanDT.length;i++) {
                    if(handlesRowSpanDT[i].count > 0) {
                        currentTableRows.DT[currentTableRows.DT.length] = handlesRowSpanDT[i].text;
                        currentTableRows.CombinedText = currentTableRows.CombinedText + handlesRowSpanDT[i].text;
                        console.log("TD(rowspan): "+ handlesRowSpanDT[i].text);
                        currentTableRows.lengthDT++;       
                        handlesRowSpanDT[i].count--;
                        currentTableRows.lengthChild++; 
                    }
                }
                $(this).children().each(function() {
                    console.log($(this).prop('tagName'));
                    if($(this).prop('tagName') == "TH") {
                        var rowspan = $(this).prop('rowspan');
                        var datarowspan = {};
                        var colspan = $(this).prop('colspan');
                        do {
                            if(colspan != $(this).prop('colspan')) {
                                currentTableRows.lengthChild++; 
                            }
                            currentTableRows.DH[currentTableRows.DH.length] = $(this).text();
                            currentTableRows.CombinedText = currentTableRows.CombinedText + $(this).text();
                            console.log("TH(colspan): "+$(this).text());
                            currenttable.totalDH++;
                            currentTableRows.lengthDH++;
                            colspan--;
                        } while(colspan>0);
                        if(rowspan > 1) {
                            datarowspan['count'] = rowspan-1;
                            datarowspan['text'] = $(this).text();
                            handlesRowSpanDH[handlesRowSpanDH.length] = datarowspan;
                        }

                    } else if ($(this).prop('tagName') == "TD") {
                        var rowspan = $(this).prop('rowspan');
                        var colspan = $(this).prop('colspan');
                        var datarowspan = {};
                        do {
                            if(colspan != $(this).prop('colspan')) {
                                currentTableRows.lengthChild++; 
                            }
                            currentTableRows.DT[currentTableRows.DT.length] = $(this).text();
                            currentTableRows.CombinedText = currentTableRows.CombinedText + $(this).text;
                            console.log("TD(colspan): "+ $(this).text());
                            currentTableRows.lengthDT++;
                            colspan--;
                        } while(colspan>0);
                        if(rowspan > 1) {
                            datarowspan['count'] = rowspan-1;
                            datarowspan['text'] = $(this).text();
                            handlesRowSpanDT[handlesRowSpanDT.length] = datarowspan;
                        }
                        
                    }
                });
                /*$(this).find("th").each(function(){
                    currentTableRows.DH[currentTableRows.DH.length] = $(this).text();
                    currentTableRows.CombinedText = currentTableRows.CombinedText + $(this).text();
//                    console.log("TH: "+$(this).text());
                    currenttable.totalDH++;
                });
                $(this).find("td").each(function(){
                    currentTableRows.DT[currentTableRows.DT.length] = $(this).text();
                    currentTableRows.CombinedText = currentTableRows.CombinedText + $(this).text();
  //                  console.log("TD: "+ $(this).text());

                });*/
                currenttable.tableRows[currenttable.tableRows.length]= currentTableRows;
            });
            currenttable.columnLength =  verifyPrintGoodTables(currenttable);
//        console.log(" -", $(this).children());
    });
    console.log(jsonizeValidTables());
}
