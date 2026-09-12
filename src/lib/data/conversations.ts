import type { Conversation } from "@/lib/types";

/** Mock conversations for HEI and Industry message tabs. */

export const HEI_CONVERSATIONS: Conversation[] = [
  {
    id: "hei-conv-1",
    participant: "Office of the DC, Bokaro",
    subtitle: "District Administration · Bokaro",
    initials: "DC",
    color: "#0E8A6D",
    lastMessage: "PHED has approved the pilot site list — 6 hand pumps confirmed.",
    time: "2h",
    unread: 2,
    online: true,
    messages: [
      { id: "m1", from: "them", text: "Namaste Dr. Sen. The fluorosis challenge JS-2481 is now on the district agenda. How soon can the pilot sites be finalised?", time: "Mon" },
      { id: "m2", from: "me", text: "Namaste sir. We've shortlisted 6 hand pumps in Petarwar cluster pending PHED concurrence.", time: "Mon" },
      { id: "m3", from: "them", text: "Water quality data for the shortlist has been shared with your team by PHED.", time: "Tue" },
      { id: "m4", from: "me", text: "Received, thank you. Cartridge v2 cleared 90-day lab tests — durability plan signed off.", time: "Tue" },
      { id: "m5", from: "them", text: "PHED has approved the pilot site list — 6 hand pumps confirmed.", time: "2h" },
    ],
  },
  {
    id: "hei-conv-2",
    participant: "Bokaro SensorTech",
    subtitle: "Industry Partner · Sensor Manufacturing",
    initials: "BS",
    color: "#2C8C99",
    lastMessage: "Batch of 50 LoRa nodes dispatched — arrives Thursday.",
    time: "5h",
    unread: 0,
    messages: [
      { id: "m1", from: "me", text: "We need 50 sensor nodes for the Petarwar pilot by end of month.", time: "Wed" },
      { id: "m2", from: "them", text: "Confirmed under the MOU. Calibration spec received?", time: "Wed" },
      { id: "m3", from: "me", text: "Yes, v2 spec with optical turbidity guard.", time: "Wed" },
      { id: "m4", from: "them", text: "Batch of 50 LoRa nodes dispatched — arrives Thursday.", time: "5h" },
    ],
  },
  {
    id: "hei-conv-3",
    participant: "JanSetu Coordination Cell",
    subtitle: "Platform Support",
    initials: "JS",
    color: "#96A33B",
    lastMessage: "3 new challenges matched to your institution this cycle.",
    time: "1d",
    unread: 3,
    messages: [
      { id: "m1", from: "them", text: "Good day! Matching cycle #24 results are in.", time: "1d" },
      { id: "m2", from: "them", text: "3 new challenges matched to your institution this cycle.", time: "1d" },
      { id: "m3", from: "them", text: "Review & accept window closes on 05 Aug.", time: "1d" },
    ],
  },
  {
    id: "hei-conv-4",
    participant: "KVK Ramgarh",
    subtitle: "Krishi Vigyan Kendra · Ramgarh",
    initials: "KV",
    color: "#4E9F6D",
    lastMessage: "KVK Gola training day: 96 farmers onboarded.",
    time: "1d",
    unread: 0,
    messages: [
      { id: "m1", from: "me", text: "Can KVK host the next CropGuard training day at Gola?", time: "Sun" },
      { id: "m2", from: "them", text: "Yes — hall and demo plot booked for Sunday 10 AM.", time: "Sun" },
      { id: "m3", from: "them", text: "KVK Gola training day: 96 farmers onboarded.", time: "1d" },
    ],
  },
  {
    id: "hei-conv-5",
    participant: "Petarwar Water Committee",
    subtitle: "Community Group · Bokaro",
    initials: "PW",
    color: "#D98A1F",
    lastMessage: "Seven members elected. Jairam bhai will be the operator.",
    time: "3d",
    unread: 0,
    messages: [
      { id: "m1", from: "them", text: "Sneha ji, community meeting done. Water committee formed.", time: "3d" },
      { id: "m2", from: "me", text: "Wonderful! Please share the member list for training.", time: "3d" },
      { id: "m3", from: "them", text: "Seven members elected. Jairam bhai will be the operator.", time: "3d" },
    ],
  },
];

export const INDUSTRY_CONVERSATIONS: Conversation[] = [
  {
    id: "ind-conv-1",
    participant: "Dr. Ananya Sen",
    subtitle: "PI, FluorideSafe · BIT Mesra",
    initials: "AS",
    color: "#0E8A6D",
    lastMessage: "The controller specs look good. Can we schedule the site visit?",
    time: "1h",
    unread: 1,
    online: true,
    messages: [
      { id: "m1", from: "me", text: "Dr. Sen, we reviewed the FluorideSafe opportunity on JanSetu. Very interested in sensor manufacturing.", time: "Mon" },
      { id: "m2", from: "them", text: "Welcome! The BOM and specs are attached to the project workspace.", time: "Mon" },
      { id: "m3", from: "me", text: "Reviewed. At 500-unit volume we can hold ₹2,850 landed cost.", time: "Tue" },
      { id: "m4", from: "them", text: "The controller specs look good. Can we schedule the site visit?", time: "1h" },
    ],
  },
  {
    id: "ind-conv-2",
    participant: "Dr. Binod Mahto",
    subtitle: "PI, SolarSetu · BIT Sindri",
    initials: "BM",
    color: "#96A33B",
    lastMessage: "Battery bank quote received — LFP with 8-yr warranty at ₹6.1L.",
    time: "4h",
    unread: 0,
    messages: [
      { id: "m1", from: "me", text: "Dr. Mahto, GreenGrid can supply LFP banks for the 120-connection pilot.", time: "Fri" },
      { id: "m2", from: "them", text: "Please share warranty terms and cycle-life data.", time: "Fri" },
      { id: "m3", from: "me", text: "Shared — 6,000 cycles at 80% DoD, 8-year warranty.", time: "Sat" },
      { id: "m4", from: "them", text: "Battery bank quote received — LFP with 8-yr warranty at ₹6.1L.", time: "4h" },
    ],
  },
  {
    id: "ind-conv-3",
    participant: "JanSetu Industry Desk",
    subtitle: "Platform Support",
    initials: "JS",
    color: "#2C8C99",
    lastMessage: "Your expression of interest for MatriCare was forwarded to CU Jharkhand.",
    time: "1d",
    unread: 2,
    messages: [
      { id: "m1", from: "them", text: "Thank you for expressing interest in MatriCare kits.", time: "1d" },
      { id: "m2", from: "them", text: "Your expression of interest for MatriCare was forwarded to CU Jharkhand.", time: "1d" },
      { id: "m3", from: "them", text: "Expected response window: 5 working days.", time: "1d" },
    ],
  },
  {
    id: "ind-conv-4",
    participant: "Dr. Nitin Choudhary",
    subtitle: "PI, Segrego · NIT Jamshedpur",
    initials: "NC",
    color: "#4E9F6D",
    lastMessage: "City replication playbook draft is ready for your review.",
    time: "2d",
    unread: 0,
    messages: [
      { id: "m1", from: "me", text: "Dr. Choudhary, we'd like to be the offtake partner for the Dhanbad MRF.", time: "Thu" },
      { id: "m2", from: "them", text: "Good to hear. 210 T/month guaranteed stream possible.", time: "Thu" },
      { id: "m3", from: "them", text: "City replication playbook draft is ready for your review.", time: "2d" },
    ],
  },
];

export function convById(id: string): Conversation | undefined {
  return [...HEI_CONVERSATIONS, ...INDUSTRY_CONVERSATIONS].find((c) => c.id === id);
}
