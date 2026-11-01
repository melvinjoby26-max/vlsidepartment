# EE - VLSI DESIGN AND TECHNOLOGY
## Department Events & Student Registration Website

A modern, responsive, and accessible website designed specifically for the **EE - VLSI DESIGN AND TECHNOLOGY** department. Built with a clean white theme, semiconductor-inspired vector graphics, keyboard navigation, a continuously scrolling live announcement ticker with hover-pause, real-time filtering/search, and a built-in event registration system.

---

## 🚀 How to Run & Preview the Website Locally

The website is built with standard HTML5, CSS3, and modern vanilla JavaScript with **zero build tools or dependencies required**. You can preview it locally in any of the following ways:

### Option 1: Direct File Open (Easiest & Instant)
- Open your file explorer and navigate to:
  `c:\Users\welcome\OneDrive\Desktop\webpage`
- Double-click **`index.html`** to open it directly in Google Chrome, Microsoft Edge, Firefox, or Safari.

### Option 2: Using Python HTTP Server (Recommended)
Open PowerShell or your command prompt in the project directory:
```powershell
cd "c:\Users\welcome\OneDrive\Desktop\webpage"
python -m http.server 8000
```
Then open your browser and navigate to:
👉 **`http://localhost:8000`**

### Option 3: Using Node.js / NPX
```powershell
cd "c:\Users\welcome\OneDrive\Desktop\webpage"
npx serve
```

### Option 4: VS Code Live Server
If using Visual Studio Code, right-click `index.html` and select **"Open with Live Server"**.

---

## 🔒 Admin Portal

You can edit events, ticker messages, and department details visually in your browser without touching code!

