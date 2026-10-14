"use client";

import { useState } from "react";
import { Check, RotateCcw, ShieldCheck } from "lucide-react";

const TASKS = [
  "Empty and scrub water containers",
  "Clear roof gutters and outdoor drains",
  "Cover stored water tightly",
  "Remove bottles, tins, tyres, and coconut shells",
  "Refresh pet water bowls and plant trays",
  "Check shaded corners around the home",
];

export function PreventionChecklist() {
  const [checked, setChecked] = useState<boolean[]>(() => TASKS.map(() => false));
  const completed = checked.filter(Boolean).length;
  const score = Math.round((completed / TASKS.length) * 100);
  const message = score === 100
    ? "Excellent - your weekly check is complete."
    : score >= 50
      ? "Good progress - finish the remaining checks today."
      : "Start with standing water and open containers first.";

  function toggle(index: number) {
    setChecked((current) => current.map((item, itemIndex) => itemIndex === index ? !item : item));
  }

  return (
    <div className="checklist-shell">
      <div className="checklist-items">
        {TASKS.map((task, index) => (
          <label className={checked[index] ? "check-item checked" : "check-item"} key={task}>
            <input type="checkbox" checked={checked[index]} onChange={() => toggle(index)} />
            <span className="custom-checkbox" aria-hidden="true">{checked[index] ? <Check size={16} /> : null}</span>
            <span>{task}</span>
          </label>
        ))}
      </div>
      <aside className="score-card">
        <span className="score-icon"><ShieldCheck size={28} /></span>
        <p>Household prevention score</p>
        <strong>{score}<span>%</span></strong>
        <div className="score-track" aria-label={`${score}% complete`}><span style={{ width: `${score}%` }} /></div>
        <p className="score-message">{message}</p>
        <button type="button" onClick={() => setChecked(TASKS.map(() => false))}><RotateCcw size={15} /> Reset checklist</button>
      </aside>
    </div>
  );
}
