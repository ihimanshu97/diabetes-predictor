const formEl = document.querySelector('form');
const nextBtns = document.querySelectorAll('.btn-next');
const prevBtns = document.querySelectorAll('.btn-prev');
const inputFields = document.querySelectorAll('input[type="number"]');
const newTestBtn = document.getElementById('new-test');

const progressBar = document.querySelector('.progress-bar');
const progressSteps = document.querySelectorAll('.progress-step');
const formSteps = document.querySelectorAll('.form-step');

const resultDiv = document.querySelector('.result-div');
const resultEl = document.getElementById('result');
const resultImg = document.getElementById('result-img');
const resultMsg = document.getElementById('result-msg');

let currentStep = 0;

formEl.onsubmit = async (e) => {
    e.preventDefault();
    console.log('Submit Button Clicked');
    console.log(`${formEl.age.value}`);
    console.log(`${formEl.weight.value}`);
    console.log(`${formEl.height.value}`);
    console.log(`${formEl.pregnencies.value}`);
    console.log(`${formEl.glucose.value}`);
    console.log(`${formEl.bp.value}`);
    console.log(`${formEl.insulin.value}`);
    console.log(`${formEl.skinThickness.value}`);
    console.log(`${formEl.dpf.value}`);

    let allAreValid = true;
    formSteps[currentStep].querySelectorAll('input[type="number"]').forEach(inputField => {
        displayErrors(inputField);
        if (inputField.value === '' || !inputField.checkValidity()) {
            allAreValid = false;
        }
    })

    if (allAreValid) {
        //const resultVals = [0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1];
        let bmi = (parseFloat(formEl.weight.value) / (((parseFloat(formEl.height.value) / 100)) ** 2) - 33.668359) / 12.178062;
        let preg = (parseFloat(formEl.pregnencies.value) - 3.845052) / 3.369578;
        let gluc = (parseFloat(formEl.glucose.value) - 121.686763) / 30.435949;
        let BP = (parseFloat(formEl.bp.value) - 72.405184) / 12.096346;
        let st = (parseFloat(formEl.skinThickness.value) - 29.108073) / 8.791221;
        let insulin = (parseFloat(formEl.insulin.value) - 140.671875) / 86.383060;
        let dpf = (parseFloat(formEl.dpf.value) - 0.471876) / 0.331329;
        let age = (parseFloat(formEl.age.value) - 33.240885) / 11.760232;
        let input = [preg, gluc, BP, st, insulin, bmi, dpf, age]


        console.log(input)


        var testResult = await predict(input);
        testResult = Math.round(testResult)

        console.log("test result: " + testResult)


        if (testResult == 0) {
            resultDiv.style.display = 'flex';
            resultImg.src = 'images/happy.svg';
            resultMsg.textContent = 'YAY! You have tested negative';
        } else {
            resultDiv.style.display = 'flex';
            resultImg.src = 'images/sad.svg';
            resultMsg.textContent = 'SORRY! You have tested positive';
        }
        resultEl.classList.add('animate__animated', 'animate__zoomIn');
    }
}

formEl.addEventListener('keypress', (e) => {
    var key = e.charCode || e.keyCode || 0;
    if (key == 13) {
        e.preventDefault();
    }
})

nextBtns.forEach(btn => {
    btn.onclick = () => {
        let allAreValid = true;
        formSteps[currentStep].querySelectorAll('input[type="number"]').forEach(inputField => {
            displayErrors(inputField);
            if (inputField.value === '' || !inputField.checkValidity()) {
                allAreValid = false;
            }
        })

        if (allAreValid) {
            formSteps[currentStep].classList.remove('form-active');
            ++currentStep;
            formSteps[currentStep].classList.add('form-active');
            progressBar.style.width = `${currentStep * 50}%`;
            progressSteps[currentStep].classList.add('visited');
        }
    }
})

prevBtns.forEach(btn => {
    btn.onclick = () => {
        formSteps[currentStep].classList.remove('form-active');
        progressSteps[currentStep].classList.remove('visited');
        --currentStep;
        formSteps[currentStep].classList.add('form-active');
        progressBar.style.width = `${currentStep * 50}%`;
    }
})

inputFields.forEach(inputField => {
    inputField.addEventListener('keyup', (e) => displayErrors(e.target));
})

newTestBtn.onclick = () => {
    location.reload();
}

function displayErrors(inputField) {
    if (inputField.value !== '' && inputField.checkValidity()) {
        inputField.nextElementSibling.style.visibility = 'hidden';
        inputField.classList.remove('invalid-input');
    } else {
        inputField.nextElementSibling.style.visibility = 'visible';
        inputField.classList.add('invalid-input');
    }
}

tf.loadLayersModel('model/model.json')
    .then(function (model) {
        window.model = model;
    });

function predict(input) {
    //if (window.model) {
    return window.model.predict(tf.tensor(input).expandDims()).array();
}
/*else {
    setTimeout(function() { return predict(input) }, 50);
}*/