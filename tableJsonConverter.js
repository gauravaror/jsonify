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
    var cLengthArray = [];
    for (var j=0;j<ctable.tableRows.length;j++) {
        var cRow = ctable.tableRows[j];
        if(cLengthArray[cRow.lengthChild]) {
            cLengthArray[cRow.lengthChild]++;
        } else {
            cLengthArray[cRow.lengthChild] = 1;
        }
    }
    var sortable = [];
    for (var child in cLengthArray)
      sortable.push([child, cLengthArray[child]])
    sortable.sort(function(a, b) {return a[1] - b[1]})
    cLength = sortable[0][1];
    console.log("Clength: "+cLength);
    for (var j=0;j<ctable.tableRows.length;j++) {
        var cRow = ctable.tableRows[j];
        if(cRow.lengthChild  != cLength) {
            cRow.validRow = false;
            ctable.totalDH = ctable.totalDH - cRow.lengthDH;
            ctable.rowLength = ctable.rowLength - 1;
        }
    }
    ctable.validTable = true;
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
    return myString.replace(/[\r\n]/g,"").replace(/\"/g,"");
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
            //console.log(cleanString(table.tableRows[i].DT[0])+" : "+cleanString(table.tableRows[i].DT[1]));
                array[cleanString(table.tableRows[i].DT[0])] = cleanString(table.tableRows[i].DT[1]);
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
    //console.log("totalDH: "+table.totalDH+"table.columnLength: "+ table.columnLength+ "table.rowLength: "+table.rowLength);
    if(table.rowLength > 2){
        if(table.totalDH == table.columnLength ) {
            console.log("Jsoning the table as type 1");
            return getJSONType1(table);
        } else if (table.totalDH == table.rowLength) {
            console.log("Jsoning the table as type 2");
            return getJSONType2(table);        
        } else if ( table.totalDH == 0 && table.columnLength==2) {
            console.log("Jsoning the table as type 3");
            return getJSONType3(table);
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
    console.log("Number of table: "+$("table").length);
    $("table").each(function() {
            console.log("New Table");
            var currenttable = new tablesdatatype($(this).find("tr").length);
            tables[tables.length] = currenttable;
            console.log($(this).find("tr").length);
            console.log("heading"+$(this).prev(":header").text());
            currenttable.heading =  $(this).prev(":header").text();
            $(this).find("tr").each(function(){
//                console.log("New table row");
                var currentTableRows = new tableRows();
                currentTableRows.lengthDH = $(this).find("th").length;
                currentTableRows.lengthDT = $(this).find("td").length;
                currentTableRows.lengthChild = $(this).children().length;
//                console.log("TH NODES: "+$(this).find("th").length);
  //              console.log("TD NODES: "+$(this).find("td").length);
    //            console.log("Children: "+$(this).children().length);
                    //console.log($(this).text());
                $(this).find("th").each(function(){
                    currentTableRows.DH[currentTableRows.DH.length] = $(this).text();
//                    console.log("TH: "+$(this).text());
                    currenttable.totalDH++;
                });
                $(this).find("td").each(function(){
                    currentTableRows.DT[currentTableRows.DT.length] = $(this).text();
  //                  console.log("TD: "+ $(this).text());

                });
                currenttable.tableRows[currenttable.tableRows.length]= currentTableRows;
            });
            currenttable.columnLength =  verifyPrintGoodTables(currenttable);
//        console.log(" -", $(this).children());
    });
    console.log(jsonizeValidTables());
}
