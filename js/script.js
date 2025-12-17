/* =====================================================
   DOM ELEMENT REFERENCES
===================================================== */

/* ===== Form Steps ===== */
const forms = document.querySelectorAll(".form");

/* ===== Navigation Buttons ===== */
const nextBtns = document.querySelectorAll(".next-btn");
const backBtns = document.querySelectorAll(".back-btn");
const confirmBtns = document.querySelectorAll(".confirm-btn");

/* ===== Step Indicators (Mobile + Desktop) ===== */
const steps = document.querySelectorAll(".steps");

/* ===== Billing Toggle ===== */
const switchBtn = document.getElementById("toggle-switch");
const monthlyLabel = document.getElementById("monthly");
const yearlyLabel = document.getElementById("yearly");
const yearlyPrices = document.getElementsByClassName("year");
const monthlyPrices = document.getElementsByClassName("month");

/* ===== Summary Elements ===== */
const planRadios = document.querySelectorAll('input[name="plane"]');
const addonCheckboxes = document.querySelectorAll('.form.three .addon input');
const changeBtn = document.getElementById("plan-change");



/* =====================================================
   STATE VARIABLES
===================================================== */

/**
 * Current form step (0-based index)
 */
let currentPage = 0;

/**
 * Maps mobile steps to sidebar steps
 * (both use `.steps` class)
 */
const pairedSteps = [4, 5, 6, 7, 0, 1, 2, 3];


/* =====================================================
   PAGE DISPLAY LOGIC
===================================================== */

/**
 * Displays the selected form step
 * @param {number} index - Step index
 */
function showPage(index) {
    forms.forEach((form, i) => {
        form.classList.toggle("hidden", i !== index);
    });

    updateSteps();
    toggleNavigationButtons(index);
}

/**
 * Updates active state for step indicators
 */
function updateSteps() {
    steps.forEach((step, i) => {
        const isActive =
            i === currentPage || i === pairedSteps[currentPage];

        step.classList.toggle("active", isActive);
    });
}

/**
 * Controls visibility of Next / Back / Confirm buttons
 * @param {number} index
 */
function toggleNavigationButtons(index) {
    nextBtns.forEach(btn =>
        btn.classList.toggle("hidden", index === forms.length - 1)
    );

    backBtns.forEach(btn =>
        btn.classList.toggle("hidden", index === 0)
    );

    confirmBtns.forEach(btn =>
        btn.classList.toggle("hidden", index !== forms.length - 1)
    );
}


/* =====================================================
   FORM NAVIGATION EVENTS
===================================================== */

/* ===== Next Button ===== */
nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (!validateCurrentPage()) return;

        if (currentPage < forms.length - 1) {
            currentPage++;
            showPage(currentPage);
        }
    });
});

/* ===== Back Button ===== */
backBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (currentPage > 0) {
            currentPage--;
            showPage(currentPage);
        }
    });
});


/* =====================================================
   CONFIRMATION LOGIC
===================================================== */

confirmBtns.forEach(btn => {
    btn.addEventListener("click", showConfirmation);
});

/**
 * Displays final confirmation message
 */
function showConfirmation() {
    document.getElementById("multiStepForm").classList.add("hidden");
    document.querySelector("footer").classList.add("hidden");

    const main = document.querySelector("main");

    const confirmation = document.createElement("div");
    confirmation.className = "confirmation";

    confirmation.innerHTML = `
        <img src="../assets/images/icon-thank-you.svg" alt="Thank you icon">
        <h1>Thank you!</h1>
        <p>
            Thanks for confirming your subscription!
            We hope you enjoy our platform.
            If you need support, contact
            <strong>support@loremgaming.com</strong>
        </p>
    `;

    main.appendChild(confirmation);
}


/* =====================================================
   FORM VALIDATION
===================================================== */

/**
 * Validates inputs in the current form step
 * @returns {boolean}
 */
function validateCurrentPage() {
    const inputs = forms[currentPage].querySelectorAll("input");

    for (const input of inputs) {
        if (!input.checkValidity()) {
            input.reportValidity();
            return false;
        }
    }
    return true;
}


/* =====================================================
   BILLING TOGGLE (MONTHLY / YEARLY)
===================================================== */

/**
 * Handles billing method toggle
 */
function payMethod() {
    const isYearly = switchBtn.checked;

    monthlyLabel.style.color = isYearly ? "var(--Gray500)" : "var(--Blue950)";
    yearlyLabel.style.color = isYearly ? "var(--Blue950)" : "var(--Gray500)";

    [...yearlyPrices].forEach(el =>
        el.classList.toggle("hidden", !isYearly)
    );

    [...monthlyPrices].forEach(el =>
        el.classList.toggle("hidden", isYearly)
    );
}

switchBtn.addEventListener("change", () => {
    payMethod();
    updateSummary();
});


/* =====================================================
   SUMMARY UPDATE LOGIC
===================================================== */

/**
 * Updates plan, add-ons, and total price summary
 */
function updateSummary() {
    let planName = "";
    let planPrice = 0;
    const isYearly = switchBtn.checked;

    /* ===== Selected Plan ===== */
    planRadios.forEach(radio => {
        if (radio.checked) {
            planName = radio.value;

            planPrice = parseInt(radio.dataset.price, 10);
            if (isYearly) planPrice *= 10;
        }
    });

    document.getElementById("selected-plan-name").innerText =
        `${planName} (${isYearly ? "Yearly" : "Monthly"})`;

    document.getElementById("selected-plan-price").innerText =
        `$${planPrice}/${isYearly ? "yr" : "mo"}`;

    /* ===== Add-ons ===== */
    const addonsSummary = document.querySelector(".addons-summary");
    addonsSummary.innerHTML = "";
    let addonsTotal = 0;

    addonCheckboxes.forEach(addon => {
        if (addon.checked) {
            const title =
                addon.parentElement.querySelector(".title").innerText;

            let addonPrice = parseInt(addon.dataset.price, 10);
            if (isYearly) addonPrice *= 10;

            addonsTotal += addonPrice;

            addonsSummary.innerHTML += `
                <div class="addon-summary-item">
                    <span>${title}</span>
                    <span>+$${addonPrice}/${isYearly ? "yr" : "mo"}</span>
                </div>
            `;
        }
    });

    /* ===== Total ===== */
    document.getElementById("total-price").innerText =
        `$${planPrice + addonsTotal}/${isYearly ? "yr" : "mo"}`;
}


/* function to go to plane page from summary */
function changePlane() {
    currentPage = 1;
    showPage(currentPage);
}

/* =====================================================
   EVENT LISTENERS
===================================================== */

planRadios.forEach(radio =>
    radio.addEventListener("change", updateSummary)
);

addonCheckboxes.forEach(addon =>
    addon.addEventListener("change", updateSummary)
);

changeBtn.addEventListener('click', changePlane);


/* =====================================================
   INITIAL LOAD
===================================================== */

showPage(currentPage);
payMethod();
updateSummary();


