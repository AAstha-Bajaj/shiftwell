export type Scenario = "clinic" | "retail" | "combined";
export type CertStatus = "valid" | "expired" | "none";
export type Status = "blocked" | "approval" | "passed" | "invalid";

export interface Employee {
  id: string;
  name: string;
  role: string;
  certificate: string | null;
  certStatus: CertStatus;
  expiry: string | null;
  existingHours: number;
}

export const OVERTIME_LIMIT = 48;

export const EMPLOYEES: Employee[] = [
  { id: "priya", name: "Priya Sharma", role: "Nurse · CarePoint Clinics", certificate: "BLS", certStatus: "expired", expiry: "2026-09-30", existingHours: 36 },
  { id: "ananya", name: "Ananya Verma", role: "Nurse · CarePoint Clinics", certificate: "BLS", certStatus: "valid", expiry: "2027-03-15", existingHours: 40 },
  { id: "rahul", name: "Rahul Mehta", role: "Store Associate · UrbanMart", certificate: null, certStatus: "none", expiry: null, existingHours: 42 },
  { id: "neha", name: "Neha Singh", role: "Store Associate · UrbanMart", certificate: null, certStatus: "none", expiry: null, existingHours: 40 },
];

export interface CheckInput {
  scenario: Scenario;
  requiresCert: boolean;
  certStatus: CertStatus;
  existingHours: string;
  proposedHours: string;
}

export interface CheckResult {
  status: Status;
  projected: number | null;
  rule: string;
  explanation: string;
  action: string;
  errors: string[];
}

export function evaluate(i: CheckInput): CheckResult {
  const checkCert = i.scenario !== "retail";
  const checkOt = i.scenario !== "clinic";
  const errors: string[] = [];
  const ex = i.existingHours.trim() === "" ? NaN : Number(i.existingHours);
  const pr = i.proposedHours.trim() === "" ? NaN : Number(i.proposedHours);
  if (checkOt) {
    if (!Number.isFinite(ex)) errors.push("Enter existing scheduled hours this week.");
    else if (ex < 0 || ex > 168) errors.push("Existing hours must be between 0 and 168.");
    if (!Number.isFinite(pr)) errors.push("Enter proposed shift hours.");
    else if (pr <= 0 || pr > 24) errors.push("Proposed shift must be more than 0 and at most 24 hours.");
    if (!errors.length && ex + pr > 168) errors.push("Projected hours cannot exceed 168 in a week.");
  }

  if (errors.length) {
    return { status: "invalid", projected: null, rule: "—", explanation: "Fix the inputs to run the checks.", action: "Correct the highlighted fields.", errors };
  }
  const projected = Number.isFinite(ex) && Number.isFinite(pr) && ex >= 0 && pr > 0 && pr <= 24 && ex + pr <= 168
    ? ex + pr
    : null;
  const certExpired = checkCert && i.requiresCert && i.certStatus === "expired";
  const overLimit = checkOt && projected !== null && projected > OVERTIME_LIMIT;

  if (certExpired) {
    return {
      status: "blocked", projected,
      rule: overLimit ? "Expired required certificate (also exceeds 48 hrs)" : "Expired required certificate",
      explanation: overLimit
        ? "The employee's required certificate has expired. The shift stays blocked; regional approval for overtime cannot override this."
        : "The employee's required certificate has expired, so they cannot be scheduled for this shift.",
      action: "Assign a different, certified employee or renew the certificate before scheduling.",
      errors,
    };
  }
  if (overLimit) {
    return {
      status: "approval", projected, rule: `Projected hours exceed ${OVERTIME_LIMIT}`,
      explanation: `This shift takes the employee to ${projected} hours this week, above the ${OVERTIME_LIMIT}-hour threshold.`,
      action: "Request regional manager approval, or shorten / reassign the shift.",
      errors,
    };
  }
  return {
    status: "passed", projected, rule: "None",
    explanation: "The configured rules passed. This does not mean the shift is fully approved — other scheduling checks may still apply.",
    action: "Continue with your normal scheduling review.",
    errors,
  };
}
