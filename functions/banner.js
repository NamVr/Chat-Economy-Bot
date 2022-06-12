/**
 * @file Application Startup Splash Screen
 * @author Naman Vrati
 * @since 1.0.0
 * @version 2.0.0
 */

// Initialize LeeksLazyLogger

const Logger = require("leekslazylogger");
// @ts-ignore
const log = new Logger({ keepSilent: true });

const { version, homepage } = require("../package.json");

module.exports = () => {
	log.success(`
	#     #               #     #        
	##    #   ##   #    # #     # #####  
	# #   #  #  #  ##  ## #     # #    # 
	#  #  # #    # # ## # #     # #    # 
	#   # # ###### #    #  #   #  #####  
	#    ## #    # #    #   # #   #   #  
	#     # #    # #    #    #    #    # 
    `);
	log.notice(`[NCE] NamVr Chat Economy Discord Bot v${version} by NamVr!`);
	log.success(homepage + "\n");
	log.success("Sponsor this project @ https://ko-fi.com/namanvrati" + "\n");
};
