const fetch = require('node-fetch');

async function test() {
  const payload = {
    "Logical quotient rating": 5,
    "hackathons": 0,
    "coding skills rating": 5,
    "public speaking points": 5,
    "self-learning capability?": "yes",
    "Extra-courses did": "yes",
    "certifications_code": "python",
    "workshops_code": "testing",
    "reading_and_writing_skills": "poor",
    "memory_capability_score": "poor",
    "interested_subjects_code": "programming",
    "interested_career_area_code": "testing",
    "type_of_company_code": "BPA",
    "Taken inputs from seniors or elders": "yes",
    "interested_type_of_books_code": "Series",
    "management_or_technical": "Management",
    "hard_or_smart_worker": "hard worker",
    "worked_in_teams": "yes",
    "introvert": "yes"
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
