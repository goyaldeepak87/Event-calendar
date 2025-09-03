"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import { ChevronDown, ChevronRight, ChevronLeft } from "react-feather";
import dayjs from "dayjs";
import JobAssignment from "./JobAssignment";

export default function TeamSchedulerDashboard() {
  const calendarRef = useRef(null);
  const dropdownRefs = {
    view: useRef(null),
    timer: useRef(null),
    status: useRef(null),
  };

  const [slotDuration, setSlotDuration] = useState("01:00:00");
  const [currentViewLabel, setCurrentViewLabel] = useState("Day");
  const [calendarTitle, setCalendarTitle] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Status");
  const [teamFilter, setTeamFilter] = useState("Team");
  const [showJobDrawer, setShowJobDrawer] = useState(false);
  const [tab, setTab] = useState("Team View");
  const [resourceWidth, setResourceWidth] = useState("150px");

  const durationOptions = [
    { label: "30 min", value: "00:30:00" },
    { label: "1 hour", value: "01:00:00" },
    { label: "2 hours", value: "02:00:00" },
  ];

  const statusOptions = ["All", "Active", "Pending", "Complete"];

  const resources = [
    { id: 1, title: "Member 1", bgcolor: "#F5A623" },
    { id: 2, title: "Member 2", bgcolor: "#9AE095" },
    { id: 3, title: "Member 3", bgcolor: "#74EBE1" },
    { id: 4, title: "Member 4", bgcolor: "#9EE1FF" },
    { id: 5, title: "Member 5", bgcolor: "#A0C6FF" },
    { id: 6, title: "Member 6", bgcolor: "#A0FFB5" },
    { id: 7, title: "Member 7", bgcolor: "#FFA0F9" },
    { id: 8, title: "Member 8", bgcolor: "#FFE1A0" },
    { id: 9, title: "Member 9", bgcolor: "#FFA0A0" },
    { id: 10, title: "Member 10", bgcolor: "#C0A0FF" },
    { id: 11, title: "Member 11", bgcolor: "#FFFFA0" },
  ];

  const today = dayjs().format("YYYY-MM-DD");
  const events = [
  { id: "1", resourceId: "2", title: "Alice Brown", start: `${today}T08:00:00`, end: `${today}T09:45:00`, status: "complete", client: { name: "John Doe", phone: "1234567890" } },
  { id: "2", resourceId: "2", title: "Michael Green", start: `${today}T13:30:00`, end: `${today}T15:30:00`, status: "complete", client: { name: "Jane Smith", phone: "9876543210" } },
  { id: "3", resourceId: "5", title: "Sophia Miller", start: `${today}T10:30:00`, end: `${today}T12:30:00`, status: "active", client: { name: "Bob Johnson", phone: "5555555555" } },
  { id: "4", resourceId: "8", title: "James Wilson", start: `${today}T12:30:00`, end: `${today}T14:30:00`, status: "active", client: { name: "Bob Johnson", phone: "5555555555" } },
  { id: "5", resourceId: "8", title: "Olivia Davis", start: `${today}T16:30:00`, end: `${today}T18:30:00`, status: "pending", client: { name: "Bob Johnson", phone: "5555555555" } },
  { id: "6", resourceId: "11", title: "Ethan Martinez", start: `${today}T09:00:00`, end: `${today}T11:00:00`, status: "complete", client: { name: "Bob Johnson", phone: "5555555555" } },
];

  // Filtered events
  const filteredEvents = events.filter(e => statusFilter === "All" || statusFilter === "Status" || e.status.toLowerCase() === statusFilter.toLowerCase());

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = e => {
      Object.values(dropdownRefs).forEach(ref => {
        if (ref.current && !ref.current.contains(e.target)) setOpenDropdown(null);
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calendar title setter
  const onDatesSet = useCallback(arg => {
    const startDate = dayjs(arg.start);
    const endDate = dayjs(arg.end);
    let title = currentViewLabel === "Week"
      ? `${startDate.format("MMM D")} - ${endDate.subtract(1, "day").format("MMM D, YYYY")}`
      : startDate.format("MMMM YYYY");
    setCalendarTitle(title);
  }, [currentViewLabel]);

  // Resize handler for responsive widths
  useEffect(() => {
    const updateWidth = () => setResourceWidth(window.innerWidth < 768 ? "96px" : "150px");
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Navigation handlers
  const goPrev = () => calendarRef.current?.getApi().prev();
  const goNext = () => calendarRef.current?.getApi().next();
  const goToday = () => calendarRef.current?.getApi().today();

  // Event styling
  const eventClassNames = arg => ({
    active: "bg-[#EEF6FF] border border-green-600",
    pending: "bg-[#EEF6FF] border border-yellow-500",
    complete: "bg-[#EEF6FF] border border-gray-600 line-through"
  }[arg.event.extendedProps.status] || "");

  // Event click handler
  const handleEventClick = clickInfo => {
    const client = clickInfo.event.extendedProps.client;
    if (client) alert(`Client Info:\nName: ${client.name}\nPhone: ${client.phone}`);
  };

  // Month navigation
  const goNextMonth = () => calendarRef.current?.getApi().incrementDate({ months: -1 });


  const adjustEventHeights = () => {
    const calendarEl = calendarRef.current?.getApi()?.el;
    if (!calendarEl) return;

    // Select all timeline events
    const eventsEls = calendarEl.querySelectorAll(".fc-timeline-event-harness");
    eventsEls.forEach((el) => {
      const parentRow = el.closest(".fc-timeline-lane-frame");
      if (parentRow) {
        const rowHeight = parentRow.offsetHeight;

        // Adjust the outer harness
        // el.style.height = `${rowHeight}px`;

        // Adjust the inner 'flex' div inside .fc-event-main
        const innerDiv = el.querySelector(".fc-event-main > div");
        if (innerDiv) {
          innerDiv.style.height = `${rowHeight}px`;
        }

        // Optional: make the <a> tag fill the row
        const anchor = el.querySelector("a.fc-event");
        if (anchor) {
          anchor.style.height = `${rowHeight}px`;
        }
      }
    });
  };

  useEffect(() => {
    setTimeout(() => adjustEventHeights(), 0);
  }, []);
  return (
    <div>
      {/* Header with Month */}
      <div className="sm:p-4 p-2 sm:flex items-center border-b border-[#ddd] text-[14px] sm:text-xl select-none">
        <div className="mb-2 flex items-center w-[180px]" onClick={goNextMonth}>
          <ChevronRight size={20} className="sm:w-[20px] w-[14px]" style={{ marginRight: 5, transform: "rotate(180deg)" }} />
          <span>
            {(() => {
              const [month, year] = calendarTitle.split(" ");
              return <span><span className="sm:font-semibold">{month}</span> {year}</span>;
            })()}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex flex-1 justify-center gap-3 text-[12px] sm:text-[14px]">
          {["Events", "Team View", "Team Tracking"].map(t => (
            <button key={t} className={`py-1 px-4 rounded-lg cursor-pointer ${tab === t ? "bg-[#FAFAFA] border border-[#dfdcdc8a]" : "text-gray-500"}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 bg-white">
          <div className="px-4 py-2 sm:flex items-center justify-between lg:border-b border-[#ddd]">
            {/* Filters */}
            <div className="flex items-center gap-2">
              {[{ label: statusFilter }, { label: teamFilter }].map((btn, i) => (
                <div key={i} className="relative" ref={dropdownRefs.status}>
                  <button onClick={() => setOpenDropdown(openDropdown === i ? null : i)} className="flex items-center gap-1 text-[13px] sm:text-[14px] py-2 rounded-md cursor-pointer">{btn.label} <ChevronDown size={15} /></button>
                </div>
              ))}
            </div>

            {/* Timer + View + Navigation */}
            <div className="flex sm:justify-end justify-center gap-1">
              {/* Timer Dropdown */}
              <div className="relative" ref={dropdownRefs.timer}>
                <button onClick={() => setOpenDropdown(openDropdown === "timer" ? null : "timer")} className="flex items-center gap-1 text-[13px] sm:text-[14px] mx-1 py-2 cursor-pointer">
                  {durationOptions.find(d => d.value === slotDuration)?.label || "Select Duration"} <ChevronDown size={15} />
                </button>
                {openDropdown === "timer" && (
                  <ul className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg min-w-[80px] sm:min-w-[140px] z-50">
                    {durationOptions.map(({ label, value }) => (
                      <li key={value} onClick={() => { setSlotDuration(value); setOpenDropdown(null); }} className="px-4 py-2 text-[12px] sm:text-sm cursor-pointer hover:bg-gray-100">{label}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* View Dropdown */}
              <div className="relative" ref={dropdownRefs.view}>
                <button onClick={() => setOpenDropdown(openDropdown === "view" ? null : "view")} className="flex items-center gap-1 text-[13px] sm:text-[14px] mx-2 px-1 py-2 rounded-md cursor-pointer">
                  {currentViewLabel} <ChevronDown size={15} />
                </button>
                {openDropdown === "view" && (
                  <ul className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg min-w-[80px] sm:min-w-[120px] z-50">
                    {["Day", "Week", "Month"].map(v => (
                      <li key={v} onClick={() => { calendarRef.current?.getApi().changeView(`resourceTimeline${v}`); setCurrentViewLabel(v); setOpenDropdown(null); }} className="px-4 py-2 text-[12px] sm:text-sm cursor-pointer hover:bg-gray-100">{v}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Prev/Today/Next */}
              <div className="flex items-center gap-0.5">
                <button onClick={goPrev} className="bg-[#FAFAFA] border border-[#dfdcdc8a] text-black sm:px-3 px-1 sm:py-2 py-1 rounded-l font-semibold cursor-pointer"><ChevronRight size={15} style={{ transform: "rotate(180deg)" }} /></button>
                <button onClick={goToday} className="bg-[#FAFAFA] border border-[#dfdcdc8a] text-black px-[5px] py-[2.5px] sm:px-3 sm:py-[5px] sm:text-[14px] text-[12px] uppercase tracking-wide cursor-pointer">Today</button>
                <button onClick={goNext} className="bg-[#FAFAFA] border border-[#dfdcdc8a] text-black sm:px-3 px-1 sm:py-2 py-1 rounded-r font-semibold cursor-pointer"><ChevronLeft size={15} style={{ transform: "rotate(180deg)" }} /></button>
              </div>
              <button className="flex-1 sm:flex-none flex sm:block justify-end  items-center">
                <div
                  onClick={() => setShowJobDrawer(true)}
                  className="lg:hidden ml-4 "
                >
                  <svg className="sm:h-6 sm:w-6 h-5 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div className="px-2 lg:px-0">
            <FullCalendar
              ref={calendarRef}
              plugins={[resourceTimelinePlugin, interactionPlugin]}
              initialView="resourceTimelineDay"
              slotMinTime="06:00:00"
              slotDuration={slotDuration}
              resources={resources}
              events={filteredEvents}
              eventClassNames={eventClassNames}
              eventClick={handleEventClick}
              resourceAreaWidth={resourceWidth}
              headerToolbar={false}
              contentHeight="auto"
              datesSet={onDatesSet}
              resourceAreaHeaderContent="Team"
              resourceLabelContent={({ resource }) => ({
                html: `<span style="display:flex; align-items:center; gap:5px;">
                  <div style="width:8px; height:8px; border-radius:60px; background:${resource.extendedProps.bgcolor};"></div>
                  ${resource.title}
                </span>`
              })}
              resourceOrder={(a, b) => a.id - b.id}
              eventContent={({ event }) => {
                const startTime = dayjs(event.start).format("hh:mm A");
                const endTime = dayjs(event.end).format("hh:mm A");
                const statusClasses = {
                  active: "bg-[#FBF5FF] [box-shadow:-5px_0_0_0_#E8E3F5]",
                  pending: "bg-[#FEF7EC] [box-shadow:-5px_0_0_0_#EFD8C0]",
                  complete: "bg-[#EEF6FF] [box-shadow:-5px_0_0_0_#CBDDEE]"
                }[event.extendedProps.status] || "bg-[#EEF6FF]";

                return (
                  <div className={`flex ml-[4px] rounded-[8px] flex-col justify-center items-start px-1 w-full ${statusClasses}`}>
                    <span className="font-medium  text-black text-[12px] sm:text-[13px]">{event.title}</span>
                    <span className="text-gray-600 text-[9px]">{startTime} - {endTime}</span>
                  </div>
                );
              }}
            />
          </div>
        </div>

        <div className="hidden lg:block"><JobAssignment /></div>
        {showJobDrawer && <JobAssignment isDrawer={true} onClose={() => setShowJobDrawer(false)} />}
      </div>
    </div>
  );
}
