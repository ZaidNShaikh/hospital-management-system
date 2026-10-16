import React from 'react';

const marks = {
  Activity: <path d="M3 12h4l3-8 4 16 3-8h4"/>,
  ArrowUpRight: <><path d="M7 17 17 7M7 7h10v10"/></>,
  CalendarDays: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/></>,
  Check: <path d="m5 12 4 4L19 6"/>,
  ChevronDown: <path d="m6 9 6 6 6-6"/>,
  CircleHelp: <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.5 1.5c-1.5 1-2 1.5-2 3M12 17h.01"/></>,
  Clock3: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  LayoutDashboard: <><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="11" width="7" height="10" rx="1"/><rect x="3" y="14" width="8" height="7" rx="1"/></>,
  LogOut: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></>,
  Menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
  MoreHorizontal: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  Plus: <><path d="M12 5v14M5 12h14"/></>,
  Search: <><circle cx="10.8" cy="10.8" r="7"/><path d="m16 16 4 4"/></>,
  Settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7-.2.1-1.4.8-.3 1.8h-2.8l-.3-1.8-1.6-.9-1.7.7-1.4-2.4 1.4-1.1v-1.8l-1.4-1.1 1.4-2.4 1.7.7 1.6-.9.3-1.8h2.8l.3 1.8 1.6.9 1.7-.7 1.4 2.4-1.4 1.1z" transform="translate(-1 -1) scale(.92)"/></>,
  ShieldCheck: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/><path d="m9 12 2 2 4-4"/></>,
  Stethoscope: <><path d="M6 3v5a4 4 0 0 0 8 0V3M4 3h4M12 3h4M10 12v2a5 5 0 0 0 10 0v-1"/><circle cx="20" cy="11" r="2"/></>,
  Users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8a4 4 0 0 1 0 7M20 21v-2a4 4 0 0 0-3-3.9"/></>,
  X: <><path d="m18 6-12 12M6 6l12 12"/></>,
  Pencil: <><path d="m16 4 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4.8 15.2 4 20z"/></>,
  Trash2: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/></>,
  HeartPulse: <><path d="M20.8 8.6c0 5.5-8.8 11-8.8 11S3.2 14.1 3.2 8.6A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 8.8 2.6z"/><path d="M4 12h4l2-4 3 8 2-4h5"/></>,
  CalendarCheck: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18m3 5 2 2 4-4"/></>,
  Bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
  FileText: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></>
};
function makeIcon(name) { return function Icon({ size = 20, strokeWidth = 1.8, ...props }) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{marks[name]}</svg>; }; }
export const Activity = makeIcon('Activity');
export const ArrowUpRight = makeIcon('ArrowUpRight');
export const CalendarDays = makeIcon('CalendarDays');
export const Check = makeIcon('Check');
export const ChevronDown = makeIcon('ChevronDown');
export const CircleHelp = makeIcon('CircleHelp');
export const Clock3 = makeIcon('Clock3');
export const LayoutDashboard = makeIcon('LayoutDashboard');
export const LogOut = makeIcon('LogOut');
export const Menu = makeIcon('Menu');
export const MoreHorizontal = makeIcon('MoreHorizontal');
export const Plus = makeIcon('Plus');
export const Search = makeIcon('Search');
export const Settings = makeIcon('Settings');
export const ShieldCheck = makeIcon('ShieldCheck');
export const Stethoscope = makeIcon('Stethoscope');
export const Users = makeIcon('Users');
export const X = makeIcon('X');
export const Pencil = makeIcon('Pencil');
export const Trash2 = makeIcon('Trash2');
export const HeartPulse = makeIcon('HeartPulse');
export const CalendarCheck = makeIcon('CalendarCheck');
export const Bell = makeIcon('Bell');
export const FileText = makeIcon('FileText');
