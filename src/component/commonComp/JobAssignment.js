"use client";

import { useEffect, useState } from "react";
import clsx from "clsx"; // Optional: Tailwind helper for conditional classes

const jobs = [
  {
    id: "JOB106731",
    name: "Cameron Williamson",
    address: "4140 Parker Rd.",
    city: "Allentown, New Mexico 31134",
  },
  {
    id: "JOB106732",
    name: "Cameron Williamson",
    address: "4140 Parker Rd.",
    city: "Allentown, New Mexico 31134",
  },
  {
    id: "JOB106733",
    name: "Cameron Williamson",
    address: "4140 Parker Rd.",
    city: "Allentown, New Mexico 31134",
  },
];

export default function JobAssignment({ isDrawer = false, onClose }) {
  const [tab, setTab] = useState("Unassigned");
  const [visible, setVisible] = useState(false);

  // Open with animation after mount
  useEffect(() => {
    if (isDrawer) {
      // Allow the component to mount before starting the animation
      setTimeout(() => setVisible(true), 10);
    }
  }, [isDrawer]);

  // Close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isDrawer && onClose) {
        setVisible(false);
        setTimeout(onClose, 600); // Wait for animation before unmounting
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawer, onClose]);

  // Close smoothly
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 600); // Match transition duration
  };

  // Panel class (sliding)
  const panelClasses = isDrawer
    ? clsx(
      "fixed top-0 right-0 z-999 h-full sm:w-[90%]  sm:max-w-sm bg-white shadow-lg transition-transform duration-600 ease-in-out",
      visible ? "translate-x-0" : "translate-x-full"
    )
    : "h-[calc(100vh-69px)] border-l border-gray-300 w-[300px]";

  return (
    <>
      {/* Overlay */}
      {isDrawer && (
        <div
          className="fixed inset-0 bg-black/30 z-99 transition-opacity duration-600"
          onClick={handleClose}
        />
      )}

      {/* Drawer panel */}
      <div className={panelClasses}>
        {/* Header (only on drawer) */}
        {isDrawer && (
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="sm:text-lg text:[16px] font-semibold">Job Assignment</h2>
            <button onClick={handleClose} className="text-sm text-gray-600">
              ✕
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="px-4 py-[10.9px] flex border-b-[2px] border-l-[1px] border-gray-200 text-[12px] sm:text-[14px] justify-center gap-0.5 mb-4">
          <button
            className={`py-1 px-4 rounded-lg ${tab === "Assigned"
              ? "bg-[#FAFAFA] border border-[#dfdcdc8a]"
              : "text-gray-500"
              }`}
            onClick={() => setTab("Assigned")}
          >
            Assigned
          </button>
          <button
            className={`py-1 px-4 rounded-lg ${tab === "Unassigned"
              ? "bg-[#FAFAFA] border border-[#dfdcdc8a]"
              : "text-gray-500"
              }`}
            onClick={() => setTab("Unassigned")}
          >
            Unassigned
          </button>
        </div>

        {/* Assign All Button and Jobs */}
        <div className="px-4">
          <button className="flex items-center justify-center w-full py-2 mb-4 rounded-lg bg-[#FAFAFA] border border-[#dfdcdc8a] text-black font-medium text-[14px] sm:text-[15px]">
            Assign All <span className="text-[15px] lg:text-[18px] bg-gradient-to-r from-[#3E51FF] to-[#3CFFB9] bg-clip-text text-transparent text-xl">
              ✨
            </span>
          </button>

          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-220px)] pb-4">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="flex justify-between items-center gap-3 pb-4 border-b border-[#dfdcdc8a]"
              >
                <div>
                  <h3 className="font-medium text-[13px] sm:text-[14px]">{job.name}</h3>
                  <p className="text-[12px] sm:text-[13px] text-gray-500">{job.address}</p>
                  <p className="text-[12px] sm:text-[13px] text-gray-500">{job.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 font-medium text-[13px] sm:text-sm mb-2">{job.id}</p>
                  <button className="px-5 py-1 rounded-md text-[12px] sm:text-[13px] bg-[#FAFAFA] border border-[#dfdcdc8a] hover:bg-gray-100">
                    Assign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
