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

function handleThemeClick() {
    const isDark = document.body.classList.toggle("dark");

    themeButton.textContent = isDark
        ? "밝은 테마로 바꾸기"
        : "어두운 테마로 바꾸기";
}

themeButton.addEventListener("click", handleThemeClick);

function handleNicknameInput() {
    const maxLength = nicknameInput.maxLength;
    const currentLength = Math.min(nicknameInput.value.length, maxLength);

    nicknameCount.textContent = currentLength + " / " + maxLength;
}

nicknameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
    const agreed = agreeCheck.checked;

    startButton.disabled = !agreed;

    agreeMessage.textContent = agreed
        ? "상담 메모 작성을 시작할 수 있습니다."
        : "체크하면 상담 메모 작성을 시작할 수 있습니다.";


    if (agreed) {
        agreeMessage.classList.add("is-ready");
    } else {
        agreeMessage.classList.remove("is-ready");
    }
}

agreeCheck.addEventListener("change", handleAgreeChange);

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
    tabs.forEach(function (tab) {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected", "false");
    });

    panels.forEach(function (panel) {
        panel.classList.remove("is-active");
        panel.hidden = true;
    });
}

function activateTab(clickedTab) {
    const targetSelector = clickedTab.dataset.target;
    const targetPanel = document.querySelector(targetSelector);

    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected", "true");

    targetPanel.classList.add("is-active");
    targetPanel.hidden = false;
}

function handleTabClick(event) {
    resetTabsAndPanels();
    activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
    tab.addEventListener("click", handleTabClick);
});

const trainingFlow = document.querySelector("#training-flow");
const flowSteps = trainingFlow.querySelectorAll(".step");
const progressItems = trainingFlow.querySelectorAll(".progress_item");
const symptomInput = document.querySelector("#symptom-input");
const symptomError = document.querySelector("#symptom-error");
const symptomNext = document.querySelector("#symptom-next");
const frequencyRange = document.querySelector("#frequency-range");
const frequencyValue = document.querySelector("#frequency-value");
const warningOption = document.querySelector("#warning-option");
const warningOptions = document.querySelector("#warning-options");
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");
const summarySymptom = document.querySelector("#summary-symptom");
const summaryFrequency = document.querySelector("#summary-frequency");
const summaryWarning = document.querySelector("#summary-warning");

const completeSymptom = document.querySelector("#complete-symptom");
const completeFrequency = document.querySelector("#complete-frequency");
const completeWarning = document.querySelector("#complete-warning");

const frequencyValues = ["한 번", "가끔", "자주"];

const formData = {
    symptom: "", frequency: "가끔", warning: false, warningColor: "잘 모르겠음"
};

function showStep(index) {
    flowSteps.forEach((step, i) => { step.hidden = i !== index; });
    progressItems.forEach((item, i) => {
        item.classList.toggle("is-active", i === index);
    });
}

const startDialog = document.querySelector("#start-dialog");
const dialogBack = document.querySelector("#dialog-back");
const dialogConfirm = document.querySelector("#dialog-confirm");

function resetMemoPreparation() {
    agreeCheck.checked = false;
    trainingFlow.hidden = true;
    handleAgreeChange();
    agreeCheck.focus();
}

startButton.addEventListener("click", () => {
    if (!agreeCheck.checked) return;
    startDialog.showModal();
});

dialogBack.addEventListener("click", () => {
    startDialog.close();
    resetMemoPreparation();
});


startDialog.addEventListener("cancel", resetMemoPreparation);
dialogConfirm.addEventListener("click", () => {
    if (!agreeCheck.checked) return;
    startDialog.close();
    trainingFlow.hidden = false;
    showStep(0);
    trainingFlow.scrollIntoView({ behavior: "smooth" });
    symptomInput.focus();
});


function validateSymptom() {
    const value = symptomInput.value.trim();

    if (!value) {
        symptomError.textContent = "차량에서 느낀 현상을 입력해 주세요.";
        symptomInput.classList.add("has-error");
        symptomInput.focus();
        return false;
    }

    symptomError.textContent = "";
    symptomInput.classList.remove("has-error");
    formData.symptom = value;
    return true;
}


symptomNext.addEventListener("click", () => {
    if (!validateSymptom()) return;
    showStep(1);
});


