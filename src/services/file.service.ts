import { Service, Inject } from 'typedi';
import { IBot, IBotInputDTO } from '../interfaces/IBot';
import Bot from '../models/Bot.model';
import logger from '../loaders/logger';
import fs from 'fs';
import config from '../config';
import { HexColourLuminosity } from '../common/HexColourLuminosity';

@Service()
export default class FileService {
    public async publishTalkbox(botId: string): Promise<boolean> {
        logger.debug(`get bot details for ${botId}`);
        let res: boolean = false;
        await Bot.findById(botId)
            .then((data: IBot) => {
                if (data) {
                    console.log('body', JSON.stringify(data))
                    //get file data
                    const jsBody: string = this._makeJsForTalkboxStarter(data);
                    const jsfilePath = `src/public/cdn/${botId}.js`;
                    // if(fs.existsSync(filePath)){
                    //     fs.unlink(filePath, (err) => {

                    //     })
                    // }
                    fs.writeFile(jsfilePath, jsBody, (err) => {
                        if (err) {
                            logger.error(`File could not be saved -> ${err.message}`);
                            throw err;
                        }
                        else {
                            logger.debug(`file written successfully -> ${jsfilePath}`);
                            res = true;
                        }
                    })
                    res = true;
                }
                else {
                    logger.error(`no bot found with id ${botId}`);
                }
            })
            .catch((err: Error) => {
                logger.error(`no bot found with id ${botId}, error returnedc-> ${err.message}`);
            });
        return res;
    }
    private _makeJsForTalkboxStarter(bot: IBot): string {
        const homeUrl = config.homeUrl;
        const talkbox_html = `<!DOCTYPE html><head><script> var botId = "${bot._id}" </script> </head> <body> <div id="chat-container"> <div id="chat-box"></div> <div id="type-box"> <div class="branding"></div>  </div> </div> <input type="hidden" id="session" /> <div> <script src="${homeUrl}/cdn/talkbox.js"></script> </div> </body> </html>`;
        // bot.startUpParams.startIconPosition.left is a boolean value to specify left or right
        const s_right = `${bot.startUpParams.startIconPosition.left ? 'left:93px;' : 'right:23px;'}`;
        //bot.startUpParams.startIconPosition.bottom is a pixel value to specify icon placement at the bottom
        const s_bottom = `bottom: ${bot.startUpParams.startIconPosition.bottom}px;`;
        const s_startButtonContainer = `#start-button-container { position: fixed; ${s_right}  z-index: 214748000; ${s_bottom} user-select: none }`;

        const s_height = `height:${bot.startUpParams.startIconSize.height}px;`;
        const s_width = `width:${bot.startUpParams.startIconSize.width}px;`;
        const s_background = `background-color:${bot.startUpParams.startIconBackground};`;
        const s_boxshadow = bot.startUpParams.startIconShadow.required ? `box-shadow:${bot.startUpParams.startIconShadow.style};` : '';
        const s_roundedIcon = bot.startUpParams.startIconRounded ? 'border-radius: 50% !important' : 'border-radius: 7px !important;';
        const s_startButton = `#start-button { ${s_width} ${s_height} ${s_background} ${s_roundedIcon} margin: -3px; cursor: pointer; ${s_boxshadow} } `;

        let s_startButtonText = '';
        if (bot.startUpParams.startIconText?.length > 0) {
            s_startButtonText = `#start-button-text { font-family: "Open Sans",sans-serif; font-size: 12px!important; font-weight: 400; position: relative; z-index: 214748000; cursor: pointer; background-color: #fff; color: #666; padding: 3px 8px; line-height: 1.5;border-radius: .625rem !important; white-space: normal; word-break: break-word; text-overflow: ellipsis; max-width: 149px; max-height: 60px; margin-left: -122px;  box-shadow: 0 0 20px 0 rgb(0 0 0 / 15%); animation: launcher-frame-appear 0.25s ease forwards; bottom: -${(bot.startUpParams.startIconSize.height - 20)}px; left: -${bot.startUpParams.startIconSize.width + 8}px} #start-button-text:before { content:""; position: absolute; width: 0; height: 0; left: auto; right: -15px; top: 28%; bottom: auto; border: 8px solid; border-color: transparent transparent transparent #fff;}`;
        }
        const s_talkboxbottom = `bottom: ${bot.startUpParams.startIconPosition.bottom}px;`;
        const s_talkboxright = `${bot.startUpParams.startIconPosition.left ? 'left:90px;' : 'right:20px;'}`;
        const s_talkbox = `#talkbox { z-index: 214748000; overflow: hidden !important;  display: none; transform: translateY(5%); position: fixed !important; ${s_talkboxbottom} ${s_talkboxright}  max-height: 610px; min-height: 280px; margin: 0px; height: calc(100% - 90px - 20px); width: 377px; border-radius: 8px; box-shadow: 0 5px 40px rgba(0, 0, 0, .16) !important; transition: transform 0.2s ease-in-out; transition-property: transform, opacity; user-select:none } #talkbox.talkbox-active { display: block } `;

        let s_talkboxheaderheight = '';
        let s_talkboxheadertext = '';
        let s_talkboxtopbuttons = '';
        if (bot.talkBoxParams.headerText?.length > 0) {
            s_talkboxheaderheight = 'height: 8%;';
            s_talkboxheadertext = '#talk-header-text { padding: 7px 11px 0px 23px; width: 64%; display: inline-block; color:#fff; font-weight:500 } ';
            if (bot.talkBoxParams.closeButton) {
                s_talkboxtopbuttons = '#top-buttons { width: 24%; display: inline-block;} #close-button { border-radius: 50%; margin-top: 4px;  background-color: #DDD; width: 13px; text-align: center; float:right; font-size: 13px; font-family: monospace; } ';
            }
        }
        else {
            s_talkboxheaderheight = 'height: 5%;';
            if (bot.talkBoxParams.closeButton) {
                s_talkboxtopbuttons = '#top-buttons { width: 97%; display: inline-block;} #close-button { border-radius: 50%; margin-top: 4px;  background-color: #DDD; width: 13px; text-align: center; float:right; font-size: 13px; font-family: monospace; }';
            }
        }
        const s_talkboxheaderbgcolor = `background-color:${bot.talkBoxParams.headerColor};`;
        const s_talkboxheader = `#talk-header { ${s_talkboxheaderheight}; user-select: none; ${s_talkboxheaderbgcolor} } `;

        let js = `(function(){`;
        js += `var str = document.currentScript.src;`;
        js += `var botId = str.split('/')[str.split('/').length-1].split('.')[0];`;
        // js += `var referers = ['${bot.referrers.join('\',\'')}'];`;
        js += `fetch('${homeUrl}/api/bots/verify', { method: "POST", body: JSON.stringify({
            bot: {id: botId}
        }),headers: { 'Accept': 'application/json', 'Content-type': 'application/json; charset=UTF-8', 'x-bot-referrer': window.location.href }})`;
        js += `.then((data) => {if(!data) { return false; } else { data.json().then(result => { if(result.name) { console.log('verifying bot', result.name); `;
        js += `let referred = result.referrers.filter(url => { return window.location.href.indexOf(url) > -1 });`
        js += `if(referred.length == 0) return false; `;
        js += `var interval = null;`;
        js += `var initialStyles = document.createElement('style');`;
        js += `initialStyles.innerText = '${s_startButtonContainer} ${s_startButton} ${s_startButtonText} ${s_talkbox} ${s_talkboxheader} ${s_talkboxheadertext} ${s_talkboxtopbuttons} #inner-talkbox {  background-color:#FFF; height:93%; } #talk-box-iframe { z-index: 214748000; background-color: ${bot.talkBoxParams.talkboxBackGround}; position: absolute; padding: 0px; margin: 0px; left: 0px; right: 0px; width: 100% !important; height: 94% !important; max-width: 100% !important; max-height: 100% !important; border: none; border-radius: 6px !important; visibility: visible !important;      opacity: 1 !important; display: block !important; pointer-events: initial !important; } @media only screen and (max-device-width: 567px), screen and (max-width: 450px) { #talkbox.talkbox-active { width: 100% !important; height: 100% !important; left: 0px !important; right: 0px !important; top: -24px !important; bottom: 0px !important; border-radius: 0px; max-height: initial; }'; `;
        js += 'var h = document.head || d.getElementsByTagName("head")[0]; ';
        js += 'h.appendChild(initialStyles);';
        js += `var talkBox = document.createElement('div');`;
        js += `talkBox.id = 'talkbox';`;
        js += `document.body.appendChild(talkBox);`;
        js += `var talkHeader = document.createElement('div');`;
        js += `talkHeader.id = 'talk-header';`;
        js += `talkbox.appendChild(talkHeader);`;
        if (bot.talkBoxParams.headerText?.length > 0) {
            js += `var talkHeaderText = document.createElement('div');`;
            js += `talkHeaderText.id = 'talk-header-text';`;
            js += `talkHeaderText.innerHTML = '${bot.talkBoxParams.headerText}';`;
            js += `talkHeader.appendChild(talkHeaderText);`;
        }
        if (bot.talkBoxParams.closeButton) {
            js += `var topBtns = document.createElement('div');`;
            js += `topBtns.id = 'top-buttons';`;
            js += `talkHeader.appendChild(topBtns);`;

            js += `var closeBtn = document.createElement('div');`;
            js += `closeBtn.id = 'close-button';`;
            js += `closeBtn.setAttribute('role', 'button');`;
            js += `closeBtn.innerHTML = 'X';`;
            js += `topBtns.appendChild(closeBtn);`;
        }
        js += `var innerTalkBox = document.createElement('div');`;
        js += `innerTalkBox.id = 'inner-talkbox';`;
        js += `talkBox.appendChild(innerTalkBox);`;
        js += `var talkBoxIframe = document.createElement('iframe');`;
        js += `talkBoxIframe.id = 'talk-box-iframe';`;
        js += `talkBoxIframe.srcdoc = '${talkbox_html}';`;
        js += `talkBoxIframe.setAttribute('scrolling', 'no');`;
        js += `innerTalkBox.appendChild(talkBoxIframe);`;
        js += `var startBtnContainer = document.createElement('div');`;
        js += `startBtnContainer.id = 'start-button-container';`;
        js += `document.body.appendChild(startBtnContainer);`;
        if (bot.startUpParams.startIconText?.length > 0) {
            js += `var startBtnText = document.createElement('div');`;
            js += `startBtnText.id='start-button-text';`;
            js += `startBtnText.innerHTML = '<span> ${bot.startUpParams.startIconText} </span>';`;
            js += `startBtnContainer.appendChild(startBtnText);`;
        }
        js += `var startBtn = document.createElement('div');`;
        js += `startBtn.id='start-button';`;
        js += `startBtnContainer.appendChild(startBtn);`;
        js += `closeBtn.addEventListener('click', function(e){ e.stopImmediatePropagation(); toggleTalkBox(); }, true ); startBtn.addEventListener('click', function(e){ e.stopImmediatePropagation(); toggleTalkBox(); }, true );        startBtnText.addEventListener('click', function(e){ e.stopImmediatePropagation(); toggleTalkBox(); }, true ); function toggleTalkBox() { if (talkBox.style.display == 'block'){ removeClass(talkBox, 'talkbox-active'); hideElement(talkBox); showElement(startBtnContainer); } else { addClass(talkBox,'talkbox-active'); showElement(talkBox); hideElement(startBtnContainer);  moveTalkBoxToBottom(); } } function hideElement(ele){ ele.style.display = 'none'; } function showElement (ele){ ele.style.display = 'block'; } function addClass(ele, classname) { ele.classList.add(classname); } function removeClass(ele, classname) { ele.classList.remove(classname); } function moveTalkBoxToBottom() { var bottom = 74; clearInterval(interval); interval = setInterval(function(){ if(bottom == 57) { clearInterval(interval); } else { bottom--; talkBox.style.bottom = bottom + 'px'; } },10); }`;
        js += ' } })}});';
        js += '}())';
        return js;
    }
}