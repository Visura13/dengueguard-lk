"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, MapPin, Send } from "lucide-react";
import type { RiskReport, Severity } from "../types";

const DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha",
  "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala",
  "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya",
];

const CATEGORIES = [
  "Standing water", "Blocked drain", "Discarded containers", "Waste accumulation",
  "Uncovered water tank", "Construction site", "Other",
];

type FormState = {
  location: string;
  district: string;
  category: string;
  severity: Severity;
  description: string;
};

const initialForm: FormState = {
  location: "",
  district: "",
  category: "",
  severity: "Medium",
  description: "",
};

export function RiskReportForm({ onAddReport }: { onAddReport: (report: RiskReport) => void }) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (form.location.trim().length < 3) nextErrors.location = "Enter a town or landmark using at least 3 characters.";
    if (!form.district) nextErrors.district = "Choose the district where you noticed the risk.";
    if (!form.category) nextErrors.category = "Choose the type of breeding risk.";
    if (form.description.trim().length < 15) nextErrors.description = "Add at least 15 characters so the issue is clear.";
    if (form.description.trim().length > 240) nextErrors.description = "Keep the description under 240 characters.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    onAddReport({
      id: crypto.randomUUID(),
      location: form.location.trim(),
      district: form.district,
      category: form.category,
      severity: form.severity,
      description: form.description.trim(),
      status: "Pending",
      createdAt: new Date().toISOString(),
    });
    setForm(initialForm);
    setErrors({});
    document.querySelector("#dashboard")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="form-shell">
      <aside className="form-aside">
        <span className="form-aside-icon"><MapPin size={24} /></span>
        <h3>What makes a useful report?</h3>
        <ul>
          <li>Use a recognisable town or landmark.</li>
          <li>Describe the water or waste you observed.</li>
          <li>Select high severity only when action is urgent.</li>
        </ul>
        <p><AlertCircle size={16} /> Do not include names, phone numbers, or other personal information.</p>
      </aside>

      <form className="risk-form" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label>
            <span>Town or landmark <b>*</b></span>
            <input
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
              placeholder="e.g. Near Borella junction"
              aria-invalid={Boolean(errors.location)}
              aria-describedby={errors.location ? "location-error" : undefined}
            />
            {errors.location ? <small className="field-error" id="location-error">{errors.location}</small> : null}
          </label>
          <label>
            <span>District <b>*</b></span>
            <select value={form.district} onChange={(event) => updateField("district", event.target.value)} aria-invalid={Boolean(errors.district)}>
              <option value="">Choose a district</option>
              {DISTRICTS.map((district) => <option key={district}>{district}</option>)}
            </select>
            {errors.district ? <small className="field-error">{errors.district}</small> : null}
          </label>
        </div>

        <div className="form-row">
          <label>
            <span>Risk type <b>*</b></span>
            <select value={form.category} onChange={(event) => updateField("category", event.target.value)} aria-invalid={Boolean(errors.category)}>
              <option value="">Choose a risk type</option>
              {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
            </select>
            {errors.category ? <small className="field-error">{errors.category}</small> : null}
          </label>
          <fieldset>
            <legend>Severity</legend>
            <div className="severity-options">
              {(["Low", "Medium", "High"] as Severity[]).map((level) => (
                <label key={level} className={form.severity === level ? `severity-option selected ${level.toLowerCase()}` : "severity-option"}>
                  <input type="radio" name="severity" value={level} checked={form.severity === level} onChange={() => updateField("severity", level)} />
                  {level}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <label>
          <span>Description <b>*</b></span>
          <textarea
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="What did you notice, and how long has it been there?"
            rows={4}
            maxLength={240}
            aria-invalid={Boolean(errors.description)}
          />
          <span className="textarea-meta">
            {errors.description ? <small className="field-error">{errors.description}</small> : <small>Minimum 15 characters</small>}
            <small>{form.description.length}/240</small>
          </span>
        </label>

        <button className="button button-primary submit-button" type="submit">Save report <Send size={17} /></button>
      </form>
    </div>
  );
}