frequencyRange.addEventListener("input", () => {
    frequencyValue.value = frequencyValues[frequencyRange.value];
});


warningOption.addEventListener("change", () => {
    warningOptions.hidden = !warningOption.checked;
});


optionPrev.addEventListener("click", () => showStep(0));
optionNext.addEventListener("click", () => {
    formData.frequency = frequencyValues[frequencyRange.value];
    formData.warning = warningOption.checked;
    const color = document.querySelector('input[name="warning-color"]:checked');
    formData.warningColor = color.value;
    summarySymptom.textContent = formData.symptom;
    summaryFrequency.textContent = formData.frequency;
    summaryWarning.textContent = formData.warning ? formData.warningColor : "경고등 정보 미입력";
    showStep(2);
});

summaryPrev.addEventListener("click", () => showStep(1));

finishButton.addEventListener("click", () => {
    completeSymptom.textContent = summarySymptom.textContent;
    completeFrequency.textContent = summaryFrequency.textContent;
    completeWarning.textContent = summaryWarning.textContent;
    showStep(3);
});

restartButton.addEventListener("click", () => {
    formData.symptom = "";
    formData.frequency = "가끔";
    formData.warning = false;
    formData.warningColor = "잘 모르겠음";

    symptomInput.value = "";
    symptomError.textContent = "";
    symptomInput.classList.remove("has-error");

    frequencyRange.value = "1";
    frequencyValue.value = "가끔";
    warningOption.checked = false;
    warningOptions.hidden = true;
    document.querySelector('input[name="warning-color"][value="잘 모르겠음"]').checked = true;

    summarySymptom.textContent = "";
    summaryFrequency.textContent = "";
    summaryWarning.textContent = "";

    completeSymptom.textContent = "";
    completeFrequency.textContent = "";
    completeWarning.textContent = "";

    saveMemoMessage.textContent = "";
    
    showStep(0);
});

const saveMemoButton = document.querySelector("#save-memo-button");
const saveMemoMessage = document.querySelector("#save-memo-message");
const memoStorageMessage = document.querySelector("#memo-storage-message");
const savedMemoControls = document.querySelector("#saved-memo-controls");

const openSavedMemo = document.querySelector("#open-saved-memo");
const cancelSavedMemo = document.querySelector("#cancel-saved-memo");
const savedMemoContent = document.querySelector("#saved-memo-content");
const savedSymptom = document.querySelector("#saved-symptom");
const savedFrequency = document.querySelector("#saved-frequency");
const savedWarning = document.querySelector("#saved-warning");

const savedMemo = {
    symptom: "",
    frequency: "",
    warning: ""
};

let hasSavedMemo = false;

function handleSaveMemoClick() {
    if (hasSavedMemo) {
        saveMemoMessage.textContent = "이미 보관된 메모가 있습니다. 먼저 보관을 취소해 주세요.";
        return;
    }

    savedMemo.symptom = completeSymptom.textContent;
    savedMemo.frequency = completeFrequency.textContent;
    savedMemo.warning = completeWarning.textContent;

    hasSavedMemo = true;

    saveMemoMessage.textContent = "상담 메모를 임시 보관했습니다.";
    memoStorageMessage.textContent = "상담 메모 1건이 임시 보관되어 있습니다.";
    savedMemoControls.hidden = false;
}

saveMemoButton.addEventListener("click", handleSaveMemoClick);

openSavedMemo.addEventListener("click", () => {
    savedSymptom.textContent = savedMemo.symptom;
    savedFrequency.textContent = savedMemo.frequency;
    savedWarning.textContent = savedMemo.warning;

    savedMemoContent.hidden = false;
});

cancelSavedMemo.addEventListener("click", () => {
    savedMemo.symptom = "";
    savedMemo.frequency = "";
    savedMemo.warning = "";

    hasSavedMemo = false;

    savedSymptom.textContent = "";
    savedFrequency.textContent = "";
    savedWarning.textContent = "";

    savedMemoContent.hidden = true;
    savedMemoControls.hidden = true;

    memoStorageMessage.textContent = "아직 보관된 메모가 없습니다. 상담 메모를 작성한 뒤 임시 보관해 주세요.";
    saveMemoMessage.textContent = "임시 보관을 취소했습니다.";
});