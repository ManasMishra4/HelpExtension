// background.js for manual input
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getHints') {
    const { question, code } = request;
    const prompt = `You are a helpful AI assistant for developers. Your task is to provide three bullet points of feedback on a user's code. Here is the problem statement:

${question}

And here is the user's code:

\`\`\`javascript
${code}
\`\`\`

1. A short, encouraging statement (e.g., "You're on the right path!") that acknowledges the user's current attempt. If their approach is fundamentally flawed, suggest a better overall strategy.
2. A short hint focused on the core concept they might be missing, formatted as: "You can consider the core concept of...". This should be a high-level, intuitive clue, not a code snippet.
3. A short brief "Why?" section that explains the intuition behind the second hint. For example: "Why? Understanding this concept is crucial for handling the state of the list as you traverse it."`;

    fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: 'mistral:7b-instruct-q4_k_m', prompt, stream: false }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const rawResponse = data.response.trim();
        let hints = rawResponse.split('\n').filter(line => line.trim().length > 0);
        if (hints.length === 0 && rawResponse.length > 0) {
          hints = [rawResponse];
        }
        sendResponse({ hints: hints });
      })
      .catch(error => {
        console.error('Error fetching AI response:', error);
        sendResponse({ hints: ['An error occurred while generating hints. Please try again later.'] });
      });
  }
  return true;
});


// // background.js

// let storedQuestion = null;

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   switch (request.type) {
//     case 'setQuestion':
//       storedQuestion = request.question;
//       console.log('Background Service Worker: Question received and stored.');
//       break;

//     case 'getQuestionStatus':
//       sendResponse({ questionFound: storedQuestion !== null });
//       break;

//     case 'getHints':
//       if (!storedQuestion) {
//         sendResponse({ hints: ['Error: No problem question has been detected.'] });
//         return true;
//       }

//       const { code } = request;

//       // This is the new, situation-aware prompt that incorporates your feedback.
//       const prompt = `You are an expert software engineer and helpful mentor. Your task is to provide three concise, situation-aware hints to a junior developer working on a coding problem. Your hints should not give the answer, but guide the user's intuition and approach.

// The user is working on this problem:
// ${storedQuestion}

// And here is their code:
// \`\`\`javascript
// ${code}
// \`\`\`

// Analyze the situation and provide your hints in this strict format:

// 1. A short, encouraging statement (e.g., "You're on the right path!") that acknowledges the user's current attempt. If their approach is fundamentally flawed, suggest a better overall strategy.
// 2. A short hint focused on the core concept they might be missing, formatted as: "You can consider the core concept of...". This should be a high-level, intuitive clue, not a code snippet.
// 3. A short brief "Why?" section that explains the intuition behind the second hint. For example: "Why? Understanding this concept is crucial for handling the state of the list as you traverse it."`;

//       fetch('http://localhost:11434/api/generate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ model: 'mistral:7b-instruct-q4_k_m', prompt, stream: false }),
//       })
//         .then(response => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json();
//         })
//         .then(data => {
//           const rawResponse = data.response.trim();
//           let hints = rawResponse.split('\n').filter(line => line.trim().length > 0);
//           if (hints.length === 0 && rawResponse.length > 0) {
//             hints = [rawResponse];
//           }
//           sendResponse({ hints: hints });
//         })
//         .catch(error => {
//           console.error('Error fetching AI response:', error);
//           sendResponse({ hints: ['An error occurred while generating hints. Please try again later.'] });
//         });
      
//       return true;

//     default:
//       break;
//   }
// });
