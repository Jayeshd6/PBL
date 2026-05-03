"use server";

/**
 * Calls the ML model API at https://job-role-suggestion-4.onrender.com
 * and returns the predicted job role as a string.
 *
 * The API expects a POST request to /predict with a JSON body containing
 * the feature names exactly as used in the training dataset.
 */
const OPTIONS = {
  certifications: [ "information security", "shell programming", "r programming", "distro making", "machine learning", "full stack", "hadoop", "app development", "python" ],
  workshops: [ "testing", "database security", "game development", "data science", "system designing", "hacking", "cloud computing", "web technologies" ],
  subjects: [ "programming", "Management", "data engineering", "networks", "Software Engineering", "cloud computing", "parallel computing", "IOT", "Computer Architecture", "hacking" ],
  careerArea: [ "testing", "system developer", "Business process analyst", "security", "developer", "cloud computing" ],
  companyType: [ "BPA", "Cloud Services", "product development", "Testing and Maintainance Services", "SAaS services", "Web Services", "Finance", "Sales and Marketing", "Product based", "Service Based" ],
  books: [ "Series", "Autobiographies", "Travel", "Guide", "Health", "Journals", "Anthology", "Dictionaries", "Prayer books", "Art", "Encyclopedias", "Religion-Spirituality", "Action and Adventure", "Comics", "Horror", "Satire", "Self help", "History", "Cookbooks", "Math", "Biographies", "Drama", "Diaries", "Science fiction", "Poetry", "Romance", "Science", "Trilogy", "Fantasy", "Childrens", "Mystery" ]
};

// Create sorted arrays for label encoding (matching typical scikit-learn LabelEncoder)
const ENCODERS = {
  certifications: [...OPTIONS.certifications].sort(),
  workshops: [...OPTIONS.workshops].sort(),
  subjects: [...OPTIONS.subjects].sort(),
  careerArea: [...OPTIONS.careerArea].sort(),
  companyType: [...OPTIONS.companyType].sort(),
  books: [...OPTIONS.books].sort(),
};

function encode(category, value) {
  const idx = ENCODERS[category].indexOf(value);
  return idx === -1 ? 0 : idx;
}

export async function predictCareer(formValues) {
  // Map from our form keys → EXACT snake_case and integer codes the API expects
  const payload = {
    logical_quotient_rating: formValues.logical_quotient_rating,
    hackathons: formValues.hackathons,
    coding_skills_rating: formValues.coding_skills_rating,
    public_speaking_points: formValues.public_speaking_points,
    self_learning_capability: formValues.self_learning_capability,
    extra_courses_did: formValues.extra_courses_did,
    certifications_code: encode("certifications", formValues.certifications),
    workshops_code: encode("workshops", formValues.workshops),
    reading_and_writing_skills: formValues.reading_and_writing_skills,
    memory_capability_score: formValues.memory_capability_score,
    interested_subjects_code: encode("subjects", formValues.interested_subjects),
    interested_career_area_code: encode("careerArea", formValues.interested_career_area),
    type_of_company_code: encode("companyType", formValues.type_of_company),
    taken_inputs_from_seniors: formValues.taken_inputs_from_seniors,
    interested_type_of_books_code: encode("books", formValues.interested_type_of_books),
    management_or_technical: formValues.management_or_technical,
    hard_or_smart_worker: formValues.hard_smart_worker,
    worked_in_teams: formValues.worked_in_teams,
    introvert: formValues.introvert,
  };

  const response = await fetch(
    "https://job-role-suggestion-4.onrender.com/predict",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API request failed: ${response.status} ${response.statusText} – ${errorText}`
    );
  }

  const data = await response.json();

  // The API should return { "predicted_job_role": "..." } or similar.
  const role =
    data["predicted_job_role"] ||
    data["Suggested Job Role"] ||
    data["suggested_job_role"] ||
    data["prediction"] ||
    data["result"] ||
    data["role"] ||
    Object.values(data)[0]; // fallback: first value in response

  if (!role) {
    throw new Error("No prediction returned from the API.");
  }

  return String(role);
}
