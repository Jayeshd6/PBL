const fetch = require('node-fetch');

async function test() {
  const payload = {
    "Logical quotient rating": 5,
    "hackathons": 0,
    "coding skills rating": 5,
    "public speaking points": 5,
    "self-learning capability?": "yes",
    "Extra-courses did": "yes",
    "certifications": "python",
    "workshops": "testing",
    "reading and writing skills": "poor",
    "memory capability score": "poor",
    "Interested subjects": "programming",
    "interested career area ": "testing",
    "Type of company want to settle in?": "BPA",
    "Taken inputs from seniors or elders": "yes",
    "Interested Type of Books": "Series",
    "Management or Technical": "Management",
    "hard/smart worker": "hard worker",
    "worked in teams ever?": "yes",
    "Introvert": "yes"
  };

  const response = await fetch('https://job-role-suggestion-4.onrender.com/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  const text = await response.text();
  console.log("Status:", response.status);
  console.log("Response:", text);
}

test();
