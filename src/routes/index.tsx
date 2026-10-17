import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EMPLOYEES, evaluate, OVERTIME_LIMIT, type CertStatus, type Scenario, type Status } from "@/lib/shift-rules";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shiftwell Shift Guard — Scheduling safety controls" },
      { name: "description", content: "Prototype: certificate checks and regional overtime approvals for shift scheduling." },
      { property: "og:title", content: "Shiftwell Shift Guard" },
      { property: "og:description", content: "Scheduling safety and approval controls prototype." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const SCENARIOS: { id: Scenario; label: string }[] = [
  { id: "clinic", label: "Clinic Compliance" },
  { id: "retail", label: "Retail Overtime" },
  { id: "combined", label: "Combined Checks" },
];

const BADGE: Record<Status, { label: string; cls: string }> = {
  blocked: { label: "BLOCKED", cls: "bg-danger-soft text-danger border-danger/30" },
  approval: { label: "AMBER: REGIONAL APPROVAL REQUIRED", cls: "bg-warning-soft text-warning border-warning/30" },
  passed: { label: "CHECKS PASSED", cls: "bg-success-soft text-success border-success/30" },
  invalid: { label: "INPUT NEEDED", cls: "bg-muted text-muted-foreground border-border" },
};

const field = "mt-1.5 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-muted disabled:text-muted-foreground";
const label = "text-sm font-medium text-foreground";

function Index() {
  const [scenario, setScenario] = useState<Scenario>("combined");
  const [empId, setEmpId] = useState(EMPLOYEES[0].id);
  const emp = EMPLOYEES.find((e) => e.id === empId)!;
  const [certStatus, setCertStatus] = useState<CertStatus>(emp.certStatus);
  const [expiry, setExpiry] = useState(emp.expiry ?? "");
  const [existing, setExisting] = useState(String(emp.existingHours));
  const [proposed, setProposed] = useState("8");

  const selectEmp = (id: string) => {
    const e = EMPLOYEES.find((x) => x.id === id)!;
    setEmpId(id);
    setCertStatus(e.certStatus);
    setExpiry(e.expiry ?? "");
    setExisting(String(e.existingHours));
  };

  const requiresCert = emp.certificate !== null;
  const r = useMemo(
    () => evaluate({ scenario, requiresCert, certStatus, existingHours: existing, proposedHours: proposed }),
    [scenario, requiresCert, certStatus, existing, proposed],
  );
  const badge = BADGE[r.status];
  const certCount = EMPLOYEES.filter((e) => e.certStatus === "expired").length;
  const certRequired = EMPLOYEES.filter((e) => e.certificate).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Shiftwell Shift Guard</h1>
          <p className="text-sm text-muted-foreground">Scheduling safety and approval controls</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Certificate checks · CarePoint Clinics</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{certCount} <span className="text-base font-medium text-muted-foreground">of {certRequired} certified staff expired</span></p>
            <p className="mt-1 text-sm text-muted-foreground">Employees with an expired required certificate are blocked from scheduling.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Regional approvals · UrbanMart</p>
            <p className="mt-2 text-3xl font-bold text-foreground">&gt; {OVERTIME_LIMIT} hrs <span className="text-base font-medium text-muted-foreground">weekly threshold</span></p>
            <p className="mt-1 text-sm text-muted-foreground">Shifts pushing an employee above the threshold need regional approval.</p>
          </div>
        </div>

        <section className="rounded-xl border border-border bg-card p-6" aria-labelledby="check-h">
          <h2 id="check-h" className="text-lg font-semibold text-foreground">Check a Proposed Shift</h2>
          <div className="mt-5 grid gap-8 lg:grid-cols-2">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()} noValidate>
              <div>
                <label htmlFor="scenario" className={label}>Scenario</label>
                <select id="scenario" className={field} value={scenario} onChange={(e) => setScenario(e.target.value as Scenario)}>
                  {SCENARIOS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="emp" className={label}>Employee</label>
                <select id="emp" className={field} value={empId} onChange={(e) => selectEmp(e.target.value)}>
                  {EMPLOYEES.map((e) => <option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="cert" className={label}>Required certificate{emp.certificate ? ` (${emp.certificate})` : ""}</label>
                  {requiresCert ? (
                    <select id="cert" className={field} value={certStatus} onChange={(e) => setCertStatus(e.target.value as CertStatus)}>
                      <option value="valid">Valid</option>
                      <option value="expired">Expired</option>
                    </select>
                  ) : (
                    <input id="cert" className={field} disabled value="No certificate requirement" />
                  )}
                </div>
                <div>
                  <label htmlFor="expiry" className={label}>Certificate expiry date</label>
                  <input id="expiry" type="date" className={field} disabled={!requiresCert} value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="existing" className={label}>Existing scheduled hours this week</label>
                  <input id="existing" type="number" min={0} max={168} step={0.5} className={field} value={existing} onChange={(e) => setExisting(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="proposed" className={label}>Proposed shift hours</label>
                  <input id="proposed" type="number" min={0.5} max={24} step={0.5} className={field} value={proposed} onChange={(e) => setProposed(e.target.value)} />
                </div>
              </div>
              {r.errors.length > 0 && (
                <ul role="alert" className="rounded-lg border border-danger/30 bg-danger-soft p-3 text-sm text-danger">
                  {r.errors.map((e) => <li key={e}>• {e}</li>)}
                </ul>
              )}
            </form>

            <div className="rounded-xl border border-border bg-muted/40 p-5" aria-live="polite">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Result</p>
              <span className={`mt-2 inline-block rounded-md border px-3 py-1.5 text-sm font-bold ${badge.cls}`}>{badge.label}</span>
              <dl className="mt-5 space-y-4 text-sm">
                <div><dt className="text-muted-foreground">Projected weekly hours</dt><dd className="text-2xl font-bold text-foreground">{r.projected ?? "—"}</dd></div>
                <div><dt className="text-muted-foreground">Rule triggered</dt><dd className="font-medium text-foreground">{r.rule}</dd></div>
                <div><dt className="text-muted-foreground">Explanation</dt><dd className="text-foreground">{r.explanation}</dd></div>
                <div><dt className="text-muted-foreground">Recommended next action</dt><dd className="text-foreground">{r.action}</dd></div>
              </dl>
              <p className="mt-5 text-xs text-muted-foreground">Preview only — no shift is saved, approved, or blocked in any real system.</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold text-foreground">Why these controls?</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><span className="font-medium text-foreground">Certificate controls</span> address a documented compliance gap: staff with expired certificates were being scheduled.</li>
            <li><span className="font-medium text-foreground">Overtime approvals</span> address labour-cost control by flagging weeks above {OVERTIME_LIMIT} hours.</li>
            <li><span className="font-medium text-foreground">Prototype:</span> this uses mock data and is not a production scheduling system.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
