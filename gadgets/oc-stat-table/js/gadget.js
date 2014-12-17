/*
  1. Add command sending feature
  2. Modify the API view dialog [add labels to every input]
  3. Make the API works for individual nodes [chart and stat]
  4. Fix the metadata problem
  5. Add new data cache
  6. Add new class called RealTimeReader [register, update, read]


  *if status is not running ignore publishing data to chart


*/


$(function(){
	//hide the dialog component
	$('#dialog').hide();
  var prefs = new gadgets.Prefs();
  var dataFile = prefs.getString("dataSource");
  var interval = getInterval(prefs.getString("interval"));
  

            
  //DATA TABLE setup          
  var oTable = $('table').dataTable({
    'fnDrawCallback': function(){
        $('td').addClass('hello')
    }
  });
          



//DATA TABLE interval 
 setInterval(function(){
    $.getJSON(dataFile, function(jsonArray){
          oTable.fnClearTable();
          jsonArray.map(function(json){
              var name = json.name;
              var domain = json.domain;
              var subDomain = json.subDomain;
              var adminServiceUrl = json.adminServiceUrl;
              var status = json.status;
              var freeMemory = json.freeMemory;
              var serverUpTime = json.serverUpTime;
              var threadCount = json.threadCount;
              var loadAverage = json.loadAverage;

              var commands = "<a href='#'>Restart</a><br/>";
                  commands += "<a href='#'>G Restart</a><br/>";
                  commands += "<a href='#'>Shutdown</a><br/>";
                  commands += "<a href='#'>GShutdown</a><br/>";
             

              oTable.fnAddData([
                                name,
                                domain,
                                subDomain,
                                freeMemory,
                                serverUpTime,
                                threadCount,
                                loadAverage,
                                adminServiceUrl,
                                status,
                                "",
                                commands
                                ]);
          });
          oTable.fnDraw();
    });

 }, interval * 1000);
//DATA TABLE end




              //API view dialog box start
              var url = "";
              var apiCol = "";
              $(document).on("click", "table tr td", function(e) {
                  apiCol = $(this).text();
              });

              $(document).on("click", "table tr", function(e) {
                  var tds = $(this).find('td');
                  tds.map(function(td){
                      var text = $(tds[td]).text();
                      if(text.indexOf('https') > -1){
                          url = text;
                      }
                  });


                  url = getId(url);
                  var loadApi = "/oc/api/chart/load/"+getId(url);
                  var memoryApi = "/oc/api/chart/memory/"+getId(url);
                  var usageApi = "/oc/api/chart/usage/"+getId(url);

                  var inputs = getInputField(loadApi);
                      inputs += getInputField(memoryApi);
                      inputs += getInputField(usageApi);

                  if(apiCol == ""){
                    $('#dialog').html(inputs);
                    $("#dialog").dialog({
                      width:'400'
                    });
                  }
                  
              });

              //API view dialog end

              
              function getInputField(val){
                return '<input type="text"  size="35" value="'+val+'" /></br>';
              }





                function getId(url){
                  var id = url;
                  var re = new RegExp(':', 'g');
                    id = id.replace(re, '');

                    re = new RegExp('/', 'g');
                    id = id.replace(re, '');

                    id = id.split('.').join('');

                    return id;
                }

             
              function getInterval(s){
                var i = 0;
                try{

                  if(isNaN(parseFloat(""+s))){
                    i = 0;
                  }else{
                    i = parseFloat(""+s);
                  }
                }
                catch(e){
                  i = 0;
                }
                return i;
              }



          });