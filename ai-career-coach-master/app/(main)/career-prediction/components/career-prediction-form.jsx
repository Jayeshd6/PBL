"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import {
  BrainCircuit,
  Sparkles,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { predictCareer } from "@/actions/career-prediction";

// ─── Schema ───────────────────────────────────────────────────────────────────
const formSchema = z.object({
  logical_quotient_rating: z.number().min(1).max(9),
  hackathons: z.number().min(0).max(6),
  coding_skills_rating: z.number().min(1).max(9),
  public_speaking_points: z.number().min(1).max(9),
  self_learning_capability: z.string().min(1, "Required"),
  extra_courses_did: z.string().min(1, "Required"),
  certifications: z.string().min(1, "Required"),
  workshops: z.string().min(1, "Required"),
  reading_and_writing_skills: z.string().min(1, "Required"),
  memory_capability_score: z.string().min(1, "Required"),
  interested_subjects: z.string().min(1, "Required"),
  interested_career_area: z.string().min(1, "Required"),
  type_of_company: z.string().min(1, "Required"),
  taken_inputs_from_seniors: z.string().min(1, "Required"),
  interested_type_of_books: z.string().min(1, "Required"),
  management_or_technical: z.string().min(1, "Required"),
  hard_smart_worker: z.string().min(1, "Required"),
  worked_in_teams: z.string().min(1, "Required"),
  introvert: z.string().min(1, "Required"),
});

// ─── Field Options ─────────────────────────────────────────────────────────────
const OPTIONS = {
  yesNo: ["yes", "no"],
  certifications: [
    "information security",
    "shell programming",
    "r programming",
    "distro making",
    "machine learning",
    "full stack",
    "hadoop",
    "app development",
    "python",
  ],
  workshops: [
    "testing",
    "database security",
    "game development",
    "data science",
    "system designing",
    "hacking",
    "cloud computing",
    "web technologies",
  ],
  skillLevel: ["poor", "medium", "excellent"],
  subjects: [
    "programming",
    "Management",
    "data engineering",
    "networks",
    "Software Engineering",
    "cloud computing",
    "parallel computing",
    "IOT",
    "Computer Architecture",
    "hacking",
  ],
  careerArea: [
    "testing",
    "system developer",
    "Business process analyst",
    "security",
    "developer",
    "cloud computing",
  ],
  companyType: [
    "BPA",
    "Cloud Services",
    "product development",
    "Testing and Maintainance Services",
    "SAaS services",
    "Web Services",
    "Finance",
    "Sales and Marketing",
    "Product based",
    "Service Based",
  ],
  books: [
    "Series",
    "Autobiographies",
    "Travel",
    "Guide",
    "Health",
    "Journals",
    "Anthology",
    "Dictionaries",
    "Prayer books",
    "Art",
    "Encyclopedias",
    "Religion-Spirituality",
    "Action and Adventure",
    "Comics",
    "Horror",
    "Satire",
    "Self help",
    "History",
    "Cookbooks",
    "Math",
    "Biographies",
    "Drama",
    "Diaries",
    "Science fiction",
    "Poetry",
    "Romance",
    "Science",
    "Trilogy",
    "Fantasy",
    "Childrens",
    "Mystery",
  ],
};

// ─── Steps Definition ──────────────────────────────────────────────────────────
const STEPS = [
  {
    title: "Technical Skills",
    description: "Rate your technical abilities",
    icon: "🧠",
    fields: [
      "logical_quotient_rating",
      "hackathons",
      "coding_skills_rating",
      "public_speaking_points",
    ],
  },
  {
    title: "Learning & Development",
    description: "Your learning habits and achievements",
    icon: "📚",
    fields: [
      "self_learning_capability",
      "extra_courses_did",
      "certifications",
      "workshops",
    ],
  },
  {
    title: "Cognitive Profile",
    description: "Your cognitive strengths",
    icon: "💡",
    fields: [
      "reading_and_writing_skills",
      "memory_capability_score",
      "interested_subjects",
      "interested_type_of_books",
    ],
  },
  {
    title: "Career Preferences",
    description: "What you're looking for in a career",
    icon: "🎯",
    fields: [
      "interested_career_area",
      "type_of_company",
      "management_or_technical",
      "hard_smart_worker",
      "taken_inputs_from_seniors",
      "worked_in_teams",
      "introvert",
    ],
  },
];

