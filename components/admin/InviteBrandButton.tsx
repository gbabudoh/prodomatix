"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import InviteBrandModal from "@/components/admin/InviteBrandModal";

export default function InviteBrandButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        Invite New Brand
      </button>
      
      <InviteBrandModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
