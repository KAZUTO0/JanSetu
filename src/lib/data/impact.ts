import type { ImpactStory } from "@/lib/types";

/** Simulated impact stories — demo data for the prototype. */
export const IMPACT_STORIES: ImpactStory[] = [
  {
    id: "im-water",
    title: "Clean Water at Every Hand Pump",
    challengeCode: "JS-2481",
    district: "Bokaro",
    category: "Water",
    image: "/images/water-groundwater.png",
    headlineMetric: "42,000 citizens reached",
    summary:
      "Fluoride-safe filtration units with IoT monitoring now serve 14 villages in Bokaro's industrial belt.",
    story:
      "What began as 23 scattered citizen reports of discoloured water became a matched research challenge at BIT Mesra within 21 days. The FluorideSafe cartridge — designed for hand-pump retrofit — cleared 90-day durability trials, then survived its first monsoon. Village water committees now operate and monitor the units, with LoRa sensors flagging cartridge replacement a week in advance.",
    metrics: [
      { label: "Fluoride level", before: "4.2 mg/L", after: "0.8 mg/L", improvement: "−81%", good: true },
      { label: "Safe water coverage", before: "0 villages", after: "14 villages", improvement: "14 villages", good: true },
      { label: "Cartridge life", before: "—", after: "9 months", improvement: "9 mo", good: true },
      { label: "New fluorosis cases", before: "17 / quarter", after: "2 / quarter", improvement: "−88%", good: true },
    ],
    journey: [
      { stage: "Reported", date: "Mar 2025" },
      { stage: "Validated", date: "Mar 2025" },
      { stage: "Matched", date: "Apr 2025" },
      { stage: "Development", date: "May 2025" },
      { stage: "Pilot", date: "Aug 2025" },
      { stage: "Deployment", date: "Jan 2026" },
      { stage: "Impact", date: "Apr 2026" },
    ],
    partners: { hei: "BIT Mesra", industry: "Bokaro SensorTech Pvt Ltd" },
    quote: {
      text: "Earlier our children's teeth were turning brown. Now the same hand pump gives water we trust — and the machine tells us when to change the filter.",
      author: "Jairam Mahato, Water Committee Operator",
      place: "Petarwar, Bokaro",
    },
    deployedAgo: "Deployed 3 months ago",
  },
  {
    id: "im-crop",
    title: "Saving the Tomato Harvest",
    challengeCode: "JS-2502",
    district: "Ramgarh",
    category: "Agriculture",
    image: "/images/agriculture-crop.png",
    headlineMetric: "3,200 farms protected",
    summary:
      "AI blight detection in farmers' pockets cut crop loss from 34% to 9% across the tomato belt.",
    story:
      "The CropGuard app — born at IIT (ISM) Dhanbad from 41 farmer reports — spots early blight from a phone photo in 38 ms, offline, with voice advisory in Santhali and Hindi. In its first full season, spray costs fell because farmers treated at the right window instead of panic-spraying. Mandis now print the app's advisory alongside the day's rates.",
    metrics: [
      { label: "Crop loss from blight", before: "34%", after: "9%", improvement: "−73%", good: true },
      { label: "Pesticide spend per farm", before: "₹4,800", after: "₹2,100", improvement: "−56%", good: true },
      { label: "Farms using advisory", before: "120", after: "3,200", improvement: "27×", good: true },
      { label: "Detection lead time", before: "After visible damage", after: "6–9 days earlier", improvement: "+9 days", good: true },
    ],
    journey: [
      { stage: "Reported", date: "Jan 2025" },
      { stage: "Validated", date: "Jan 2025" },
      { stage: "Matched", date: "Feb 2025" },
      { stage: "Development", date: "Feb 2025" },
      { stage: "Pilot", date: "Mar 2025" },
      { stage: "Deployment", date: "Oct 2025" },
      { stage: "Impact", date: "Feb 2026" },
    ],
    partners: { hei: "IIT (ISM) Dhanbad", industry: "Ranchi Agritech Solutions" },
    quote: {
      text: "The phone tells me two days before my own eyes can see the spots. Last season I saved my entire half-acre.",
      author: "Basant Rai, Farmer",
      place: "Patratu, Ramgarh",
    },
    deployedAgo: "Deployed 5 months ago",
  },
  {
    id: "im-waste",
    title: "Waste to Wealth in Dhanbad",
    challengeCode: "JS-2452",
    district: "Dhanbad",
    category: "Environment",
    image: "/images/waste.png",
    headlineMetric: "180,000 residents served",
    summary:
      "AI-assisted segregation lifted source separation from 12% to 64% and formalised 214 waste workers.",
    story:
      "NIT Jamshedpur's Segrego system pairs vision-equipped smart bins with an incentive scheme designed from behavioural research. The collector cooperative — the first in the state — turned 214 informal waste pickers into safety-gear-equipped members with health insurance. The Jharia landfill now receives 31% less waste, and three recyclers buy a guaranteed 210 tonnes monthly.",
    metrics: [
      { label: "Household segregation", before: "12%", after: "64%", improvement: "+52 pts", good: true },
      { label: "Landfill intake", before: "420 TPD", after: "290 TPD", improvement: "−31%", good: true },
      { label: "Formal waste workers", before: "0", after: "214", improvement: "214 jobs", good: true },
      { label: "Recycler offtake", before: "Ad-hoc", after: "210 T/month", improvement: "Guaranteed", good: true },
    ],
    journey: [
      { stage: "Reported", date: "Nov 2024" },
      { stage: "Validated", date: "Nov 2024" },
      { stage: "Matched", date: "Dec 2024" },
      { stage: "Development", date: "Jan 2025" },
      { stage: "Pilot", date: "Feb 2025" },
      { stage: "Deployment", date: "Jun 2025" },
      { stage: "Impact", date: "Jul 2025" },
    ],
    partners: { hei: "NIT Jamshedpur", industry: "GreenGrid Energy LLP" },
    quote: {
      text: "I used to segregate with bare hands at the dump. Now I have gloves, an ID card, insurance — and my daughter's school fees come on time.",
      author: "Sunita Devi, Cooperative Member",
      place: "Ward 32, Dhanbad",
    },
    deployedAgo: "Deployed 1 month ago",
  },
  {
    id: "im-maternal",
    title: "Mothers Within Reach",
    challengeCode: "JS-2435",
    district: "Simdega",
    category: "Healthcare",
    image: "/images/maternal.png",
    headlineMetric: "9,800 mothers covered",
    summary:
      "ASHA-led ANC tracking with referral transport doubled institutional deliveries across two blocks.",
    story:
      "MatriCare gave every ASHA worker an offline companion app and a village kit — BP cuff, haemoglobinometer, weighing scale. Risk-stratified colour codes trigger a referral pool of vehicles funded by the community rota and district health society. In one year, ANC coverage crossed 87% and no mother in the two pilot blocks delivered on a forest trail.",
    metrics: [
      { label: "ANC visit coverage", before: "41%", after: "87%", improvement: "+46 pts", good: true },
      { label: "Institutional deliveries", before: "44%", after: "91%", improvement: "+47 pts", good: true },
      { label: "Referral median time", before: "3.4 hrs", after: "52 min", improvement: "−74%", good: true },
      { label: "Low-birth-weight rate", before: "28%", after: "19%", improvement: "−32%", good: true },
    ],
    journey: [
      { stage: "Reported", date: "Feb 2025" },
      { stage: "Validated", date: "Mar 2025" },
      { stage: "Matched", date: "Mar 2025" },
      { stage: "Development", date: "Apr 2025" },
      { stage: "Pilot", date: "Sep 2025" },
      { stage: "Deployment", date: "Mar 2026" },
      { stage: "Impact", date: "Jul 2026" },
    ],
    partners: { hei: "CU Jharkhand", industry: "MedTech Jharkhand" },
    quote: {
      text: "The app reminds me which mother is due. Last month I reached Babli's home before the rain — the vehicle came in forty minutes.",
      author: "ASHA Sabita Kispatta",
      place: "Bano, Simdega",
    },
    deployedAgo: "Deployed 2 months ago",
  },
  {
    id: "im-solar",
    title: "Light After Dark",
    challengeCode: "JS-2521",
    district: "Lohardaga",
    category: "Environment",
    image: "/images/solar.png",
    headlineMetric: "5,600 citizens powered",
    summary:
      "Community-owned solar microgrids turned 3-hour power hamlets into 18-hour energy communities.",
    story:
      "BIT Sindri's SolarSetu controller made community ownership viable: prepaid meters, lifeline tariffs, and load prioritisation that keeps clinics and school lights on through the evening. Two local technicians per hamlet earn a livelihood maintaining the grid. Children's evening study time tripled, and small businesses — a masala unit, two tailoring shops — started after dark.",
    metrics: [
      { label: "Daily power supply", before: "3–4 hrs", after: "18 hrs", improvement: "+14 hrs", good: true },
      { label: "Evening study time", before: "1.1 hrs", after: "3.4 hrs", improvement: "3×", good: true },
      { label: "Kerosene spend / month", before: "₹640", after: "₹0", improvement: "−100%", good: true },
      { label: "Local technician jobs", before: "0", after: "14", improvement: "14 jobs", good: true },
    ],
    journey: [
      { stage: "Reported", date: "Jul 2025" },
      { stage: "Validated", date: "Jul 2025" },
      { stage: "Matched", date: "Jul 2025" },
      { stage: "Development", date: "Aug 2025" },
      { stage: "Pilot", date: "Dec 2025" },
      { stage: "Deployment", date: "Jul 2026" },
      { stage: "Impact", date: "Oct 2026" },
    ],
    partners: { hei: "BIT Sindri", industry: "GreenGrid Energy LLP" },
    quote: {
      text: "My daughter now studies after sunset. And when the meter shows low balance, the light doesn't go off — it just reminds me.",
      author: "Bhikham Pahan, Hamlet Elder",
      place: "Senha, Lohardaga",
    },
    deployedAgo: "Deployed 4 months ago",
  },
];

export function impactById(id: string): ImpactStory | undefined {
  return IMPACT_STORIES.find((s) => s.id === id);
}
