exports.jsonifyTable = function(errors,window) {
    var $ = window.$;
    $("table").each(function() {
            console.log("New Table");
            $(this).find("tr").each(function(){
                    console.log("New table row");
                    //console.log($(this).text());
                $(this).find("th").each(function(){
                    console.log("TH: "+$(this).text());
                });
                $(this).find("td").each(function(){
                    console.log("TD: "+ $(this).text());

                });
            });
//        console.log(" -", $(this).children());
    });
}
