# Shiftwell Shift Guard 🚦
### Workforce Scheduling Validation Prototype

**Prevent scheduling risks before a shift is assigned.**

[![Live Demo](https://shiftwell-seven.vercel.app/)
[![Status](https://img.shields.io/badge/Status-Prototype-orange?style=for-the-badge)](https://github.com/AAstha-Bajaj/shiftwell)

Shiftwell Shift Guard is a lightweight workforce scheduling prototype designed to help businesses identify potential compliance and overtime issues before assigning shifts. It demonstrates how simple, rule-based validation can make scheduling decisions clearer, more consistent, and easier to review.

The prototype focuses on two practical scenarios: **healthcare certificate compliance** and **retail overtime approvals**.

## 🎯 The Problem

Scheduling teams often rely on spreadsheets, manual checks, and separate approval processes to manage workforce availability and compliance.

This can lead to:
- Healthcare shifts being assigned to employees with expired required certifications.
- Employees exceeding weekly working-hour limits without the required approval.
- Managers spending extra time reviewing schedules and resolving preventable issues.
- Inconsistent decisions when scheduling rules are applied manually.

## 💡 The Solution

Shiftwell Shift Guard brings these checks into one simple interface. Users can select a business scenario, choose an employee, and enter proposed shift hours to see how the scheduling rules apply.

Instead of treating every case the same way, the prototype returns a clear outcome with an explanation and a recommended next action.

## ✨ Key Features

### 1. Clinic Compliance
Validates whether a healthcare employee holds a valid required certification, such as Basic Life Support (BLS).

- **Blocked:** The required certification has expired.
- **Checks Passed:** The required certification is valid.

### 2. Retail Overtime Validation
Calculates projected weekly working hours after a proposed shift is added.

- **Regional Approval Required:** Projected weekly hours exceed 48.
- **Checks Passed:** Projected weekly hours are 48 or less.

### 3. Combined Checks
Runs both validation rules in one scenario.

- An expired required certification takes priority and blocks the proposed assignment.
- If certification is valid but projected hours exceed 48, regional approval is required.
- If both checks pass, the schedule passes the configured validation rules.

### 4. Explainable Results
Each validation result displays the status, projected weekly hours where relevant, the rule applied, an explanation, and a recommended next action.

### 5. Interactive Prototype
The interface uses mock employee records and editable scheduling inputs to demonstrate the workflow without affecting any real employee schedules.

## 🔄 How It Works

1. Select **Clinic Compliance**, **Retail Overtime**, or **Combined Checks**.
2. Choose an employee from the sample employee list.
3. Review the employee's certification status and/or existing weekly hours.
4. Enter the proposed shift duration.
5. Review the validation outcome and recommended action.

## 🧪 Example Scenarios

| Scenario | Input | Expected Outcome |
|---|---|---|
| Clinic Compliance | Required BLS certification expired | Blocked |
| Clinic Compliance | Required certification valid | Checks Passed |
| Retail Overtime | 44 existing hours + 6 proposed hours | Regional Approval Required |
| Retail Overtime | 42 existing hours + 6 proposed hours | Checks Passed |
| Combined Checks | Expired certification, 44 projected hours | Blocked |
| Combined Checks | Valid certification, 56 projected hours | Regional Approval Required |

*These examples demonstrate the prototype's configured rules, not a determination of legal or regulatory compliance.*

## 🛠️ Tech & Tools

- **Lovable** — AI-assisted application building and UI iteration
- **Frontend and dependencies** — Refer to the repository's source files and `package.json` for the exact implementation
- **GitHub** — Source code and version control

## 🚧 Current Scope & Limitations

This is a **working prototype**, not a production workforce management system.

- Uses mock employee and scheduling data.
- Does not save or approve actual shifts.
- Does not verify certificates against an external authority.
- Does not send notifications or route approval requests to real managers.
- Does not connect to a live HR, payroll, or scheduling platform.
- Applies the rules configured for this demonstration; real deployments would require policy validation and appropriate authorization.

## 🚀 Future Improvements

Potential next steps include:

- Persistent employee and scheduling data.
- Role-based access for employees, managers, and regional approvers.
- Auditable approval workflows and decision history.
- Automated certification-expiry reminders.
- Integration with workforce scheduling, HR, and payroll systems.
- Configurable rules by organization, location, and employee category.
- Automated tests, monitoring, and security reviews.

## ▶️ Run Locally

To run the project locally, ensure Node.js and npm are installed.

```bash
# Clone the repository
git clone https://github.com/AAstha-Bajaj/shiftwell.git

# Navigate into the project
cd shiftwell

# Install dependencies
npm install

# Start the development server
npm run dev
```

Follow the local URL displayed in the terminal. These commands assume the repository contains a compatible npm-based frontend project.

## 🌐 Live Demo

**[Open Shiftwell Shift Guard](https://shiftwell-seven.vercel.app/)**

Explore the three scenarios and try different certification statuses and proposed shift durations.

## 👩‍💻 Project Context

Built as a product-focused prototype to explore how clear business rules and explainable validation can help reduce preventable workforce scheduling risks.

The project combines product thinking, workflow design, rule-based logic, and rapid prototyping to turn operational problems into a testable user experience.

---

**Disclaimer:** Shiftwell Shift Guard is an independent prototype created for demonstration and learning purposes. It is not an official Shiftwell product and does not provide legal, medical, or regulatory compliance certification.
