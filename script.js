const serviceName = "차와 함께 오래";
let isSubscribed = false;
let submitCount = 0;

function makeSubscribeMessage(email, subscribed) {
    if (subscribed === true) {
        return email + "로 신청이 완료되었습니다.";
    }
    
    return "이메일을 입력한 뒤 신청해 주세요.";
}

const subscribeForm = document.querySelector("#subscribeForm");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

function handleSubscribe(event) {
    event.preventDefault();

    const subscriberEmail = emailInput.value.trim();

    if (!subscriberEmail) {
        subscribeMessage.textContent = 
            "이메일을 입력한 뒤 신청해 주세요.";
        emailInput.focus();
        return;
    }

    isSubscribed = true;
    submitCount += 1;

    subscribeMessage.textContent =
        makeSubscribeMessage(subscriberEmail, isSubscribed);

    subscribeMessage.classList.add("isSuccess");

    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
}

subscribeForm.addEventListener("submit", handleSubscribe);

const themeButton = document.querySelector("#theme-button");
const nicknameInput = document.querySelector("#nickname");
const nicknameCount = document.querySelector("#nickname-count");
const agreeCheck = document.querySelector("#agree-check");
const agreeMessage = document.querySelector("#agree-message");
const startButton = document.querySelector("#start-button");

function handleThemeClick(event) {
    console.log("click:", event.currentTarget.id);
}

themeButton.addEventListener("click", handleThemeClick);

function handleNicknameInput(event) {
    console.log("input:", nicknameInput.value.length);
}

nicknameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
    console.log("change:", agreeCheck.checked);
}

agreeCheck.addEventListener("change", handleAgreeChange);