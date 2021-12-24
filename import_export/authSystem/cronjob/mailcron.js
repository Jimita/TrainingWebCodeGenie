var cron = require("node-cron");



if(config.scheduler){


cron.schedule(config.files.mailCron.time, async () => {
    console.log("mailCron process")
  });

}else{
  console.log("cron is off...");
}

// cron.start();
