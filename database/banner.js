const Logger = require("leekslazylogger");
const log = new Logger({ keepSilent: true });

const { version, homepage } = require("./../package.json");

module.exports = () => {
	log.success(`
    .S_sSSs     .S_SSSs     .S_SsS_S.    .S    S.    .S_sSSs    
    .SS~YS%%b   .SS~SSSSS   .SS~S*S~SS.  .SS    SS.  .SS~YS%%b   
    S%S   \`S%b  S%S   SSSS  S%S \`Y' S%S  S%S    S%S  S%S   \`S%b  
    S%S    S%S  S%S    S%S  S%S     S%S  S%S    S%S  S%S    S%S  
    S%S    S&S  S%S SSSS%S  S%S     S%S  S&S    S%S  S%S    d*S  
    S&S    S&S  S&S  SSS%S  S&S     S&S  S&S    S&S  S&S   .S*S  
    S&S    S&S  S&S    S&S  S&S     S&S  S&S    S&S  S&S_sdSSS   
    S&S    S&S  S&S    S&S  S&S     S&S  S&S    S&S  S&S~YSY%b   
    S*S    S*S  S*S    S&S  S*S     S*S  S*b    S*S  S*S   \`S%b  
    S*S    S*S  S*S    S*S  S*S     S*S  S*S.   S*S  S*S    S%S  
    S*S    S*S  S*S    S*S  S*S     S*S   SSSbs_S*S  S*S    S&S  
    S*S    SSS  SSS    S*S  SSS     S*S    YSSP~SSS  S*S    SSS  
    SP                 SP           SP               SP          
    Y                  Y            Y                Y                                                  
    `);
	log.notice(
		`[NCE] NamVr Chat Economy Discord Bot v${version} by Naman Vrati!`
	);
	log.success(homepage + "\n");
	log.success("Sponsor this project @ https://ko-fi.com/namanvrati" + "\n");
};
