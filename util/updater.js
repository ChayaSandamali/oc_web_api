
include("operations_center_cache_manager.jag");

//UNKNOWN, STARTING, RUNNING, PENDING RESTART, PENDING SHUTDOWN, RESTARTING


function updateData () {
    //include("operations_center_cache_manager.jag");
	var log = new Log('updader.js');

    var date = new Date();
    var currentTime = date.getTime();

    var nodeCache = getServers();
    //log.info(getServers());
    if (nodeCache != null){
        //application.put("yyy", nodeCache)
        for (var index = 0; index < nodeCache.length; index++) {
            var node = nodeCache[index];
            //log.info(node);
            
            if (node != null) {
                if (currentTime - node.reportedTime > 5000){
                    
                    var misses = parseInt((currentTime - node.reportedTime) / 5000);

                    //test


                    //log.info('misses: '+ misses);
                    if(misses < 10) {
                        if(node.status == Status.RESTARTING || node.status == Status.SHUTTING_DOWN || node.status == Status.GRACEFULL_RESTART || node.status == Status.GRACEFULL_SHUTDOWN) {
                            // Keep the sftatus unchanged.
                            // node.status == "RESTARTING : " + misses;
                        }else{

                            node.status = "MISSING_HB:" + misses;
                        }
                    }else{

                        if((node.status == Status.RESTARTING && misses > 10) || (node.status == Status.SHUTTING_DOWN && misses > 10) || (node.status == Status.GRACEFULL_RESTART && misses > 10) || (node.status == Status.GRACEFULL_SHUTDOWN && misses > 10)){
                            //node.status = Status.SERVER_DOWN;
                            node.status = Status.SERVER_DOWN+"_HB:" + misses;
                        }else{
                            node.status = Status.NOT_REPORTING;
                        }
                        
                    }
                }
            }
        }
        //nodeCache[index] = node.status;
    }

};

var watchdog = setInterval(function(){updateData()},1000);