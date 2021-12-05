(function(){var str = document.currentScript.src;var botId = str.split('/')[str.split('/').length-1].split('.')[0];fetch('https://api-talkbox.herokuapp.com/api/bots/verify', { method: "POST", body: JSON.stringify({
            bot: {id: botId}
        }),headers: { 'Accept': 'application/json', 'Content-type': 'application/json; charset=UTF-8', 'x-bot-referrer': window.location.href }}).then((data) => {if(!data) { return false; } else { data.json().then(result => { if(result.name) { console.log('verifying bot', result.name); let referred = result.referrers.filter(url => { return window.location.href.indexOf(url) > -1 });if(referred.length == 0) return false; var interval = null;var initialStyles = document.createElement('style');initialStyles.innerText = '#start-button-container { position: fixed; right:23px;  z-index: 214748000; bottom: 72px; user-select: none } #start-button { width:42px; height:42px; background-color:#599bb3; border-radius: 7px !important; margin: -3px; cursor: pointer; box-shadow:0px 0px 21px 0px #276873; }  #start-button-text { font-family: "Open Sans",sans-serif; font-size: 14px!important; font-weight: 400; position: relative; z-index: 214748000; cursor: pointer; background-color: #fff; color: #666; padding: 3px 8px; line-height: 2;border-radius: .625rem !important; white-space: normal; text-overflow: ellipsis; max-width: 105px; margin-left: -74px;  box-shadow: 0 0 20px 0 rgb(0 0 0 / 15%); animation: launcher-frame-appear 0.25s ease forwards; bottom: -42px; left: -50px} #start-button-text:before { content:""; position: absolute; width: 0; height: 0; left: auto; right: -15px; top: 28%; bottom: auto; border: 8px solid; border-color: transparent transparent transparent #fff;} #talkbox { z-index: 214748000; overflow: hidden !important;  display: none; transform: translateY(5%); position: fixed !important; bottom: 72px; right:20px;  max-height: 610px; min-height: 280px; margin: 0px; height: calc(100% - 90px - 20px); width: 377px; border-radius: 8px; box-shadow: 0 5px 40px rgba(0, 0, 0, .16) !important; transition: transform 0.2s ease-in-out; transition-property: transform, opacity; user-select:none } #talkbox.talkbox-active { display: block }  #talk-header { height: 5%;; user-select: none; background-color:#599bb3; }   #top-buttons { width: 97%; display: inline-block;} #close-button { border-radius: 50%; margin-top: 4px;  background-color: #DDD; width: 13px; text-align: center; float:right; font-size: 13px; font-family: monospace; } #inner-talkbox {  background-color:#FFF; height:93%; } #talk-box-iframe { z-index: 214748000; backgroung-color: #FFF; position: absolute; padding: 0px; margin: 0px; left: 0px; right: 0px; width: 100% !important; height: 94% !important; max-width: 100% !important; max-height: 100% !important; border: none; border-radius: 6px !important; visibility: visible !important;      opacity: 1 !important; display: block !important; pointer-events: initial !important; } @media only screen and (max-device-width: 567px), screen and (max-width: 450px) { #talkbox.talkbox-active { width: 100% !important; height: 100% !important; left: 0px !important; right: 0px !important; top: -24px !important; bottom: 0px !important; border-radius: 0px; max-height: initial; }'; var h = document.head || d.getElementsByTagName("head")[0]; h.appendChild(initialStyles);var talkBox = document.createElement('div');talkBox.id = 'talkbox';document.body.appendChild(talkBox);var talkHeader = document.createElement('div');talkHeader.id = 'talk-header';talkbox.appendChild(talkHeader);var topBtns = document.createElement('div');topBtns.id = 'top-buttons';talkHeader.appendChild(topBtns);var closeBtn = document.createElement('div');closeBtn.id = 'close-button';closeBtn.setAttribute('role', 'button');closeBtn.innerHTML = 'X';topBtns.appendChild(closeBtn);var innerTalkBox = document.createElement('div');innerTalkBox.id = 'inner-talkbox';talkBox.appendChild(innerTalkBox);var talkBoxIframe = document.createElement('iframe');talkBoxIframe.id = 'talk-box-iframe';talkBoxIframe.src = 'http://localhost:7000/cdn/talkbox.html?botid=61061edd5258eb196469efd5';talkBoxIframe.setAttribute('scrolling', 'no');innerTalkBox.appendChild(talkBoxIframe);var startBtnContainer = document.createElement('div');startBtnContainer.id = 'start-button-container';document.body.appendChild(startBtnContainer);var startBtnText = document.createElement('div');startBtnText.id='start-button-text';startBtnText.innerHTML = '<span> Lets talk </span>';startBtnContainer.appendChild(startBtnText);var startBtn = document.createElement('div');startBtn.id='start-button';startBtnContainer.appendChild(startBtn);closeBtn.addEventListener('click', function(e){ e.stopImmediatePropagation(); toggleTalkBox(); }, true ); startBtn.addEventListener('click', function(e){ e.stopImmediatePropagation(); toggleTalkBox(); }, true );        startBtnText.addEventListener('click', function(e){ e.stopImmediatePropagation(); toggleTalkBox(); }, true ); function toggleTalkBox() { if (talkBox.style.display == 'block'){ removeClass(talkBox, 'talkbox-active'); hideElement(talkBox); showElement(startBtnContainer); } else { addClass(talkBox,'talkbox-active'); showElement(talkBox); hideElement(startBtnContainer);  moveTalkBoxToBottom(); } } function hideElement(ele){ ele.style.display = 'none'; } function showElement (ele){ ele.style.display = 'block'; } function addClass(ele, classname) { ele.classList.add(classname); } function removeClass(ele, classname) { ele.classList.remove(classname); } function moveTalkBoxToBottom() { var bottom = 74; clearInterval(interval); interval = setInterval(function(){ if(bottom == 57) { clearInterval(interval); } else { bottom--; talkBox.style.bottom = bottom + 'px'; } },10); } } })}});}())
