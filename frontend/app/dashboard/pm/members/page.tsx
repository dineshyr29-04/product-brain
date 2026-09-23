"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  Lock,
  Search,
  Mail,
  Building,
  Key
} from "lucide-react";
import DepartmentGuard from "@/components/DepartmentGuard";
import PMNavHeader from "@/components/PMNavHeader";
import { getTeamMembers, addTeamMember, removeTeamMember, UserProfile } from "@/lib/authHelper";

export default function PMMembersPage() {
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<"sales" | "engineering">("sales");
  const [newMemberName, setNewMemberName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    setTeamMembers(getTeamMembers());
  }, []);

  const handleAddNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;

    const added = addTeamMember(newMemberEmail.trim(), newMemberRole, newMemberName.trim());
    setTeamMembers(getTeamMembers());
    setNewMemberEmail("");
    setNewMemberName("");
    showToast(
      `✓ Access granted to ${added.email} for ${added.role === "sales" ? "Sales Department" : "Engineering Team"}!`
    );
  };

  const handleDeleteMember = (id: string, name: string) => {
    removeTeamMember(id);
    setTeamMembers(getTeamMembers());
    showToast(`✓ Revoked access for ${name}.`);
  };

  const filteredMembers = teamMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DepartmentGuard requiredRole="pm">
      <div className="min-h-screen bg-[#F7F5F3] text-[#37322F]">
        <PMNavHeader
          activeTab="members"
          onRefresh={() => {
            setTeamMembers(getTeamMembers());
            showToast("Workspace member roster refreshed!");
          }}
        />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#252220] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium border border-[#4a4643]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <main className="w-full px-6 lg:px-10 py-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-white border border-[#e0dedb] rounded-xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-[#37322F] flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Workspace Member Access & Department Authorizations</span>
              </h1>
              <p className="text-xs text-[#828387] mt-1">
                PM Admin Exclusive Authority: Control which team members can sign into Sales or Engineering workspaces.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-lg border border-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>PM Admin Governance Active</span>
              </span>
            </div>
          </div>

          {/* Form to Authorize New Member */}
          <section className="bg-white border border-[#e0dedb] rounded-xl shadow-xs p-6 space-y-4">
            <div className="border-b border-[#e0dedb] pb-3">
              <h2 className="text-base font-extrabold text-[#37322F] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-600" />
                <span>Authorize New Department Member</span>
              </h2>
              <p className="text-xs text-[#828387] mt-0.5">
                Members added here will be granted login access to their designated department workspace portal.
              </p>
            </div>

            <form onSubmit={handleAddNewMember} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-[#828387] mb-1">Member Name</label>
                <input
                  type="text"
                  placeholder="e.g. David Kim"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#828387] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="david@company.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#828387] mb-1">Assigned Department Access</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as "sales" | "engineering")}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F] font-medium focus:outline-none"
                >
                  <option value="sales">Sales Department Portal</option>
                  <option value="engineering">Engineering Team Portal</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#37322F] text-white font-extrabold text-xs rounded-lg hover:bg-[#252220] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Grant Workspace Access</span>
                </button>
              </div>
            </form>
          </section>

          {/* Active Workspace Member Roster */}
          <section className="bg-white border border-[#e0dedb] rounded-xl shadow-xs p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e0dedb] pb-4">
              <div>
                <h2 className="text-base font-extrabold text-[#37322F] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Authorized Member Roster ({teamMembers.length})</span>
                </h2>
                <p className="text-xs text-[#828387] mt-0.5">
                  Full list of team members currently authorized for department login.
                </p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#828387] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter members / email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#d8d5d0] bg-white text-[#37322F] w-48 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F6] border-b border-[#e0dedb] text-[#828387] uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-6">MEMBER NAME & TITLE</th>
                    <th className="py-3 px-4">EMAIL ADDRESS</th>
                    <th className="py-3 px-4">AUTHORIZED DEPARTMENT PORTAL</th>
                    <th className="py-3 px-4">ACCESS STATUS</th>
                    <th className="py-3 px-6 text-right">REVOKE PERMISSIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede9]">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-[#FAF8F6] transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-extrabold text-sm text-[#37322F]">{m.name}</div>
                        <div className="text-[11px] text-[#828387]">{m.title || "Team Member"}</div>
                      </td>

                      <td className="py-4 px-4 font-mono text-xs text-[#37322F]">
                        {m.email}
                      </td>

                      <td className="py-4 px-4">
                        {m.role === "sales" ? (
                          <span className="px-2.5 py-1 text-[11px] font-extrabold rounded bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                            <span>Sales Department</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-[11px] font-extrabold rounded bg-purple-50 text-purple-800 border border-purple-200 inline-flex items-center gap-1">
                            <span>Engineering Team</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ✓ Authorized by PM
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDeleteMember(m.id, m.name)}
                          className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg hover:bg-rose-100 inline-flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Revoke Access</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </DepartmentGuard>
  );
}
