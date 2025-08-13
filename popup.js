document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.getElementById('submit-button');
  const questionInput = document.getElementById('question-input');
  const codeInput = document.getElementById('code-input');
  const loadingIndicator = document.getElementById('loading');
  const responseContainer = document.getElementById('response-container');

  // --- NEW CODE: Load saved content from local storage ---
  chrome.storage.local.get(['savedQuestion', 'savedCode'], (result) => {
    if (result.savedQuestion) {
      questionInput.value = result.savedQuestion;
    }
    if (result.savedCode) {
      codeInput.value = result.savedCode;
    }
  });

  // --- NEW CODE: Save content to local storage whenever the user types ---
  questionInput.addEventListener('input', () => {
    chrome.storage.local.set({ savedQuestion: questionInput.value });
  });

  codeInput.addEventListener('input', () => {
    chrome.storage.local.set({ savedCode: codeInput.value });
  });
  
  // --- END OF NEW CODE ---

  submitButton.addEventListener('click', () => {
    const userQuestion = questionInput.value;
    const userCode = codeInput.value;

    if (!userQuestion || !userCode) {
      responseContainer.innerHTML = 'Please provide both question and code.';
      return;
    }

    loadingIndicator.classList.remove('hidden');
    responseContainer.innerHTML = '';

    chrome.runtime.sendMessage({
      type: 'getHints',
      question: userQuestion,
      code: userCode
    }, (response) => {
      loadingIndicator.classList.add('hidden');

      if (response && response.hints && response.hints.length > 0) {
        let hintsHtml = '<ul>';
        response.hints.forEach(hint => {
          hintsHtml += `<li>${hint}</li>`;
        });
        hintsHtml += '</ul>';
        responseContainer.innerHTML = hintsHtml;
      } else {
        responseContainer.innerHTML = 'No hints found.';
      }
    });
  });
});