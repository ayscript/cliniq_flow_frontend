export const DOCTORS = [
  { id: 1, name: "Dr. Ajayi Anuoluwapo", room: "Rm 4", available: true },
  { id: 2, name: "Salahu Abiola Ishaq", room: "Rm 1", available: true },
  { id: 3, name: "Sule-Odu Ibrahim", room: "Rm 2", available: true },
  { id: 4, name: "Abikoye Peter O", room: "Rm 3", available: false },
];

export const INITIAL_PATIENTS = [
  {
    id: 1,
    name: "james",
    gender: "male",
    time: "08:56:49 am",
    pid: "1111111",
    dob: "02/01/2000",
    age: "65 Years",
    enc: "345217",
    status: "Awaiting Triage",
    doctor: "kelvin  A",
    payIcon: "green",
    vitals: { temp: "36.8°C", bp: "128/82", pulse: "74bpm", resp: "18cpm", bmi: "", sugar: "" },
    diagnosis: "Malaria Suspect",
    notes: [
      {
        author: "",
        time: "10:15:00 AM",
        content:
          "Patient presents with fever, headache, fluid retention. Reports last night.\n\nO/E: alert, serious fever.\n\nPlan:\n- IOP measurement\n- malaria test\n- ",
      },
    ],
    nurseNotes: [
      {
        author: "Nurse Deborah",
        time: "09:05:00 AM",
        content: "Patient arrived ambulatory. Vitals taken. height and weight recorded.",
      },
    ],
    rx: [
      {
        date: "Mon, Mar 02, 2026",
        items: [
          { name: "Antimalarial", status: "Pending" },
          { name: "Paracetamol", status: "Pending" },
          { name: "Antibiotic", status: "Pending" },
        ],
      },
    ],
    assignedDoctor: null,
  },
  {
    id: 2,
    name: "Williams Willson",
    gender: "male",
    time: "09:18:56 am",
    pid: "10125937",
    dob: "28/10/2020",
    age: "5 Years 5 Months",
    enc: "576649",
    status: "Awaiting Triage",
    doctor: "fedrick  A",
    payIcon: "green",
    vitals: { temp: "37.1°C", bp: "100/65", pulse: "90bpm", resp: "22cpm", bmi: "", sugar: "" },
    diagnosis: "Pediatric Eye Check",
    notes: [
      {
        author: "Olamide Femi",
        time: "09:30:00 AM",
        content:
          "5 year old male brought in by mother for routine body check.\n\nO/E: cooperative, vision screening done.\n\nPlan:\n- Refraction\n-",
      },
    ],
    nurseNotes: [],
    rx: [],
    assignedDoctor: null,
  },
  {
    id: 3,
    name: "ADEYEMI FLORENCE",
    gender: "female",
    time: "07:43:30 am",
    pid: "10100070",
    dob: "15/06/1957",
    age: "68 Years",
    enc: "576407",
    status: "Awaiting Triage",
    doctor: "Sule-Odu Ibrahim",
    payIcon: "red",
    vitals: { temp: "36.5°C", bp: "145/90", pulse: "80bpm", resp: "16cpm", bmi: "", sugar: "" },
    diagnosis: "Cataract - Right Eye",
    notes: [
      {
        author: "IBRAHIM SULE",
        time: "08:00:00 AM",
        content:
          "Elderly female with progressive vision loss right eye.\n\nO/E: RAPD negative, lens opacity noted.\n\nPlan:\n- Biometry\n- Pre-op assessment\n- Schedule for phacoemulsification",
      },
    ],
    nurseNotes: [
      {
        author: "NURSE BISI",
        time: "07:50:00 AM",
        content: "Patient escorted by daughter. BP slightly elevated. Patient calm.",
      },
    ],
    rx: [
      {
        date: "Mon, Mar 02, 2026",
        items: [{ name: "Chloramphenicol Eye Drops", status: "Pending" }],
      },
    ],
    assignedDoctor: null,
  },
  {
    id: 4,
    name: "Babatunde HALIMA",
    gender: "female",
    time: "08:11:37 am",
    pid: "5672111",
    dob: "27/12/1979",
    age: "40 Years",
    enc: "576479",
    status: "Awaiting Authorization",
    doctor: "Sule-Odu Ibrahim",
    payIcon: "red",
    vitals: { temp: "36.9°C", bp: "120/78", pulse: "76bpm", resp: "17cpm", bmi: "", sugar: "" },
    diagnosis: "Dry Eye Syndrome",
    notes: [],
    nurseNotes: [],
    rx: [],
    assignedDoctor: null,
    nhis: "2490336-PL",
    plan: "Local Plan",
    insurer: "Redcare Health Services Limited",
  },
];
