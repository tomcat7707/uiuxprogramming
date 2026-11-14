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

const navLinks = document.querySelectorAll(".site-nav a");


const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");


function updateCurrentNav() {
    const currentHash = window.location.hash;

    navLinks.forEach((link) => {
        const current = currentHash
            ? link.getAttribute("href") === currentHash
            : link === navLinks[0];

        link.classList.toggle("is-current", current);

        if (current) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
    const currentLink = document.querySelector('.site-nav a[aria-current="page"]');
    const pageName = currentLink ? currentLink.textContent.trim() : "홈";
    document.title = pageName + " | 차와 함께 오래";
}

window.addEventListener("hashchange", updateCurrentNav);
updateCurrentNav();


menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");

    menuToggle.textContent = isOpen ? "메뉴 닫기" : "메뉴 열기";

    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// 11주차 - Esc로 모바일 메뉴 닫기
document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" ||
        !mainNav.classList.contains("is-open")) return;

    mainNav.classList.remove("is-open");
    menuToggle.textContent = "메뉴 열기";
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.focus();
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        menuToggle.textContent = "메뉴 열기";
        menuToggle.setAttribute("aria-expanded", "false");
    });
});


const trainingFlow = document.querySelector("#training-flow");

const memoForm = document.querySelector("#memo-form");

memoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (flowSteps[2].hidden || isSubmitting) return;

    if (!validateSymptom()) {
        showStep(0);
        symptomInput.focus();
        return;
    }
    const submittedData = new FormData(memoForm);

    setSubmitState("loading", "상담 메모를 작성하고 있습니다.");

    window.setTimeout(() => {

        if (forceSaveFailure) {
            setSubmitState("error", "메모 작성 처리에 실패했습니다. 입력 내용은 그대로 유지됩니다. 다시 시도해 주세요.");
            return;
        }

        completeSymptom.textContent = submittedData.get("symptom");
        const frequencyLabels = ["한 번", "가끔", "자주"];

        completeFrequency.textContent =
            frequencyLabels[Number(submittedData.get("frequency"))];

        if (submittedData.has("warning")) {
            completeWarning.textContent = submittedData.get("warning-color");
        } else {
            completeWarning.textContent = summaryWarning.textContent;
        }

        setSubmitState("success", "상담 메모 작성이 완료되었습니다.");
        showStep(3);
    }, 600);
});

const flowSteps = trainingFlow.querySelectorAll(".step");
const progressItems = trainingFlow.querySelectorAll(".progress_item");
const symptomInput = document.querySelector("#symptom-input");
const symptomError = document.querySelector("#symptom-error");

const symptomField = document.querySelector("#symptom-field");
const symptomHelp = document.querySelector("#symptom-help");
const symptomCount = document.querySelector("#symptom-count");

const symptomNext = document.querySelector("#symptom-next");
const frequencyRange = document.querySelector("#frequency-range");
const frequencyValue = document.querySelector("#frequency-value");
const warningOption = document.querySelector("#warning-option");
const warningOptions = document.querySelector("#warning-options");
const warningColorInputs = document.querySelectorAll('input[name="warning-color"]');
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const submitStatus = document.querySelector("#submit-status");
let isSubmitting = false;
const forceSaveFailure = new URLSearchParams(location.search).has("save-error");

function setSubmitState(state, message) {
    isSubmitting = state === "loading";
    memoForm.setAttribute("aria-busy", String(isSubmitting));

    finishButton.disabled = isSubmitting;

    finishButton.textContent = isSubmitting
        ? "메모 작성 중…"
        : "메모 작성 완료하기";

    submitStatus.textContent = message;

    submitStatus.classList.toggle("is-success", state === "success");
    submitStatus.classList.toggle("has-error", state === "error");
}

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
        symptomInput.setAttribute("aria-invalid", "true");
        updateSymptomExperience();
        symptomInput.focus();
        return false;
    }

    if (value.length < 2) {
        symptomError.textContent = "차량에서 느낀 현상을 2자 이상 입력해 주세요.";
        symptomInput.classList.add("has-error");
        symptomInput.setAttribute("aria-invalid", "true");
        updateSymptomExperience();
        symptomInput.focus();
        return false;
    }

    symptomError.textContent = "";
    symptomInput.classList.remove("has-error");
    symptomInput.removeAttribute("aria-invalid");
    updateSymptomExperience()
    formData.symptom = value;
    return true;
}

function updateSymptomExperience() {
    const length = symptomInput.value.length;
    const valid = symptomInput.value.trim().length >= 2;
    const hasError = symptomInput.getAttribute("aria-invalid") === "true";

    symptomCount.textContent = length + " / 60자";

    symptomField.classList.toggle("has-error", hasError);
    symptomField.classList.toggle("is-valid", valid && !hasError);

    symptomHelp.textContent = valid && !hasError
        ? "입력 조건을 충족했습니다."
        : "차량에서 느낀 증상을 2자 이상 60자 이하로 입력해 주세요.";
}

