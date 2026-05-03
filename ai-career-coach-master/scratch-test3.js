const fetch = require('node-fetch');

async function test() {
  const payload = {
    logical_quotient_rating: 5,
    hackathons: 0,
    coding_skills_rating: 5,
    public_speaking_points: 5,
    self_learning_capability: "yes",
    extra_courses_did: "yes",
    certifications_code: 0,
    workshops_code: 0,
    reading_and_writing_skills: "poor",
    memory_capability_score: "poor",
    interested_subjects_code: 0,
    interested_career_area_code: 0,
    type_of_company_code: 0,
    taken_inputs_from_seniors: "yes",
    interested_type_of_books_code: 0,
    management_or_technical: "Management",
    hard_or_smart_worker: "hard worker",
    worked_in_teams: "yes",
    introvert: "yes"
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
