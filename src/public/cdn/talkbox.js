// var str = window.location.href;
// var botId = str.match(/botId=([^&]*)/)[1];
var homeurl = "http://localhost:7000";
var questionDelay = 2000;
var answerDelay = 500;
var resetQuestion = {
    id: "66666-99999-00000",
    text
        : "This chat terminated abruply <br> Really sorry....<br> Please start over...",
    type: 'option',
    responseValidation: null,
    options: [
        { text: "Start Over", value: "0", linkedQuestion: firstQuestion },
    ],
    waitForReply: false
};

(function () {
    setTimeout(() => {
        //get the bot
        fetch(`${homeurl}/api/bots/referrer`, {
            method: "POST",
            body: JSON.stringify({
                bot: { id: botId },
            }),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json; charset=UTF-8",
                "x-bot-referrer": window.location.href,
            },
        })
            .then((response) => {
                response.json().then((bot) => {
                    console.log(bot);
                    if (bot._id == botId) {
                        putStyles(bot);
                        var h = document.head || d.getElementsByTagName("head")[0];
                        let s = document.createElement('script');
                        s.innerText = `var conversation = ${JSON.stringify(bot.conv)};`;
                        h.appendChild(s);
                        display(firstQuestion, questionDelay)
                    }
                });
            })
            .catch((err) => {
                return false;
            });
    }, 1000);
})();