symptomInput.addEventListener("input", () => {
    if (symptomInput.getAttribute("aria-invalid") === "true") {
        validateSymptom();
    } else {
        updateSymptomExperience();
    }
});

updateSymptomExperience();

symptomNext.addEventListener("click", () => {
    if (!validateSymptom()) return;
    showStep(1);
});


frequencyRange.addEventListener("input", () => {
    frequencyValue.value = frequencyValues[frequencyRange.value];
});

function syncWarningOptions() {
    const open = warningOption.checked;

    warningOption.setAttribute("aria-expanded", String(open));
    warningOptions.hidden = !open;

    warningColorInputs.forEach((input) => {
        input.disabled = !open;
    });
}

warningOption.addEventListener("change", syncWarningOptions);
syncWarningOptions();


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

    document.querySelector('.step[data-step="3"] h3').focus();
});

summaryPrev.addEventListener("click", () => showStep(1));

restartButton.addEventListener("click", () => {
    formData.symptom = "";
    formData.frequency = "가끔";
    formData.warning = false;
    formData.warningColor = "잘 모르겠음";

    symptomInput.value = "";
    symptomError.textContent = "";
    symptomInput.classList.remove("has-error");

    symptomInput.removeAttribute("aria-invalid");
    symptomField.classList.remove("is-valid", "has-error");
    updateSymptomExperience();

    frequencyRange.value = "1";
    frequencyValue.value = "가끔";
    warningOption.checked = false;
    syncWarningOptions();
    document.querySelector('input[name="warning-color"][value="잘 모르겠음"]').checked = true;

    summarySymptom.textContent = "";
    summaryFrequency.textContent = "";
    summaryWarning.textContent = "";

    completeSymptom.textContent = "";
    completeFrequency.textContent = "";
    completeWarning.textContent = "";

    saveMemoMessage.textContent = "";
    setSubmitState("idle", "");
    
    showStep(0);
});

const saveMemoButton = document.querySelector("#save-memo-button");
const saveMemoMessage = document.querySelector("#save-memo-message");
const memoStorageMessage = document.querySelector("#memo-storage-message");
const memoCount = document.querySelector("#memo-count");
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


const filterButtons = document.querySelectorAll(".memo-filters .filter-button");
let currentFilter = "all";

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach((item) => {
            const selected = item === button;

            item.classList.toggle("is-active", selected);
            item.setAttribute("aria-pressed", String(selected));
        });
        renderSavedMemos();
    });
});


function getVisibleMemos() {
    if (!hasSavedMemo) {
        return [];
    }

    const frequencyFilters = {
        once: "한 번",
        sometimes: "가끔",
        often: "자주"
    };

    if (currentFilter === "all" ||
        savedMemo.frequency === frequencyFilters[currentFilter]) {
        return [savedMemo];
    }

    return [];
}

function renderSavedMemos() {
    const visibleMemos = getVisibleMemos();


    const selectedFilter = document.querySelector(
        '.memo-filters .filter-button[aria-pressed="true"]'
    );
    const filterName = selectedFilter.textContent.trim();

    memoCount.textContent = visibleMemos.length > 0
        ? `${filterName} 조건의 상담 메모 ${visibleMemos.length}건이 표시됩니다.`
        : `${filterName} 조건의 상담 메모가 없습니다.`;

    savedMemoControls.hidden = visibleMemos.length === 0;

    if (visibleMemos.length === 0) {
        savedMemoContent.hidden = true;
    }

    if (!hasSavedMemo) {
        memoStorageMessage.textContent =
            "아직 보관된 메모가 없습니다. 상담 메모를 작성한 뒤 임시 보관해 주세요.";
    } else if (visibleMemos.length === 0) {
        memoStorageMessage.textContent =
            "선택한 발생 빈도에 해당하는 메모가 없습니다. 다른 발생 빈도를 선택해 보세요.";
    } else {
        memoStorageMessage.textContent =
            "상담 메모 1건이 임시 보관되어 있습니다.";
    }
}


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
    renderSavedMemos();
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

    // 11주차 - 보관 취소 후 전체 필터로 초기화
    const allFilterButton = document.querySelector(
        '.memo-filters .filter-button[data-filter="all"]'
    );
    allFilterButton.click();

    // 취소 결과를 안내하고 해당 문구로 초점 이동
    memoStorageMessage.textContent =
        "메모 보관을 취소했습니다. 현재 보관된 메모가 없습니다.";

    memoStorageMessage.focus();
});

renderSavedMemos();