// ─── Helper Component: SelectField ─────────────────────────────────────────────
function SelectField({ form, name, label, options, placeholder }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || `Select ${label}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ─── Helper Component: SliderField ─────────────────────────────────────────────
function SliderField({ form, name, label, min, max }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}{" "}
            <span className="ml-2 text-primary font-bold">{field.value}</span>
          </FormLabel>
          <FormControl>
            <Slider
              min={min}
              max={max}
              step={1}
              value={[field.value]}
              onValueChange={([val]) => field.onChange(val)}
              className="mt-2"
            />
          </FormControl>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{min}</span>
            <span>{max}</span>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function CareerPredictionForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logical_quotient_rating: 5,
      hackathons: 0,
      coding_skills_rating: 5,
      public_speaking_points: 5,
      self_learning_capability: "",
      extra_courses_did: "",
      certifications: "",
      workshops: "",
      reading_and_writing_skills: "",
      memory_capability_score: "",
      interested_subjects: "",
      interested_career_area: "",
      type_of_company: "",
      taken_inputs_from_seniors: "",
      interested_type_of_books: "",
      management_or_technical: "",
      hard_smart_worker: "",
      worked_in_teams: "",
      introvert: "",
    },
  });

  // Validate current step fields before moving forward
  const handleNext = async () => {
    const stepFields = STEPS[currentStep].fields;
    const isValid = await form.trigger(stepFields);
    if (isValid) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => setCurrentStep((s) => s - 1);

  const handleReset = () => {
    form.reset();
    setResult(null);
    setCurrentStep(0);
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const predictedRole = await predictCareer(values);
      setResult(predictedRole);
    } catch (err) {
      toast.error("Prediction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Result Screen ────────────────────────────────────────────────────────────
  if (result) {
    return (
      <Card className="border-2 border-primary/30 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Your Predicted Career Path</CardTitle>
          <CardDescription>
            Based on your profile, our ML model suggests:
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="py-6 px-8 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-4xl font-bold gradient-title animate-gradient">
              {result}
            </p>
          </div>

          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            This prediction is based on your skills, interests, and personality
            profile. Explore more tools on the dashboard to further align your
            career journey.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button asChild>
              <a href="/dashboard">Go to Dashboard</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Form Screen ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Step Progress */}
      <div className="flex items-center justify-between gap-2">
        {STEPS.map((step, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300 ${
                idx < currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : idx === currentStep
                  ? "border-primary text-primary bg-primary/10"
                  : "border-muted-foreground/30 text-muted-foreground/50 bg-muted/30"
              }`}
            >
              {idx < currentStep ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <span>{step.icon}</span>
              )}
            </div>
            <span
              className={`text-xs font-medium hidden sm:block ${
                idx === currentStep
                  ? "text-primary"
                  : "text-muted-foreground/60"
              }`}
            >
              {step.title}
            </span>
            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div
                className={`absolute hidden sm:block`}
                style={{ display: "none" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step Card */}
      <Card className="border-2 hover:border-primary/50 transition-colors duration-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
              {STEPS[currentStep].icon}
            </div>
            <div>
              <CardTitle>{STEPS[currentStep].title}</CardTitle>
              <CardDescription>{STEPS[currentStep].description}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="w-fit mt-2">
            Step {currentStep + 1} of {STEPS.length}
          </Badge>
        </CardHeader>

        <CardContent>
          {isLoading && <BarLoader width={"100%"} color="#6366f1" />}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* ── Step 1: Technical Skills ─────────────────────────────── */}
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SliderField
                    form={form}
                    name="logical_quotient_rating"
                    label="Logical Quotient Rating"
                    min={1}
                    max={9}
                  />
                  <SliderField
                    form={form}
                    name="hackathons"
                    label="Hackathons Participated"
                    min={0}
                    max={6}
                  />
                  <SliderField
                    form={form}
                    name="coding_skills_rating"
                    label="Coding Skills Rating"
                    min={1}
                    max={9}
                  />
                  <SliderField
                    form={form}
                    name="public_speaking_points"
                    label="Public Speaking Points"
                    min={1}
                    max={9}
                  />
                </div>
              )}

              {/* ── Step 2: Learning & Development ───────────────────────── */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    form={form}
                    name="self_learning_capability"
                    label="Self-Learning Capability"
                    options={OPTIONS.yesNo}
                  />
                  <SelectField
                    form={form}
                    name="extra_courses_did"
                    label="Did Extra Courses"
                    options={OPTIONS.yesNo}
                  />
                  <SelectField
                    form={form}
                    name="certifications"
                    label="Certifications"
                    options={OPTIONS.certifications}
                  />
                  <SelectField
                    form={form}
                    name="workshops"
                    label="Workshops Attended"
                    options={OPTIONS.workshops}
                  />
                </div>
              )}

              {/* ── Step 3: Cognitive Profile ─────────────────────────────── */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    form={form}
                    name="reading_and_writing_skills"
                    label="Reading & Writing Skills"
                    options={OPTIONS.skillLevel}
                  />
                  <SelectField
                    form={form}
                    name="memory_capability_score"
                    label="Memory Capability Score"
                    options={OPTIONS.skillLevel}
                  />
                  <SelectField
                    form={form}
                    name="interested_subjects"
                    label="Interested Subjects"
                    options={OPTIONS.subjects}
                  />
                  <SelectField
                    form={form}
                    name="interested_type_of_books"
                    label="Interested Type of Books"
                    options={OPTIONS.books}
                  />
                </div>
              )}

              {/* ── Step 4: Career Preferences ───────────────────────────── */}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    form={form}
                    name="interested_career_area"
                    label="Interested Career Area"
                    options={OPTIONS.careerArea}
                  />
                  <SelectField
                    form={form}
                    name="type_of_company"
                    label="Type of Company to Settle In"
                    options={OPTIONS.companyType}
                  />
                  <SelectField
                    form={form}
                    name="management_or_technical"
                    label="Management or Technical"
                    options={["Management", "Technical"]}
                  />
                  <SelectField
                    form={form}
                    name="hard_smart_worker"
                    label="Hard Worker or Smart Worker"
                    options={["hard worker", "smart worker"]}
                  />
                  <SelectField
                    form={form}
                    name="taken_inputs_from_seniors"
                    label="Taken Inputs from Seniors / Elders"
                    options={OPTIONS.yesNo}
                  />
                  <SelectField
                    form={form}
                    name="worked_in_teams"
                    label="Worked in Teams"
                    options={OPTIONS.yesNo}
                  />
                  <SelectField
                    form={form}
                    name="introvert"
                    label="Are You an Introvert?"
                    options={OPTIONS.yesNo}
                  />
                </div>
              )}

              {/* ── Navigation Buttons ────────────────────────────────────── */}
              <div className="flex justify-between pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0 || isLoading}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                {currentStep < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isLoading}
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      "Predicting..."
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Predict My Career
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
