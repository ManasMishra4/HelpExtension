// content.js

// content.js
console.log("Code Helper AI content script is running!");

const SITES = {
  'leetcode.com': '#question-content', // A more stable selector for the full problem description.
  'hackerrank.com': 'div[data-test="question-body"]', // A selector for HackerRank's problem body.
  'hackerearth.com': '#problemStatement',
  'www.geeksforgeeks.org': 'div.problem-statement',
};

function getQuestion() {
  const selector = SITES[window.location.hostname];
  if (!selector) {
    console.error('Website not supported for auto-fetching.');
    return;
  }

  const questionElement = document.querySelector(selector);
  if (!questionElement) {
    console.error(`Failed to find question element on this page with selector: ${selector}`);
    return;
  }

  chrome.runtime.sendMessage({ type: 'setQuestion', question: questionElement.textContent });
  console.log("Question found and sent to background.");
}

document.addEventListener('DOMContentLoaded', getQuestion);

// // content.js - src/content.js

// const SITES = {
//  leetcode: ['#problem-statement'],
//  hackerrank: ['#problem'],
//  hackerearth: ['#problemStatement'],
//  geeksforgeeks: ['h1[class="p"]'],
// };

// function getQuestion() {
//  const site = SITES[window.location.hostname];
//  if (!site) return;

//  const questionElement = document.querySelector(...site);
//  if (!questionElement) return console.error('Failed to find question element.');

//  chrome.runtime.sendMessage({ type: 'setQuestion', question: questionElement.textContent });
// }

// document.addEventListener('DOMContentLoaded', getQuestion);



