import { CareerPredictionForm } from "./components/career-prediction-form";

export const metadata = {
  title: "Career Prediction | AI Career Coach",
  description:
    "Discover your ideal job role based on your skills, interests, and personality using our AI-powered career prediction tool.",
};

export default function CareerPredictionPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold gradient-title animate-gradient mb-3">
            AI Career Prediction
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Answer a few questions about your skills, interests, and personality
            to discover your ideal career path powered by machine learning.
          </p>
        </div>

        {/* Prediction Form Card */}
        <CareerPredictionForm />
      </div>
    </div>
  );
}
