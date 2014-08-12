var tables= [];
var tablesdatatype = function (rowslength) { 
    this.tableRows = [];
    this.rowLength = rowslength;
    this.columnLength =0;
    this.totalDH = 0;
    this.validTable = false;
}

var tableRows = function() {
    this.DH = [];
    this.DT = [];
    this.lengthDH = 0;
    this.lengthDT = 0;
    this.lengthChild = 0;
    this.validRow = false;
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
        } else {
            vTable = false;
        }
    }
    if(vTable) {
        console.log("table is valid: "+cLength);
        ctable.validTable = vTable;
        return cLength;
    }
}
function cleanString(myString) {
    return myString.replace(/[\r\n]/g,"");
}
function getJSONType1(table) {
    console.log("JSONizing with type 1,table.tableRows.length :"+table.tableRows.length);
    for(var i=1; i < table.tableRows.length; i++) {
        for( var j=0; j < table.columnLength; j++){
            console.log(cleanString(table.tableRows[0].DH[j])+" : "+cleanString(table.tableRows[i].DT[j]));
        }
    }
}

function getJSONType2(table) {
    console.log("JSONizing with type 2");
    for(var i=0; i < table.tableRows.length; i++) {
            console.log(cleanString(table.tableRows[i].DH[0])+" : "+cleanString(table.tableRows[i].DT[0]));
    }
}

function getJSONType3(table) {
    console.log("JSONizing with type 3");
    for(var i=0; i < table.tableRows.length; i++) {
            console.log(cleanString(table.tableRows[i].DT[0])+" : "+cleanString(table.tableRows[i].DT[1]));
    }
}

function getJSON(table) {
    console.log("totalDH: "+table.totalDH+"table.columnLength: "+ table.columnLength+ "table.rowLength: "+table.rowLength);
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
}

function jsonizeValidTables() {
console.log("jsoning the tables");
for (var i = 0;i < tables.length; i++) {
    if(tables[i].validTable) {
        getJSON(tables[i]);
    }
}

}

exports.jsonifyTable = function(errors,window) {
    var $ = window.$;
    console.log("Number of table: "+$("table").length);
    $("table").each(function() {
            console.log("New Table");
            var currenttable = new tablesdatatype($(this).find("tr").length);
            tables[tables.length] = currenttable;
            console.log($(this).find("tr").length);
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
    jsonizeValidTables();
}