function putStyles(bot) {
    const themePrimaryColor = bot.themeColors.themePrimaryColor;
    const themeBoxShadowColor = bot.themeColors.themeBoxShadowColor;
    const themeTextShadowColor = bot.themeColors.themeTextShadowColor;
    const themeHoverBackGroundColor = bot.themeColors.themeHoverBackGroundColor;
    const botTextWrapperColor = getLightColorFromBg(bot.talkBoxParams.talkboxBackGround);

    let typeBoxTopValue = bot.talkBoxParams.headerText?.length > 0 ? '84%' : '94%';
    if (bot.talkBoxParams.logoText.length == 0) {
        typeBoxTopValue = '99%';
    }
    var startStyles = document.createElement("style");
    startStyles.innerText = `body { margin-left: 0px; font-family: system-ui; } ::-webkit-scrollbar { width: 9px; } ::-webkit-scrollbar-track { background-color: ${botTextWrapperColor}; border-radius: 10px; } ::-webkit-scrollbar-thumb { background: #DDD; border-radius: 10px; } #chat-container { width: 96%; height: 100%; background-color: ${bot.talkBoxParams.talkboxBackGround}; position: absolute; top: 0px; } #chat-box { border-radius:4px; padding-left: 7px; user-select: none; background-color:${bot.talkBoxParams.talkboxBackGround}; overflow-y:scroll; height: 87%; width:101%; } .chat-box-branding { height:91% !important; } #type-box { background-color: #FFF; width: inherit; height: 100%; position: fixed; bottom: 1px; z-index: 3; top: ${typeBoxTopValue}; border-top: 1px solid #ddd; right: 0%; width: 100%; -webkit-transition: all 0.35s ease-out; } .type-box-branding { top:91% !important; } #type-box-text-container { width: 87%; display: inline-block; padding-top: 3px; } #type-box-button-container { width: 4%; display: inline-block; margin-left: 15px; margin-top: 10px; } #type-box-text { resize: none; word-wrap: break-word; width: 100%; height: 46px; font-size: 16px; border-style: none; outline: none; border-top: 1px solid #ddd; padding: 15px 45px 15px 16px; box-sizing: border-box; overflow: hidden; } .error-validation { border: 1px solid red !important; } #send-button { user-select: none } .send-button-active { border-left: 25px solid ${themePrimaryColor} !important; }`;
    var h = document.head || d.getElementsByTagName("head")[0];
    h.appendChild(startStyles);
    var optionStyles = document.createElement("style");
    optionStyles.innerText = `.bot-text-wrapper { background-color: ${botTextWrapperColor}; padding: 7px;  margin-top: 12px; margin-left: 3px; width: 85%; border-radius: 5px; padding-bottom: 15px; } .text { padding: 2px; font-weight: 400; letter-spacing: 1px; font-family: inherit; } .options-container { padding: 2px;   margin-top: 5px; padding-top: 2px; } .options-container div { margin-right: 5px; letter-spacing: 1px;  box-shadow: 1px 3px 9px 0px ${themeBoxShadowColor}; color:#ffffff; font-family: Arial; background-color:${themePrimaryColor}; padding: 3px 7px; font-size:16px; font-weight:bold; text-decoration:none; border-radius: 4px; display: inline-flex; width: max-content; text-shadow:0px 1px 0px ${themeTextShadowColor}; } .options-container div:hover { background-color: ${themeHoverBackGroundColor}; cursor: pointer; } .options-container div:active { position:relative; top:1px; } .rounded { border-radius:50% !important; } .multi-container { padding: 2px; margin: 5px 5px 5px 12px; padding-top: 2px; max-height: 200px; overflow-y: scroll; } .multi-container div { margin: 7px; letter-spacing: 1px; box-shadow: 1px 3px 9px 0px ${themeBoxShadowColor}; padding: 3px 7px; text-decoration:none; user-select: none; border-radius: 4px; display: inline-flex; width: max-content; } .multi-btn { display: inline-flex; letter-spacing: 1px; line-height: 0; padding: 15px; box-shadow: 0px 10px 14px -7px ${themeBoxShadowColor}; background-color:${themePrimaryColor}; border-radius: 5px; margin: 10px; font-family:Arial; font-size:16px; font-weight:bold; text-decoration:none; text-shadow:0px 1px 0px ${themeTextShadowColor}; color:#ffffff; } .multi-btn:hover { background-color:${themeHoverBackGroundColor}; } .multi-btn:active { position:relative; top:1px; } .res-text { padding-right: 12px; margin: 7px; background-color: ${themeHoverBackGroundColor}; color: white; letter-spacing: 1px; font-family: inherit; padding-left: 12px; margin-left: 11%; border-radius: 4px;   min-width: 100px; } .btn-container-text { text-align: center; box-shadow: 0px 2px 5px 0px ${themeBoxShadowColor}; background-color: ${themePrimaryColor}; border-radius: 4px; cursor: pointer; color: #ffffff; font-family: Arial; font-size: 16px; font-weight: bold; letter-spacing: 1px; padding: 8px 1px; text-decoration: none; margin: 9px; text-shadow: 0px 1px 0px ${themeTextShadowColor};} btn-container-text:hover { background-color: ${themeHoverBackGroundColor}; } .btn-container-text:active { position:relative; top:1px; } #loader { width:fit-content; } .arrow-right { width: 0; height: 0; border-top: 12px solid transparent; border-bottom: 12px solid transparent;  border-left: 25px solid ${themePrimaryColor}; position: relative; top: -34px; float: right; } .arrow-right:hover { border-left: 25px solid ${themeHoverBackGroundColor}; } .branding { text-align: center; font-size: medium; font-family: monospace; letter-spacing: 2px; padding-top: 6px; user-select: none; transition: ease 2s } .cal-cover { top: 12% !important; }`;
    h.appendChild(optionStyles);
    var shineStyle = document.createElement("style");
    shineStyle.innerText = `.btn-shine {  color: #fff; background: linear-gradient(to right, #02135c 0, #fff 10%, #02135c 20%); background-position: 0; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shine 3s infinite linear; animation-fill-mode: forwards; -webkit-text-size-adjust: none;   font-weight: 600; font-size: 57px; text-decoration: none; white-space: nowrap; line-height: 1; margin-top:-35px; } @-moz-keyframes shine { 0% { background-position: 0; } 60% { background-position: 180px; } 100% { background-position: 180px; }} @-webkit-keyframes shine { 0% { background-position: 0; } 60% { background-position: 180px; } 100% {  background-position: 180px; }} @-o-keyframes shine { 0% { background-position: 0; } 60% { background-position: 180px; } 100% { background-position: 180px; }} @keyframes shine { 0% { background-position: 0; } 60% { background-position: 180px; } 100% { background-position: 180px; }}`;
    h.appendChild(shineStyle);
    var calStyles = document.createElement("style");
    calStyles.innerText = `.cal-cover-container { z-index: 9999; display: block; position: relative; color: #333; background: #fff; border-bottom-color: #bbb; font-family: Helvetica, Arial, sans-serif; min-width: 234px; max-width:334px; height: 100%; padding-top: 12px; margin: 0 auto; } .calendar { margin:8px; border:1px solid #276873; } .cal-head { text-align:center; border: 1px solid #DDD; } .cal-head-label {    font-family:inherit; color:black; display:inline-block; padding: 5px 3px; font-weight:bold; border-style:none; } .cal-day-title { font-size: 14px; font-weight:500; font-family:inherit; letter-spacing: 2px; padding: 4px 0px; } .btn-prev { width: 0; height: 0; border-top: 9px solid transparent; border-bottom: 9px solid transparent; border-right: 12px solid ${themePrimaryColor}; float: left; position: relative; top: 5px; } .btn-next { width: 0; height: 0; border-top: 9px solid transparent;  border-bottom: 9px solid transparent; border-left: 12px solid ${themePrimaryColor}; float: right; position: relative; top: 5px; } .btn-prev:hover { border-right: 12px solid #4c8498; } .btn-next:hover {   border-left: 12px solid ${themeHoverBackGroundColor}; } .cal-table { width: 100%; border-collapse: collapse; border-spacing: 0; border: 0; } .cal-table th { border:1px solid #DDD; width: 44px; } .cal-cell { background-color: #EEE; border: 1px solid #DDD; font-size: 14px; text-align: center; user-select: none; } .btn-cal { font-weight: 500; background-color: ${botTextWrapperColor}; margin: 4px; } .btn-times { font-weight: 500; margin: 3px; display: inline-flex; width: max-content; background-color: #EEE; border: 1px solid ${themePrimaryColor}; font-size: 14px; text-align: center; user-select: none; padding: 3px; border-radius: 4px; } .disabled { color:gray; background-color:transparent; } .disabled-btn { background-color:#bbb !important; } .active { background-color: ${themeHoverBackGroundColor}; color:#FFF } .selected { background-color: ${themeHoverBackGroundColor}; color:#FFF; } .selected-time { background-color: ${themeHoverBackGroundColor}; color:#FFF; } .cal-times { max-height: 119px; overflow-y: scroll; width: 323px; margin: 0 auto; text-align: center; margin-bottom: 6px; } cal-res { margin-top:4px; font-weight:bold; text-align:center; } .cal-res-date { display: inline-flex; margin-right:5px; } .cal-res-time { display: inline-flex; } .cal-buttons { text-align: center; } .cal-buttons-time-offset { bottom: 2% !important; } .cal-buttons-cancel { display: inline-flex; letter-spacing: 1px; line-height: 0; padding: 15px; box-shadow: 0px 10px 14px -7px ${themeBoxShadowColor}; background-color: ${themePrimaryColor}; border-radius: 5px; margin: 10px; font-family:Arial; font-size:16px; font-weight:bold; text-decoration:none; text-shadow:0px 1px 0px ${themeTextShadowColor}; color:#ffffff; } .cal-buttons-cancel::after { content:'cancel' } .cal-buttons-cancel:hover { background-color:${themeHoverBackGroundColor}; } .cal-buttons-cancel:active { position:relative; top:1px; } .cal-buttons-confirm { display: inline-flex; letter-spacing: 1px; line-height: 0; padding: 15px; box-shadow: 0px 10px 14px -7px ${themeBoxShadowColor}; background-color: ${themePrimaryColor}; border-radius: 5px; margin: 10px; font-family:Arial; font-size:16px; font-weight:bold; text-decoration:none; text-shadow:0px 1px 0px ${themeTextShadowColor}; color:#ffffff; } .cal-buttons-confirm::after { content:'confirm'; } .cal-buttons-confirm:active { position:relative; top:1px; } .cal-buttons-confirm:hover { background-color: ${themeHoverBackGroundColor}; } .cal-footer { text-align: center; font-size: 8px; letter-spacing:1px; font-weight:800; position:fixed; z-index:1; bottom:17px; }`;
    h.appendChild(calStyles);
    //set the branding if any
    if (bot.talkBoxParams.logoText.length > 0) {
        document.getElementsByClassName('branding')[0].innerText = bot.talkBoxParams.logoText;
    }
}
function sendToServer(q, a) {
    // make a persistant session id
    let _session = botId.substr(0, 4) + btoa(new Date().toString()) + botId.substr(4, botId.length);
    if (!document.getElementById('session').value) {
        document.getElementById('session').value = _session;
    }
    else {
        _session = document.getElementById('session').value;
    }
    console.log('send to server -- >   Q:', JSON.stringify(a), ' A:', JSON.stringify(a));
    fetch(`${homeurl}/api/bots/botresponse`, {
        method: "POST",
        body: JSON.stringify({
            bot: { id: botId },
            botresponse: { botId: botId, question: q, answer: a, session: _session },
        }),
        headers: {
            Accept: "application/json",
            "Content-type": "application/json; charset=UTF-8",
            "x-bot-referrer": window.location.href,
        },
    })
}
function display(questionId, delay) {
    showloader();
    let question = conversation.filter(function (el) {
        return el.id == questionId;
    })[0];
    if (!question) {
        question = resetQuestion;
    }
    let chatBox = document.getElementById('chat-box');
    let html = '';
    switch (question.type) {
        case 'text':
            html += '<div class="bot-text-wrapper">';
            html += `<div class="text"> ${question.text} </div>`;
            html += '</div>';
            break;
        case 'option':
            html += '<div class="bot-text-wrapper">';
            html += `<div class="text"> ${question.text} </div>`;
            html += `<div class="options-container" id="${question.id}-options">`;
            question.options.forEach(element => {
                html += `<div data-id="${question.id}" data-value="${element.value}" id="${question.id}${element.value}">${element.text}</div>`;
            });
            html += '</div>';
            html += '</div>';
            break;
        case 'phone':
            html += '<div class="bot-text-wrapper">';
            html += `<div class="text"> ${question.text} </div>`;
            html += '</div>';
            break;
        case 'date':
        case 'meeting':
            let meetingConf = question?.config;
            if (!meetingConf) {
                socket.emit('error', { errorMsg: 'Config not found', id: id, question: question });
                display("66666-99999-00000");
            }
            else {
                html += '<div class="bot-text-wrapper">';
                html += `<div class="text"> ${question.text} </div>`;
                html += `<div class="btn-container-text">${question.buttonText ? question.buttonText : 'select a date'}`;
                html += '</div>';
            }
            break;
        case 'multi':
            html += '<div class="bot-text-wrapper">';
            html += `<div class="text"> ${question.text} </div>`;
            html += `<div class="multi-container" id="${question.id}-multi">`;
            question.options.forEach(element => {
                html += `<div data-id="${question.id}" data-value="${element.value}" id="${question.id}${element.value}"><input type="checkbox" name="${question.id}${element.value}"><label for="${question.id}${element.value}">${element.text}</label></div>`;
            });
            html += '</div>';
            html += '<div class="cal-buttons">';
            html += '<div class="multi-btn" id="multi-btn-cancel">Skip this</div>';
            html += '<div class="multi-btn" id="multi-btn-choose">Choose</div>';
            html += '</div>';
            break;
        case 'rating':
            html += '<div class="bot-text-wrapper">';
            html += `<div class="text"> ${question.text} </div>`;
            html += `<div class="options-container" id="${question.id}-rating">`;
            if (question.style == 'star') {
                for (let j = 0; j < 5; j++) {
                    let element = question.options[j];
                    html += `<div data-id="${question.id}" data-value="${element}" id="${question.id}${element}" ${question.style ? `class="${question.style}"` : ''}">★</div>`;
                }
            }
            else {
                question.options.forEach(element => {
                    html += `<div data-id="${question.id}" data-value="${element}" id="${question.id}${element}" ${question.style ? `class="${question.style}"` : ''}">${element}</div>`;
                });
            }
            html += '</div>';
            html += '</div>';
            break;
        default:
            break;
    }
    setTimeout(() => {
        let loaderEl = document.getElementById('loader');
        let textBox = document.getElementById('type-box');
        if (loaderEl) {
            loaderEl.remove();
        }
        if (chatBox.innerHTML != '' && question.id == '0') {
            chatBox.innerHTML = '';
        }
        chatBox.innerHTML += html;
        chatBox.scrollTop = chatBox.scrollHeight;
        if (question.type == 'option' || question.type == 'rating') {
            let options = document.getElementsByClassName('options-container')[0].children;
            for (let i = 0; i < options.length; i++) {
                let option = options.item(i);
                option.addEventListener('click', (_e) => {
                    if (question.type == 'rating' && question.style == 'star')
                        option.innerHTML = option.dataset.value.toString();
                    sendOption(option.dataset.id, option.innerHTML, option.dataset.value);
                })
            }
            // setNextQuestion(question);
        }
        if (question.type == 'date' || question.type == 'meeting') {
            let btnDate = document.getElementsByClassName('btn-container-text')[0];
            btnDate.addEventListener('click', (_e) => {
                addChatBoxCover();
                let calhtml = '<div class="cal-cover-container">'
                calhtml += '<div class="calendar" id="calendar">';
                calhtml += '<div class="cal-head" role="heading">';
                calhtml += '<div class=btn-prev id=btn-prev role="button"></div>';
                calhtml += '<select class="cal-head-label" id="month-select"></select>';
                calhtml += '<select class="cal-head-label" id="year-select"></select>';
                calhtml += '<div class=btn-next id=btn-next role="button"></div>';
                calhtml += '</div>';
                calhtml += '<div id="cal-table" class="cal-table"></div>';
                calhtml += '</div>';
                calhtml += '<div class="cal-times" id="cal-times"></div>';
                calhtml += '<div class="cal-res">';
                calhtml += '<div class="cal-res-date"></div>';
                calhtml += '<div class="cal-res-time"></div>';
                calhtml += '</div>';
                calhtml += '<div class="cal-buttons">';
                calhtml += '<div class="cal-buttons-cancel" id="cal-buttons-cancel"></div>';
                calhtml += '<div class="cal-buttons-confirm disabled-btn " id="cal-buttons-confirm"></div>';
                calhtml += '</div>';
                calhtml += `<div class="cal-footer">timezone - ${question.config?.timezoneName}`;
                calhtml += '</div>';
                calhtml += '</div>';
                textBox.innerHTML = calhtml;
                makeCalander(question.config, question.type);
                document.getElementById('cal-buttons-cancel').addEventListener('click', (e) => {
                    removeChatBoxCover();
                    showBranding();
                });
                document.getElementById('cal-buttons-confirm').addEventListener('click', (e) => {
                    let answer = document.getElementsByClassName('cal-res-date')[0].innerText;
                    if (question.type == 'meeting')
                        answer += `, ${document.getElementsByClassName('cal-res-time')[0].innerText}`;
                    if (answer.length > 5) {
                        if (question.type == 'meeting' && answer.split(',')[1].length < 5)
                            return false;
                        removeChatBoxCover();
                        sendToServer(question, answer);
                        showBranding();
                        btnDate.remove();
                        show(answer, () => {
                            setNextQuestion(question);
                        });
                    }
                    else {
                        return false;
                    }
                });
            });
        }
        if (question.type == 'multi') {
            let btnChoose = document.getElementById('multi-btn-choose');
            let btnCancel = document.getElementById('multi-btn-cancel');
            btnChoose.addEventListener('click', (_e) => {
                document.getElementsByClassName('cal-buttons')[0].remove();
                let answer = '';
                let chkArray = document.getElementsByClassName('multi-container')[0].children;
                for (let chk of chkArray) {
                    if (chk.children[0].checked) {
                        answer += `,${chk.innerText}`;
                        chk.style.color = '#408c99';
                    }
                    chk.children[0].setAttribute('disabled', 'disabled');
                }
                answer = answer.substr(1, answer.length);
                sendToServer(question.id, answer);
                show(answer, () => {
                    setNextQuestion(question);
                });
            });
            btnCancel.addEventListener('click', (_e) => {
                // removeChatBoxCover();
                showBranding();
            })
        }
        if (question.type == 'text' || question.type == 'phone') {
            setNextQuestion(question);
        }

    }, delay);
}
function addChatBoxCover() {
    let textBox = document.getElementById('type-box');
    addClass(textBox, 'cal-cover');
}
function removeChatBoxCover() {
    let textBox = document.getElementById('type-box');
    removeClass(textBox, 'cal-cover');
}
function showBranding() {
    let textBox = document.getElementById('type-box');
    let chatBox = document.getElementById('chat-box');
    addClass(textBox, 'type-box-branding');
    addClass(chatBox, 'chat-box-branding');
    textBox.innerHTML = `<div class="branding">talkbox by vaunz</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}
function showInput(question) {
    let textBox = document.getElementById('type-box');
    let chatBox = document.getElementById('chat-box');
    removeClass(textBox, 'type-box-branding');
    removeClass(chatBox, 'chat-box-branding');
    textBox.innerHTML = `<textarea id="type-box-text" placeholder="${question?.placeholder}"></textarea>
            <div id="send-button" class="arrow-right" onclick="send(${question.id})"></div>`;
    if (question.responseValidation) {
        let textarea = document.getElementById('type-box-text');
        let sendBtn = document.getElementById('send-button');
        textarea.addEventListener('keyup', (e) => {
            let val = document.getElementById('type-box-text').value;
            var pattern = new RegExp(`${question.responseValidation}`);
            if (!pattern.test(val)) {
                addClass(textarea, 'error-validation');
                removeClass(sendBtn, 'send-button-active');
            }
            else {
                removeClass(textarea, 'error-validation');
                addClass(sendBtn, 'send-button-active');
            }
        })
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}
function setNextQuestion(question) {
    if (!question.waitForReply) {
        showBranding();
        if (question.nextQuestion && question.nextQuestion != question.id) {
            console.log('showing next:', question.nextQuestion);
            display(question.nextQuestion, questionDelay)
        }
    }
    else
        showInput(question);

}
function makeCalander(config, type) {
    let calDays = config.weekdays;
    let today = new Date();
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let selectedMonth = '';
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let years = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3];
    var yearSelect = document.getElementById('year-select');
    let monthSelect = document.getElementById('month-select');
    let nextBtn = document.getElementById('btn-next');
    let prevBtn = document.getElementById('btn-prev');
    let selected = today;
    years.forEach(y => {
        yearSelect.innerHTML += `<option value="${y}">${y}</option>`
    });
    yearSelect.addEventListener('change', (e) => {
        monthSelect.innerHTML = '';
        document.getElementsByClassName('cal-res-time')[0].innerHTML = '';
        if (years[yearSelect.selectedIndex] == currentYear) {
            let tempMonth = currentMonth < selectedMonth ? selectedMonth : currentMonth;
            months.forEach((y, i) => {
                monthSelect.innerHTML += `<option value="${y}" ${i == tempMonth ? 'selected="selected"' : ''} ${i < currentMonth ? 'disabled' : ''}>${y}</option>`
            });
        }
        else {
            months.forEach((y, i) => {
                monthSelect.innerHTML += `<option value="${y}" ${i == selectedMonth ? 'selected="selected"' : ''}">${y}</option>`
            });
        }
        getdates(config.weekdays, config.offDays);
    });
    monthSelect.addEventListener('change', (e) => {
        selectedMonth = monthSelect.selectedIndex;
        // if(question.type == 'meeting') {
        //     document.getElementsByClassName('cal-res-time')[0].innerHTML = '';
        // }
        getdates(config.weekdays, config.offDays);
    });
    months.forEach((y, i) => {
        monthSelect.innerHTML += `<option value="${y}" ${i == currentMonth ? 'selected="selected"' : ''} ${i < currentMonth ? 'disabled' : ''}>${y}</option>`
    });
    monthSelect.setAttribute('selectedvalue', months[currentMonth]);
    getdates(config.weekdays, config.offDays);

    function getdates(weekdays, offDays) {
        let day = 1;
        var month = monthSelect.selectedIndex;
        var year = years[yearSelect.selectedIndex];
        let firstDay = new Date(year, month, 1).getDay();
        let daysInMonth = new Date(year, month + 1, 0).getDate();
        let html = '<table cellpadding="0" cellspacing="0" class="cal-table" role="presentation">';
        html += `<thead><tr><th scope="col"><div class="cal-day-title" data-title="Sunday">Sun</div></th><th scope="col"><div class="cal-day-title" data-title="Monday">Mon</div></th><th scope="col"><div data-title="Tuesday" class="cal-day-title" >Tue</div></th><th scope="col"><div data-title="Wednesday" class="cal-day-title" >Wed</div></th><th scope="col"><div data-title="Thursday" class="cal-day-title" >Thu</div></th><th scope="col"><div data-title="Friday" class="cal-day-title" >Fri</div></th><th scope="col"><div data-title="Saturday"class="cal-day-title">Sat</div></th></tr></thead>`;
        html += `<tbody>`;
        //5 rows
        for (let row = 1; row <= 6; row++) {
            html += `<tr>`;
            //7 days per row
            for (let col = 1; col <= 7; col++) {
                if (firstDay >= col && row == 1) {
                    html += `<td class="cal-cell"></td>`
                }
                else {
                    if (daysInMonth < day)
                        html += `<td class="cal-cell"></td>`
                    else {
                        if (weekdays.includes(col) && !offDays.includes(new Date(year, month, day).ddmmyyyy())) {
                            if (selected.getMonth() == month && selected.getDate() == day && selected.getFullYear() == year) {
                                html += `<td class="cal-cell"><div class="btn-cal selected" data-month=${month} data-year=${year} id="btn-cal">${day}</div></td>`;
                            }
                            else {
                                if (today.getMonth() == month && day <= today.getDate()) {
                                    html += `<td class="cal-cell"><div class="btn-cal disabled">${day}</div></td>`;
                                }
                                else {
                                    html += `<td class="cal-cell"><div class="btn-cal" data-month=${month} data-year=${year} id="btn-cal">${day}</div></td>`;
                                }
                            }
                        }
                        else {
                            html += `<td class="cal-cell"><div class="btn-cal disabled">${day}</div></td>`;
                        }

                        day++;
                    }
                }
            }
            html += '</tr>';
        }
        html += `</tbody></table>`;
        document.getElementById('cal-table').innerHTML = html;
        let btnCalArray = document.getElementsByClassName('btn-cal');
        for (let btn of btnCalArray) {
            if (!btn.classList.contains('disabled') && !btn.classList.contains('active')) {
                btn.addEventListener('click', (e) => {
                    console.log(`date: ${e.target.innerText}\\${Number(e.target.dataset.month) + 1}\\${e.target.dataset.year}`);
                    document.getElementsByClassName('cal-res-date')[0].innerHTML = `${months[e.target.dataset.month]} ${e.target.innerText}${getDatePostFix(e.target.innerText)} ${e.target.dataset.year}`;
                    document.getElementsByClassName('cal-res-time')[0].innerHTML = '';
                    for (let s = 0; s < document.getElementsByClassName('selected').length; s++) {
                        removeClass(document.getElementsByClassName('selected').item(s), 'selected');
                    }
                    addClass(btn, 'selected');
                    selected = new Date(e.target.dataset.year, e.target.dataset.month, e.target.innerText);
                    if (type == 'meeting') {
                        addClass(document.getElementById('cal-buttons-confirm'), 'disabled-btn');
                        makeTimes(config, selected);
                    }
                    else {
                        removeClass(document.getElementById('cal-buttons-confirm'), 'disabled-btn');
                    }
                });
                btn.addEventListener('mouseover', (e) => {
                    addClass(btn, 'active');
                });
                btn.addEventListener('mouseout', (e) => {
                    removeClass(btn, 'active');
                });
            }
        }
        // document.getElementsByClassName('cal-res-date')[0].innerHTML = `${months[today.getMonth()]} ${today.getDate()}${getDatePostFix(today.getDate().toString())} ${today.getFullYear()}`
    }
    nextBtn.addEventListener('click', (e) => {
        if (selectedMonth < 11) {
            monthSelect.selectedIndex++;
            monthSelect.dispatchEvent(new Event('change'));
        }
        else {
            if (yearSelect.selectedIndex == 0) {
                monthSelect.selectedIndex = today.getMonth();
                monthSelect.dispatchEvent(new Event('change'));
            }
            else {
                monthSelect.selectedIndex = 0;
                monthSelect.dispatchEvent(new Event('change'));
            }
        }
    });
    prevBtn.addEventListener('click', (e) => {
        if (yearSelect.selectedIndex == 0 && monthSelect.selectedIndex > today.getMonth()) {
            monthSelect.selectedIndex--;
            monthSelect.dispatchEvent(new Event('change'));
        }
        if (yearSelect.selectedIndex > 0) {
            monthSelect.selectedIndex--;
            monthSelect.dispatchEvent(new Event('change'));
        }
    });
}
function makeTimes(config, date) {
    let calTimes = document.getElementById('cal-times');
    let html = '';
    let times = gettimes(date.ddmmyyyy(), config.appointmentStartTime, config.appointmentEndTime, config.appointmentInterval, config.timezoneOffset);
    if (date.ddmmyyyy() == new Date().ddmmyyyy()) {
        times.forEach(t => {
            if (new Date().getHours() < t.start.split(':')[0])
                html += `<div class="btn-times" data-start=${t.start} data-end=${t.end} >${t.start} - ${t.end}</div>`;
        });
    }
    else {
        times.forEach(t => {
            html += `<div class="btn-times" data-start=${t.start} data-end=${t.end} >${t.start} - ${t.end}</div>`;
        });
    }
    calTimes.innerHTML = html;
    let btnCalArray = document.getElementsByClassName('btn-times');
    for (let btn of btnCalArray) {
        if (!btn.classList.contains('disabled')) {
            btn.addEventListener('click', (e) => {
                console.log(`time: ${e.target.dataset.start} - ${e.target.dataset.end}`);
                for (let s = 0; s < document.getElementsByClassName('selected-time').length; s++) {
                    removeClass(document.getElementsByClassName('selected-time').item(s), 'selected-time');

                }
                addClass(btn, 'selected-time');
                removeClass(document.getElementById('cal-buttons-confirm'), 'disabled-btn');
                document.getElementsByClassName('cal-res-time')[0].innerHTML = `${e.target.dataset.start} - ${e.target.dataset.end}`;
            });
        }
        btn.addEventListener('mouseover', (e) => {
            addClass(btn, 'active');
        });
        btn.addEventListener('mouseout', (e) => {
            removeClass(btn, 'active');
        });
    }
}
function gettimes(date, startTime, endTime, interval, timezoneOffset) {
    let res = [];
    let startslot = startTime;
    let endslot = startTime;
    while (Number(endslot.split(':')[0]) < Number(endTime.split(':')[0])) {
        startslot = endslot;
        if ((Number(startslot.split(':')[1]) + interval >= 60)) {
            endslot = `${Number(startslot.split(':')[0]) + 1}:${((Number(startslot.split(':')[1]) + interval) - 60).toString()}`;
        }
        else {
            endslot = `${startslot.split(':')[0]}:${Number(startslot.split(':')[1]) + interval}`;
        }
        res.push({ start: appendzero(startslot), end: appendzero(endslot) });
    }
    return res;
}
function appendzero(time) {
    let num = time.split(':');
    let res = '';
    if (num[0].length == 1)
        res = `0${num[0]}`;
    else
        res = num[0];
    if (num[1].length == 1)
        res += `:0${num[1]}`;
    else
        res += `:${num[1]}`;

    return res;
}
function getDatePostFix(date) {
    switch (date.substring(date.length - 1, date.length)) {
        case '1':
            return 'st';
        case '2':
            return 'nd';
        case '3':
            if (date == 3)
                return 'rd';
            else
                return 'th';
        default:
            return 'th';
    }
}
function send(questionId) {
    let question = conversation.filter(function (el) {
        return el.id == questionId;
    })[0];
    let val = document.getElementById('type-box-text').value;
    if (val) {
        const p = new Promise(function (resolve, reject) {
            // socket.emit('message',val);
            sendToServer(question.id, val);
            document.getElementById('type-box-text').value = '';
            socket.on('onMessage', (data) => {
                resolve(data)
            });
            socket.on('disconnect', (data) => {
                reject(data);
            })
        });
        p.then((data) => {
            show(data.id, () => {
                question.waitForReply = false;
                setNextQuestion(question);
            });
        }, error => {
            console.log(error);
        });
    }
}
function sendOption(questionId, answer, value) {
    let question;
    if(questionId == resetQuestion.id) {
        question = resetQuestion;
    }
    question = conversation.filter(function (el) {
        return el.id == questionId;
    })[0];
    if (!question) {
        question = resetQuestion;
    }
    let option = document.getElementById(`${questionId}-options`);
    if (!option)
        option = document.getElementById(`${questionId}-rating`);
    option.remove();
    let nextQuestionId = resetQuestion.id;
    if (question.type != 'rating') {
        try {
            if (question.options.length > 0) {
                question.options.forEach(o => {
                    if (o.text == answer && o.linkedQuestion) {
                        nextQuestionId = o.linkedQuestion
                    }
                });
                if (nextQuestionId == resetQuestion.id) {
                    let qd = '';
                    for (let i = 0; i < conversation.length; i++) {
                        if (conversation[i].id == question.id) {
                            qd = conversation[i + 1].id;
                        }
                    }
                    if (qd)
                        nextQuestionId = qd;
                    else
                        nextQuestionId = resetQuestion.id;
                }
            }
        }
        catch {
            console.log('next')
        }
    }
    if (question.type == 'rating')
        nextQuestionId = question.nextQuestion;
    if (nextQuestionId) {
        sendToServer(question.id, answer)
        if (nextQuestionId == firstQuestion)
            answer = 'Starting over...';
        show(answer, () => { display(nextQuestionId, questionDelay) });
    }
    else {
        show(answer, () => { display(firstQuestion, questionDelay) });
    }
}
function show(answer, callback) {
    showloader();
    setTimeout(() => {
        let loaderEl = document.getElementById('loader');
        if (loaderEl) {
            loaderEl.remove();
        }
        let chatBox = document.getElementById('chat-box');
        chatBox.innerHTML += `<div class="text res-text" >${answer}<div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
        if (callback)
            callback();
    }, answerDelay);
}

function showloader() {
    let chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += `<div id="loader"><div class="btn-shine">...</div><div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}
function addClass(ele, classname) {
    ele.classList.add(classname);
}
function removeClass(ele, classname) {
    ele.classList.remove(classname);
}

Date.prototype.ddmmyyyy = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [(dd > 9 ? '' : '0') + dd,
    (mm > 9 ? '' : '0') + mm,
    this.getFullYear()
    ].join('-');
};
function getLightColorFromBg(hex) {
    if (hex == '#fff' || hex == '#ffffff')
        return getColor(null);
    let c = null;
    const rgb = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16))
    if (rgb[0] >= rgb[1]) {
        if (rgb[0] >= rgb[2]) {
            c = 0;
        }
        else {
            c = 2;
        }
    }
    else {
        if (rgb[1] >= rgb[2]) {
            c = 1;
        }
        else {
            c = 2;
        }
    }
    return getColor(c);
}
function getColor(c) {
    if (!c) {
        return '#f5f5f5';
    }
    switch (c) {
        case 0: return '#ffe6e6';
        case 1: return '#e6ffe6';
        case 2: return '#e6e6ff';
        default: return '#e6e6ff';
    }
}