1. Open **[`admin.html`](file:///c:/Users/welcome/OneDrive/Desktop/webpage/admin.html)** or visit **`http://localhost:3000/admin.html`**.
2. Enter the default PIN: **`vlsi2026`**
3. Use the tabs:
   - **📅 Events Manager**: Add new symposiums/workshops, edit contents, change status (`COMING SOON...`, `Event Completed`, `Registration Open`), edit dates, venues, schedules, and custom registration URLs.
   - **⚡ Scrolling Ticker**: Add, edit, or reorder continuous scrolling messages.
   - **🏛️ About Department**: Edit college name, department title, welcome text, office location, email, and quick stats.
   - **👥 Student Registrations**: View student submissions and download a CSV spreadsheet.
   - **💾 Backup & Sync**: Save changes directly to server disk or download backup.

---

## ✏️ How to Edit Department Information & Events Manually

### 1. Changing the Department Name & Information
Open `js/events-data.js` and edit the `DEPARTMENT_CONFIG` object at the top:

```javascript
const DEPARTMENT_CONFIG = {
  departmentCode: "EE - VLSI",
  departmentName: "EE - VLSI DESIGN AND TECHNOLOGY", // Edit Department Name
  parentDepartment: "Department of Electrical Engineering",
  institution: "School of Engineering & Applied Sciences",
  tagline: "Pioneering Semiconductor Innovation, Microelectronics & Next-Generation SoC Architecture",
  welcomeMessage: "Welcome to the official events and student registration hub...",
  contactEmail: "vlsi.events@ee-dept.edu", // Update contact email
  departmentOffice: "VLSI & Microelectronics Complex, Room EE-310",
  academicYear: "Academic Year 2026 - 2027",
  // ...
};
```
*Any edits here automatically update the header, hero section, modals, and footer across the entire site.*

---

### 2. Adding, Editing, or Removing Events
In `js/events-data.js`, look for the `EVENTS_DATA` array. Each event is a structured JavaScript object:

```javascript
{
  id: "vlsi-tapeout-2026",                          // Unique identifier (used in URL hash)
  title: "Hands-on Physical Design & ASIC Tapeout with Cadence Innovus",
  category: "Workshops",                             // "Workshops" | "Talks" | "Competitions"
  categoryLabel: "Technical Workshop",
  badgeColor: "indigo",
  isSample: false,                                  // Set to false for live events
  shortSummary: "Master full-flow digital physical design from netlist to GDSII...",
  description: "Detailed description of syllabus, hands-on tasks, and topics...",
  eventDate: "November 14, 2026",                   // Displayed event date
  eventTime: "09:30 AM – 05:00 PM IST",
  registrationDeadline: "November 10, 2026",        // Last date to register
  venue: "VLSI CAD Center, Lab 302, EE Block",      // Location
  venueType: "In-Person (CAD Workstation Provided)",
  seatsAvailable: "40 Seats",
  prerequisites: "Basic knowledge of Digital Logic & CMOS...",
  edaTools: ["Cadence Innovus 22.1", "Tempus", "Virtuoso"],
  
  // Faculty & Student contacts
  coordinator: {
    name: "Dr. K. S. Sundaram",
    role: "Associate Professor & Lab Director",
    email: "kssundaram@ee-dept.edu"
  },
  studentLead: {
    name: "Priya Nair",
    role: "M.Tech VLSI Lead",
    email: "priya.vlsi@student.ee-dept.edu"
  },

  // Detailed schedule timeline
  schedule: [
    { time: "09:30 AM – 10:15 AM", topic: "Introduction to ASIC Back-End Flow" },
    { time: "10:15 AM – 11:30 AM", topic: "Die Sizing & Power Grid Mesh" },
    { time: "02:00 PM – 03:30 PM", topic: "Clock Tree Synthesis (CTS)" }
  ],

  // REGISTRATION LINK:
  // Option A: Leave empty ("") to use the built-in interactive registration modal and ticket pass generator.
  // Option B: Paste your Google Form, Microsoft Form, or custom URL here:
  registrationUrl: "https://forms.google.com/your-event-form",

  theme: {
    primaryColor: "#3b82f6",
    patternType: "asic-routing" // "asic-routing" | "nanosheet" | "fpga-grid" | "logic-gates" | "analog-waves" | "wafer-grid" | "riscv-pipeline"
  }
}
```

---

### 3. Updating the Scrolling Ticker Announcements
In `js/events-data.js`, modify the `TICKER_ITEMS` array:

```javascript
const TICKER_ITEMS = [
  { eventId: "vlsi-tapeout-2026", text: "Cadence Innovus Tapeout: Nov 14 (Reg closes Nov 10)", tag: "Workshop" },
  { eventId: "siliconsprint-hackathon-2026", text: "SiliconSprint 36-Hr VLSI Hackathon: Dec 18-20", tag: "Hackathon" }
];
```

---

## 🌟 Key Features

1. **Prominent Department Branding**: "EE - VLSI DESIGN AND TECHNOLOGY" is prominently featured in the top header, sticky navbar, hero section, and footer.
2. **Clean White Theme & Accessible Contrast**: Meets WCAG AAA contrast guidelines using high-contrast slate text (`#0f172a`), clean card surfaces, and subtle circuit watermarks.
3. **Themed Event Illustrations**: Each event has an SVG illustration representing semiconductor concepts (ASIC floorplanning, FinFET/GAA nanosheets, FPGA logic arrays, analog op-amps, wafer dies, and RISC-V pipelining).
4. **Interactive Scrolling Ticker**: Smooth continuous scrolling marquee with live event announcements that automatically **pauses on hover or keyboard focus** (WCAG 2.2.2 compliance) with a dedicated pause/play toggle.
5. **Multi-Filter & Instant Search**: Filter by *All Events*, *Workshops*, *Talks*, and *Competitions* with live count pills and real-time keyword search.
6. **Detailed Event Views**:
   - In-page accessible modal view with full schedule timeline, venue, coordinators, EDA tools, and direct URL bookmarking (`#event/{id}`).
   - Standalone dedicated page (`event-details.html?id={id}`).
7. **Student Registration System**:
   - Built-in registration modal with input validation, student roll number capture, and printable admission pass.
   - External Google Form / Microsoft Form links can be easily configured per event.
8. **Fully Responsive**: Adapts seamlessly to smartphones, tablets, laptops, and wide desktop displays.

---

## 📁 Project Structure

```
c:\Users\welcome\OneDrive\Desktop\webpage\
├── index.html              # Main homepage & event catalog
├── event-details.html      # Dedicated standalone event details page
├── README.md               # Documentation and customization guide
├── css/
│   └── styles.css          # Clean white theme & responsive styles
└── js/
    ├── events-data.js      # Central configuration for department & events
    ├── illustrations.js    # Themed semiconductor SVG generator
    ├── app.js              # Core homepage interactivity, filters, ticker & modals
    └── event-details.js    # Dedicated event details page controller
```
